package com.example.backend.utils;

import java.time.*;
import java.time.temporal.TemporalAdjusters;

public class DateUtils {
    private static final ZoneId USER_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    // Múi giờ lưu trong Database (Thường là UTC).
    // Nếu DB của bạn lưu UTC+7 luôn thì sửa thành ZoneId.of("Asia/Ho_Chi_Minh")
    private static final ZoneId DB_ZONE = ZoneId.of("UTC");

    /**
     * Lấy thời điểm bắt đầu của ngày hiện tại (00:00:00 VN)
     * Đã convert sang giờ DB
     */
    public static LocalDateTime getStartOfToday() {
        return getStartOfDay(LocalDate.now(USER_ZONE));
    }

    /**
     * Lấy thời điểm kết thúc của ngày hiện tại (23:59:59.999999999 VN)
     * Đã convert sang giờ DB
     */
    public static LocalDateTime getEndOfToday() {
        return getEndOfDay(LocalDate.now(USER_ZONE));
    }

    /**
     * Lấy thời điểm bắt đầu tuần này (Thứ 2, 00:00:00 VN)
     * Đã convert sang giờ DB
     */
    public static LocalDateTime getStartOfWeek() {
        LocalDate today = LocalDate.now(USER_ZONE);
        // Ở VN/ISO tuần bắt đầu từ Thứ 2
        LocalDate monday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        return getStartOfDay(monday);
    }

    /**
     * Lấy thời điểm kết thúc tuần này (Chủ nhật, 23:59:59 VN)
     * Đã convert sang giờ DB
     */
    public static LocalDateTime getEndOfWeek() {
        LocalDate today = LocalDate.now(USER_ZONE);
        LocalDate sunday = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
        return getEndOfDay(sunday);
    }

    /**
     * Lấy thời điểm bắt đầu tháng này (Ngày 1, 00:00:00 VN)
     */
    public static LocalDateTime getStartOfMonth() {
        LocalDate today = LocalDate.now(USER_ZONE);
        LocalDate firstDay = today.with(TemporalAdjusters.firstDayOfMonth());
        return getStartOfDay(firstDay);
    }

    /**
     * Lấy thời điểm kết thúc tháng này
     */
    public static LocalDateTime getEndOfMonth() {
        LocalDate today = LocalDate.now(USER_ZONE);
        LocalDate lastDay = today.with(TemporalAdjusters.lastDayOfMonth());
        return getEndOfDay(lastDay);
    }

    public static LocalDateTime getStartOfYear() {
        LocalDate today = LocalDate.now(USER_ZONE);
        LocalDate firstDay = today.with(TemporalAdjusters.firstDayOfYear());
        return getStartOfDay(firstDay);
    }

    public static LocalDateTime getEndOfYear() {
        LocalDate today = LocalDate.now(USER_ZONE);
        LocalDate lastDay = today.with(TemporalAdjusters.lastDayOfYear());
        return getEndOfDay(lastDay);
    }

    /**
     * Lấy thời điểm bắt đầu của một tháng cụ thể trong năm nay.
     * @param month Tháng cần lấy (1 - 12)
     */
    public static LocalDateTime getStartOfSpecificMonth(int month, int year) {
        if (month < 1 || month > 12) {
            throw new IllegalArgumentException("Tháng phải từ 1 đến 12");
        }
        LocalDate firstDay = LocalDate.of(year, month, 1);
        return getStartOfDay(firstDay);
    }

    /**
     * Lấy thời điểm kết thúc của một tháng cụ thể trong năm nay.
     * @param month Tháng cần lấy (1 - 12)
     */
    public static LocalDateTime getEndOfSpecificMonth(int month, int year) {
        if (month < 1 || month > 12) {
            throw new IllegalArgumentException("Tháng phải từ 1 đến 12");
        }
        // Lấy ngày đầu tháng đó, rồi chỉnh tới ngày cuối tháng
        LocalDate lastDay = LocalDate.of(year, month, 1)
                .with(TemporalAdjusters.lastDayOfMonth());
        return getEndOfDay(lastDay);
    }

    // ================= HELPER METHODS =================

    /**
     * Logic chuyển đổi cốt lõi:
     * 1. Nhận vào ngày X.
     * 2. Gán giờ 00:00:00 theo múi giờ VN (tạo ra ZonedDateTime VN).
     * 3. Chuyển đổi sang múi giờ DB (ZonedDateTime UTC).
     * 4. Trả về LocalDateTime (đã là giờ UTC).
     */
    private static LocalDateTime getStartOfDay(LocalDate date) {
        ZonedDateTime startOfDayVN = date.atStartOfDay(USER_ZONE);
        ZonedDateTime startOfDayDB = startOfDayVN.withZoneSameInstant(DB_ZONE);
        return startOfDayDB.toLocalDateTime();
    }

    /**
     * Logic tương tự nhưng lấy thời điểm cuối ngày (MAX)
     */
    private static LocalDateTime getEndOfDay(LocalDate date) {
        ZonedDateTime endOfDayVN = date.atTime(LocalTime.MAX).atZone(USER_ZONE);
        ZonedDateTime endOfDayDB = endOfDayVN.withZoneSameInstant(DB_ZONE);
        return endOfDayDB.toLocalDateTime();
    }
}
