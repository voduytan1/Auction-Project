# 🚀 ELK Stack + MySQL + Auto Password Setup

Dự án bao gồm:
- Elasticsearch
- Kibana
- Logstash
- MySQL
- Script tự động set password cho:
    - `kibana_system`
    - `logstash_system`

---

## 📦 Yêu cầu

- Docker ≥ 20.10
- Docker Compose ≥ v2
- Kết nối Internet để pull image

---

## 🛠 Cách chạy dự án

### 1️⃣ Clone dự án

```bash
git clone https://github.com/your-repo/your-project.git
cd your-project
```

---

### 2️⃣ Tạo file `.env`

```bash
cp .env.example .env
```

Sau đó chỉnh sửa giá trị trong `.env`:

```env
ELASTIC_USER=elastic
ELASTIC_PASSWORD=your_elastic_password

KIBANA_SYSTEM_PASSWORD=your_kibana_system_password
LOGSTASH_SYSTEM_PASSWORD=your_logstash_system_password
```

---

### 3️⃣ Cấp quyền chạy cho script init (BẮT BUỘC)

Script init không chạy được nếu không cấp quyền thực thi.

```bash
chmod +x es-init/*.sh
```

> Nếu bỏ qua, Elasticsearch sẽ không set password → Kibana & Logstash bị lỗi 401.

---

### 4️⃣ Khởi động toàn bộ hệ thống

```bash
docker compose up -d --build
```

Lần chạy đầu tiên mất ~30–60 giây để Elasticsearch khởi động và script thiết lập user.

---

## 🔍 Kiểm tra dịch vụ

### Elasticsearch
Mở:  
http://localhost:9200

---

### Kibana
http://localhost:5601

Đăng nhập bằng:

```
Username: kibana_system
Password: (giá trị trong .env)
```

---

### Logstash
Logstash tự authenticate với Elasticsearch bằng user:

```
logstash_system
```

---

## 🧪 Kiểm tra password có được set chưa

### Kiểm tra Kibana:

```bash
curl -u kibana_system:$KIBANA_SYSTEM_PASSWORD http://localhost:9200/_security/_authenticate
```

### Kiểm tra Logstash:

```bash
curl -u logstash_system:$LOGSTASH_SYSTEM_PASSWORD http://localhost:9200/_security/_authenticate
```

Nếu trả về JSON thông tin user → thành công.

---

## 🧹 Dọn dẹp container

Dừng:

```bash
docker compose down
```

Dừng + xoá data:

```bash
docker compose down -v
```

---

## ❗ Lỗi thường gặp

### 1. ❌
