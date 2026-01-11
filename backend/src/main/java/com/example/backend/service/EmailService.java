package com.example.backend.service;

import com.example.backend.utils.MyStringUtils;
import com.example.backend.entity.ProductDescriptionHistory;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import com.example.backend.entity.ProductDescriptionHistory;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;
import java.util.List;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender javaMailSender;
    @Autowired
    private RedisService redisService;

    private String DOMAIN = "http://localhost:5173";

    @Async
    public void sendOtpEmail(String toEmail, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        redisService.saveOtp(toEmail, otpCode);
        message.setTo(toEmail);
        message.setSubject("Mã xác thực OTP của bạn");
        message.setText("Mã OTP của bạn là: " + otpCode + ". Mã này có hiệu lực trong 5 phút.");

        javaMailSender.send(message);
        System.out.println("Đã gửi OTP thành công!");
    }

    @Async
    public void sendEmailToMultipleRecipients(String[] recipients, String subject, String content) {
        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Mẹo: Set "To" là chính email của bạn hoặc email noreply
            // Để người nhận thấy: "To: noreply@system.com" thay vì trống trơn
            // helper.setTo("noreply@system.com");

            // QUAN TRỌNG: Đưa danh sách người nhận vào BCC
            helper.setBcc(recipients);

            helper.setSubject(subject);
            helper.setText(content, true); // true = HTML

            javaMailSender.send(message);
            System.out.println("Đã gửi mail BCC thành công!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @Async
    public void sendPlaceBidMail(String[] emails, String productName, Long productId, BigDecimal price, String currentBidderName) {
        // 1. Tạo đường dẫn sản phẩm
        String productUrl = DOMAIN + "/products/" + productId;

        // 2. Format giá tiền cho đẹp (Ví dụ: 1000000 -> 1.000.000 đ)
        NumberFormat currencyFormatter = NumberFormat.getInstance(new Locale("vi", "VN"));
        String formattedPrice = currencyFormatter.format(price) + " đ";

        // 3. Tiêu đề Email
        String subject = "🔔 Cập nhật giá: " + productName + " đã có giá mới!";

        // 4. Nội dung HTML (Sử dụng Text Block của Java 15+ cho dễ nhìn)
        String content = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px;">
                <h2 style="color: #d32f2f; text-align: center;">Sản phẩm vừa có giá mới!</h2>
                
                <p>Xin chào,</p>
                <p>Sản phẩm <b>%s</b> mà bạn đang theo dõi vừa có lượt đặt giá mới.</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <ul style="list-style-type: none; padding: 0;">
                        <li style="margin-bottom: 10px;">📦 <b>Sản phẩm:</b> %s</li>
                        <li style="margin-bottom: 10px;">💰 <b>Giá hiện tại:</b> <span style="color: #d32f2f; font-weight: bold; font-size: 18px;">%s</span></li>
                        <li style="margin-bottom: 10px;">👤 <b>Người giữ giá:</b> %s</li>
                    </ul>
                </div>
                
                <div style="text-align: center; margin-top: 25px;">
                    <a href="%s" style="background-color: #1976d2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                        Đặt giá cao hơn ngay
                    </a>
                </div>
                
                <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
                    Nếu nút bấm không hoạt động, hãy copy đường dẫn sau: <br>
                    <a href="%s">%s</a>
                </p>
            </div>
            """.formatted(productName, productName, formattedPrice, MyStringUtils.maskBidderName(currentBidderName), productUrl, productUrl, productUrl);

        // 5. Gọi hàm gửi BCC đã viết ở trên
        // Vì hàm này đã có @Async, hàm sendEmailToMultipleRecipients cũng có @Async
        // -> Spring sẽ xử lý tốt, không tạo quá nhiều thread thừa.
        sendEmailToMultipleRecipients(emails, subject, content);
    }

    @Async
    public void sendNewWinnerNotification(String toEmail, String productName, Long productId, BigDecimal price) {
        // 1. Setup URL và Format tiền
        String productUrl = DOMAIN + "/products/" + productId; // Nên dùng biến môi trường domain.url
        NumberFormat currencyFormatter = NumberFormat.getInstance(new Locale("vi", "VN"));
        String formattedPrice = currencyFormatter.format(price) + " đ";

        String subject = "🎉 Tin vui: Bạn đang là người dẫn đầu cho: " + productName;

        String content = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px;">
                <h2 style="color: #2e7d32; text-align: center;">Vị trí dẫn đầu đã trở lại với bạn!</h2>
                
                <p>Xin chào,</p>
                <p>Hệ thống vừa phát hiện một số lượt đặt giá không hợp lệ (hoặc bị hủy) cho sản phẩm <b>%s</b>.</p>
                <p>Sau khi tính toán lại, bạn hiện là người đang <b>giữ giá cao nhất</b>.</p>
                
                <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <ul style="list-style-type: none; padding: 0;">
                        <li style="margin-bottom: 10px;">📦 <b>Sản phẩm:</b> %s</li>
                        <li style="margin-bottom: 10px;">💰 <b>Giá hiện tại của bạn:</b> <span style="color: #2e7d32; font-weight: bold; font-size: 18px;">%s</span></li>
                    </ul>
                </div>
                
                <p>Hãy tiếp tục theo dõi để đảm bảo chiến thắng!</p>
                
                <div style="text-align: center; margin-top: 25px;">
                    <a href="%s" style="background-color: #2e7d32; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                        Xem chi tiết sản phẩm
                    </a>
                </div>
            </div>
            """.formatted(productName, productName, formattedPrice, productUrl);

        // Tận dụng hàm gửi mail có sẵn, truyền vào mảng 1 phần tử
        sendEmailToMultipleRecipients(new String[]{toEmail}, subject, content);
    }

    /**
     * Gửi mail cho người bị Block
     */
    @Async
    public void sendBlockedNotification(String toEmail, String productName, String reason) {
        String subject = "⛔ Thông báo: Bạn đã bị chặn đấu giá sản phẩm " + productName;

        String content = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px;">
                <h2 style="color: #c62828; text-align: center;">Thông báo hạn chế quyền đấu giá</h2>
                
                <p>Chào bạn,</p>
                <p>Người bán đã thực hiện quyền chặn bạn tham gia đấu giá cho sản phẩm: <b>%s</b>.</p>
                
                <div style="background-color: #ffebee; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 5px solid #c62828;">
                    <p style="margin: 0; color: #c62828; font-weight: bold;">Lý do:</p>
                    <p style="margin-top: 5px;">%s</p>
                </div>
                
                <p><b>Hệ quả:</b></p>
                <ul>
                    <li>Các lượt ra giá hiện tại của bạn cho sản phẩm này đã bị hủy bỏ.</li>
                    <li>Tính năng đấu giá tự động (AutoBid) cho sản phẩm này đã bị tắt.</li>
                    <li>Bạn không thể tiếp tục ra giá cho sản phẩm này.</li>
                </ul>
                
                <p style="font-size: 12px; color: #666;">Nếu bạn cho rằng đây là nhầm lẫn, vui lòng liên hệ bộ phận hỗ trợ.</p>
            </div>
            """.formatted(productName, reason);

        sendEmailToMultipleRecipients(new String[]{toEmail}, subject, content);
    }
    @Async
    public void sendNewQuestionNotification(String sellerEmail, String askerName, String productName, String questionContent, Long productId) {
        String productUrl = DOMAIN + "/products/" + productId; // Nên dùng domain.url
        String subject = "❓ Bạn có câu hỏi mới về sản phẩm: " + productName;

        String content = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px;">
                <h2 style="color: #1976d2; text-align: center;">Khách hàng đang quan tâm sản phẩm của bạn</h2>
                
                <p>Xin chào,</p>
                <p>Người dùng <b>%s</b> vừa đặt một câu hỏi cho sản phẩm <b>%s</b>.</p>
                
                <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 5px solid #1976d2;">
                    <p style="margin: 0; font-weight: bold; color: #0d47a1;">Nội dung câu hỏi:</p>
                    <p style="margin-top: 5px; font-style: italic;">"%s"</p>
                </div>
                
                <p>Hãy trả lời sớm để tăng khả năng chốt đơn nhé!</p>
                
                <div style="text-align: center; margin-top: 25px;">
                    <a href="%s" style="background-color: #1976d2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                        Trả lời ngay
                    </a>
                </div>
            </div>
            """.formatted(askerName, productName, questionContent, productUrl);

        sendEmailToMultipleRecipients(new String[]{sellerEmail}, subject, content);
    }

    /**
     * Gửi mail cho Người hỏi khi Người bán đã trả lời
     */
    @Async
    public void sendQuestionAnsweredNotification(String askerEmail, String sellerName, String productName, String questionContent, String answerContent, Long productId) {
        String productUrl = DOMAIN + "/products/" + productId;
        String subject = "✅ Câu hỏi về " + productName + " đã được trả lời";

        String content = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px;">
                <h2 style="color: #2e7d32; text-align: center;">Người bán đã phản hồi câu hỏi của bạn!</h2>
                
                <p>Xin chào,</p>
                <p>Người bán <b>%s</b> đã trả lời thắc mắc của bạn về sản phẩm <b>%s</b>.</p>
                
                <div style="margin: 20px 0;">
                    <p><b>Câu hỏi của bạn:</b></p>
                    <blockquote style="border-left: 4px solid #ccc; margin-left: 0; padding-left: 15px; color: #555;">
                        %s
                    </blockquote>
                </div>
                
                <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 5px solid #2e7d32;">
                    <p style="margin: 0; font-weight: bold; color: #1b5e20;">Phản hồi từ người bán:</p>
                    <p style="margin-top: 5px;">"%s"</p>
                </div>
                
                <div style="text-align: center; margin-top: 25px;">
                    <a href="%s" style="background-color: #2e7d32; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                        Xem chi tiết sản phẩm
                    </a>
                </div>
            </div>
            """.formatted(sellerName, productName, questionContent, answerContent, productUrl);

        sendEmailToMultipleRecipients(new String[]{askerEmail}, subject, content);
    }

    @Async
    public void sendAuctionSuccessToWinner(String winnerEmail, String winnerName, String productName, BigDecimal finalPrice) {
        String productUrl = DOMAIN + "/bidder/transactions" ; // Hoặc dẫn đến trang Lịch sử giao dịch
        NumberFormat currencyFormatter = NumberFormat.getInstance(new Locale("vi", "VN"));
        String formattedPrice = currencyFormatter.format(finalPrice) + " đ";

        String subject = "🏆 CHÚC MỪNG! Bạn đã thắng đấu giá: " + productName;

        String content = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px;">
                <h2 style="color: #2e7d32; text-align: center;">Chiến thắng thuộc về bạn!</h2>
                
                <p>Xin chào <b>%s</b>,</p>
                <p>Chúc mừng bạn đã chiến thắng phiên đấu giá cho sản phẩm <b>%s</b>.</p>
                
                <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px dashed #2e7d32;">
                    <p style="margin: 0; font-size: 16px;">Số tiền chốt hạ:</p>
                    <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #2e7d32;">%s</p>
                </div>
                
                <p>Vui lòng hoàn tất thanh toán để người bán có thể tiến hành giao hàng cho bạn.</p>
                
                <div style="text-align: center; margin-top: 25px;">
                    <a href="%s" style="background-color: #d84315; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">
                        Thanh toán ngay
                    </a>
                </div>
                
                <p style="font-size: 12px; color: #666; margin-top: 20px;">Lưu ý: Nếu không thanh toán trong thời hạn quy định, tài khoản của bạn có thể bị đánh dấu vi phạm.</p>
            </div>
            """.formatted(winnerName, productName, formattedPrice, productUrl);

        sendEmailToMultipleRecipients(new String[]{winnerEmail}, subject, content);
    }

    /**
     * 2. Gửi cho SELLER: Bán thành công (Có người thắng)
     */
    @Async
    public void sendAuctionSuccessToSeller(String sellerEmail, String sellerName, String productName, BigDecimal finalPrice, String winnerName) {
        String productUrl = DOMAIN + "/seller/transactions";
        NumberFormat currencyFormatter = NumberFormat.getInstance(new Locale("vi", "VN"));
        String formattedPrice = currencyFormatter.format(finalPrice) + " đ";

        String subject = "💰 TIN VUI: Sản phẩm " + productName + " đã được bán!";

        String content = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px;">
                <h2 style="color: #f57f17; text-align: center;">Sản phẩm của bạn đã có chủ!</h2>
                
                <p>Xin chào <b>%s</b>,</p>
                <p>Phiên đấu giá sản phẩm <b>%s</b> đã kết thúc thành công.</p>
                
                <div style="background-color: #fff8e1; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <ul style="list-style-type: none; padding: 0;">
                        <li style="margin-bottom: 10px;">👤 <b>Người mua:</b> %s</li>
                        <li style="margin-bottom: 10px;">💵 <b>Giá bán được:</b> <span style="font-weight: bold; color: #d84315;">%s</span></li>
                    </ul>
                </div>
                
                <p>Hệ thống đang chờ người mua thanh toán. Chúng tôi sẽ thông báo cho bạn ngay khi tiền về tài khoản.</p>
                
                <div style="text-align: center; margin-top: 25px;">
                    <a href="%s" style="background-color: #f57f17; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                        Xem chi tiết giao dịch
                    </a>
                </div>
            </div>
            """.formatted(sellerName, productName, winnerName, formattedPrice, productUrl);

        sendEmailToMultipleRecipients(new String[]{sellerEmail}, subject, content);
    }

    /**
     * 3. Gửi cho SELLER: Đấu giá thất bại (Không ai mua)
     */
    @Async
    public void sendAuctionFailToSeller(String sellerEmail, String sellerName, String productName, Long productId) {
        String productUrl = DOMAIN + "/products/" + productId;
        String subject = "⚠️ Kết thúc phiên đấu giá: " + productName;

        String content = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px;">
                <h2 style="color: #546e7a; text-align: center;">Phiên đấu giá đã kết thúc</h2>
                
                <p>Xin chào <b>%s</b>,</p>
                <p>Sản phẩm <b>%s</b> của bạn đã hết thời gian đấu giá nhưng tiếc là chưa có ai tham gia đặt giá.</p>
                
                <div style="background-color: #eceff1; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 0; color: #455a64;">Đừng lo lắng, bạn có thể gia hạn hoặc đăng bán lại sản phẩm này bất cứ lúc nào.</p>
                </div>
                
                <div style="text-align: center; margin-top: 25px;">
                    <a href="%s" style="background-color: #546e7a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                        Quản lý sản phẩm
                    </a>
                </div>
            </div>
            """.formatted(sellerName, productName, productUrl);

        sendEmailToMultipleRecipients(new String[]{sellerEmail}, subject, content);
    }

    @Async
    public void sendNewPasswordNotification(String toEmail, String userName, String newPassword) {
        // Link đến trang đăng nhập
        String loginUrl = DOMAIN + "/auth/login";

        String subject = "🔐 Thông báo: Mật khẩu tài khoản đã được thay đổi";

        String content = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px;">
                <h2 style="color: #1976d2; text-align: center;">Cấp lại mật khẩu thành công</h2>
                
                <p>Xin chào <b>%s</b>,</p>
                <p>Hệ thống đã thực hiện reset mật khẩu cho tài khoản của bạn theo yêu cầu.</p>
                <p>Dưới đây là mật khẩu mới của bạn:</p>
                
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center; border: 2px dashed #999;">
                    <span style="font-size: 24px; font-weight: bold; color: #333; letter-spacing: 2px;">%s</span>
                </div>
                
                <div style="background-color: #fff3e0; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 5px solid #ff9800;">
                    <p style="margin: 0; color: #e65100; font-size: 14px;">
                        ⚠️ <b>Lưu ý quan trọng:</b> Vì lý do bảo mật, vui lòng đăng nhập và đổi lại mật khẩu của riêng bạn ngay lập tức.
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 25px;">
                    <a href="%s" style="background-color: #1976d2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                        Đăng nhập ngay
                    </a>
                </div>
            </div>
            """.formatted(userName, newPassword, loginUrl);

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Gửi trực tiếp cho 1 người (TO)
            helper.setTo(toEmail);

            helper.setSubject(subject);
            helper.setText(content, true);

            javaMailSender.send(message);
            System.out.println("Đã gửi mail mật khẩu mới cho: " + toEmail);

        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Lỗi gửi mail mật khẩu mới: " + e.getMessage());
        }
    }

    @Async
    public void sendDescriptionUpdateNotification(String[] recipients, String productName, String oldDescription, List<ProductDescriptionHistory> historyList, Long productId) {
        String productUrl = DOMAIN + "/products/" + productId;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy"); // Thêm giờ phút cho chi tiết

        // 1. Xử lý mô tả gốc
        String safeOldDesc = oldDescription != null ? oldDescription.replace("\n", "<br>") : "(Chưa có mô tả ban đầu)";

        // 2. Xử lý danh sách lịch sử mô tả (Dùng StringBuilder để nối chuỗi)
        StringBuilder historyHtml = new StringBuilder();

        if (historyList != null && !historyList.isEmpty()) {
            for (ProductDescriptionHistory item : historyList) {
                String dateStr = item.getThoiGianThem().format(formatter);
                String content = item.getNoiDungThem().replace("\n", "<br>");

                // Tạo block HTML cho từng lần cập nhật
                historyHtml.append("""
                    <div style="margin-top: 15px; padding-top: 10px; border-top: 1px dashed #ccc;">
                        <div style="font-weight: bold; color: #d84315; font-size: 13px;">
                            --- Cập nhật: %s ---
                        </div>
                        <div style="margin-top: 5px;">%s</div>
                    </div>
                """.formatted(dateStr, content));
            }
        }

        String subject = "📢 Cập nhật thông tin sản phẩm: " + productName;

        String content = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px;">
                <h2 style="color: #0277bd; text-align: center;">Thông tin sản phẩm đã được cập nhật</h2>
                
                <p>Xin chào,</p>
                <p>Sản phẩm <b>%s</b> vừa được bổ sung thêm thông tin.</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin-top: 0; color: #555; text-decoration: underline;"><b>Thông tin chi tiết:</b></p>
                    
                    <div style="color: #333; line-height: 1.6;">
                        <div>%s</div>
                        
                        %s
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 25px;">
                    <a href="%s" style="background-color: #0277bd; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                        Xem chi tiết sản phẩm
                    </a>
                </div>
            </div>
            """.formatted(productName, safeOldDesc, historyHtml.toString(), productUrl);

        sendEmailToMultipleRecipients(recipients, subject, content);
    }
}
