# WebSocket Integration - Real-time Bidding

## Backend Setup

### 1. Dependencies
WebSocket đã được thêm vào `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

### 2. WebSocket Endpoints

#### Connection Endpoint
```
ws://localhost:8080/ws
```

#### Topics (Subscribe)
Client subscribe các topics sau để nhận real-time updates:

1. **Bid Updates** - Nhận thông báo khi giá sản phẩm thay đổi
   ```
   /topic/product/{productId}/bids
   ```
   Response: `BidUpdateMessage`
   ```json
   {
     "productId": 123,
     "giaHienTai": 10500000,
     "currentBidder": "****Khoa",
     "soLuotRaGia": 15,
     "thoiGianDat": "2025-12-24T10:30:00",
     "eventType": "AUTO_BID",
     "message": "Giá được cập nhật tự động"
   }
   ```

2. **Bid History** - Nhận lịch sử đấu giá mới
   ```
   /topic/product/{productId}/history
   ```
   Response: `BidHistoryItemMessage`
   ```json
   {
     "bidHistoryId": 456,
     "productId": 123,
     "bidderName": "****Tuấn",
     "giaDat": 10500000,
     "thoiGianDat": "2025-12-24T10:30:00"
   }
   ```

3. **Product Status** - Nhận thông báo thay đổi trạng thái sản phẩm
   ```
   /topic/product/{productId}/status
   ```
   Response: `ProductStatusMessage`
   ```json
   {
     "productId": 123,
     "status": "COMPLETED",
     "message": "Đấu giá đã kết thúc",
     "winnerId": "uuid-here",
     "winnerName": "****Khoa"
   }
   ```

### 3. Event Types
- `NEW_BID` - Lượt đặt giá thủ công mới
- `AUTO_BID` - Giá cập nhật từ auto-bidding
- `BUY_NOW` - Sản phẩm được mua ngay

---

## Frontend Integration

### 1. Install Dependencies

#### React/Next.js
```bash
npm install sockjs-client @stomp/stompjs
```

#### Vue.js
```bash
npm install sockjs-client @stomp/stompjs
```

### 2. React Example

#### Create WebSocket Hook: `useWebSocket.js`
```javascript
import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const useProductBidding = (productId) => {
  const [bidUpdate, setBidUpdate] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!productId) return;

    // Create WebSocket connection
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log('STOMP:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // On connect
    stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);

      // Subscribe to bid updates
      stompClient.subscribe(
        `/topic/product/${productId}/bids`,
        (message) => {
          const update = JSON.parse(message.body);
          console.log('Bid Update:', update);
          setBidUpdate(update);
        }
      );

      // Subscribe to bid history
      stompClient.subscribe(
        `/topic/product/${productId}/history`,
        (message) => {
          const historyItem = JSON.parse(message.body);
          console.log('New Bid History:', historyItem);
          setBidHistory((prev) => [historyItem, ...prev]);
        }
      );

      // Subscribe to product status
      stompClient.subscribe(
        `/topic/product/${productId}/status`,
        (message) => {
          const status = JSON.parse(message.body);
          console.log('Product Status:', status);
          // Handle status change
        }
      );
    };

    // On error
    stompClient.onStompError = (frame) => {
      console.error('STOMP error:', frame);
      setIsConnected(false);
    };

    // Activate
    stompClient.activate();
    clientRef.current = stompClient;

    // Cleanup
    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [productId]);

  return { bidUpdate, bidHistory, isConnected };
};
```

#### Usage in Component
```javascript
import React from 'react';
import { useProductBidding } from './hooks/useWebSocket';

