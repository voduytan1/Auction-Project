package com.example.backend.schedule;

import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserScheduler {
    private final UserRepository userRepository;

    @Scheduled(cron = "0 0 * * * *") // Chạy vào phút thứ 0 của mỗi giờ (mỗi tiếng check 1 lần)
    public void checkAndRevokeSellerRole() {
        LocalDateTime now = LocalDateTime.now();
        log.info("Bắt đầu quét các Seller hết hạn lúc: {}", now);

        int count = userRepository.revokeExpiredSellers(now);

        if (count > 0) {
            log.info("Đã thu hồi quyền của {} seller hết hạn.", count);
        } else {
            log.info("Không có seller nào hết hạn trong đợt quét này.");
        }
    }
}