const ProductDetailPage = ({ productId }) => {
  const { bidUpdate, bidHistory, isConnected } = useProductBidding(productId);

  return (
    <div>
      <div>Connection: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</div>
      
      {/* Current Price */}
      {bidUpdate && (
        <div className="current-bid">
          <h2>Giá hiện tại: {bidUpdate.giaHienTai.toLocaleString()} VNĐ</h2>
          <p>Người đặt: {bidUpdate.currentBidder}</p>
          <p>Số lượt: {bidUpdate.soLuotRaGia}</p>
          <p>{bidUpdate.message}</p>
        </div>
      )}

      {/* Bid History */}
      <div className="bid-history">
        <h3>Lịch sử đấu giá</h3>
        {bidHistory.map((item) => (
          <div key={item.bidHistoryId}>
            <span>{item.thoiGianDat}</span>
            <span>{item.bidderName}</span>
            <span>{item.giaDat.toLocaleString()} VNĐ</span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 3. Vue.js Example

#### Composable: `useProductBidding.js`
```javascript
import { ref, onMounted, onUnmounted } from 'vue';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const useProductBidding = (productId) => {
  const bidUpdate = ref(null);
  const bidHistory = ref([]);
  const isConnected = ref(false);
  let stompClient = null;

  onMounted(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log('STOMP:', str),
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      isConnected.value = true;

      // Subscribe to bid updates
      stompClient.subscribe(
        `/topic/product/${productId.value}/bids`,
        (message) => {
          bidUpdate.value = JSON.parse(message.body);
        }
      );

      // Subscribe to bid history
      stompClient.subscribe(
        `/topic/product/${productId.value}/history`,
        (message) => {
          const item = JSON.parse(message.body);
          bidHistory.value.unshift(item);
        }
      );
    };

    stompClient.activate();
  });

  onUnmounted(() => {
    if (stompClient) {
      stompClient.deactivate();
    }
  });

  return { bidUpdate, bidHistory, isConnected };
};
```

### 4. Angular Example

#### Service: `websocket.service.ts`
```typescript
import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client;
  private bidUpdateSubject = new BehaviorSubject<any>(null);
  private bidHistorySubject = new BehaviorSubject<any[]>([]);

  constructor() {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });
  }

  connect(productId: number): void {
    this.stompClient.onConnect = () => {
      // Subscribe to bid updates
      this.stompClient.subscribe(
        `/topic/product/${productId}/bids`,
        (message) => {
          this.bidUpdateSubject.next(JSON.parse(message.body));
        }
      );

      // Subscribe to bid history
      this.stompClient.subscribe(
        `/topic/product/${productId}/history`,
        (message) => {
          const item = JSON.parse(message.body);
          const current = this.bidHistorySubject.value;
          this.bidHistorySubject.next([item, ...current]);
        }
      );
    };

    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }

  getBidUpdates(): Observable<any> {
    return this.bidUpdateSubject.asObservable();
  }

  getBidHistory(): Observable<any[]> {
    return this.bidHistorySubject.asObservable();
  }
}
```

---

## Testing WebSocket

### Using Browser Console
```javascript
// In browser console
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function(frame) {
  console.log('Connected: ' + frame);
  
  // Subscribe to product 1
  stompClient.subscribe('/topic/product/1/bids', function(message) {
    console.log('Received:', JSON.parse(message.body));
  });
});
```

---

## Production Considerations

1. **CORS Configuration**
   - Update `WebSocketConfig.java` để chỉ cho phép origins cụ thể
   ```java
   registry.addEndpoint("/ws")
           .setAllowedOrigins("https://yourdomain.com")
           .withSockJS();
   ```

2. **Authentication**
   - Thêm JWT token vào WebSocket connection
   - Implement `ChannelInterceptor` để validate token

3. **Scalability**
   - Sử dụng RabbitMQ hoặc Redis để scale horizontally
   - Replace `enableSimpleBroker()` với `enableStompBrokerRelay()`

4. **Error Handling**
   - Implement reconnection logic
   - Handle connection timeouts
   - Show user-friendly error messages

---

## Event Flow

```
User places autobid
     ↓
AutoBidService.placeAutoBid()
     ↓
AutoBidService.runAutoBidCompetition()
     ↓
Product & BidHistory saved
     ↓
WebSocketEventPublisher.publishBidUpdate()
     ↓
All connected clients receive update
     ↓
Frontend updates UI automatically
```

---

## Troubleshooting

### Connection fails
- Check backend is running on port 8080
- Verify CORS settings
- Check browser console for errors

### Messages not received
- Verify subscription topic matches exactly
- Check productId is correct
- Look for WebSocket errors in browser DevTools

### Reconnection issues
- Implement exponential backoff
- Add connection status indicator
- Handle stale connections

---

## Additional Features to Implement

1. **Typing Indicators** - Show when seller is typing response
2. **Online Users** - Display active bidders count
3. **Notification Sound** - Play sound on new bid
4. **Toast Notifications** - Show popup on outbid
5. **Optimistic Updates** - Update UI before server confirms
