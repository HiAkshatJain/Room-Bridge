package roomy.services;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    // Send OTP email
        public void sendOtpEmail(String toEmail, String otp) {
        int expiryMinutes = 5;
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Room Bridge - Password Reset OTP");

            String htmlContent = """
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Password Reset OTP</title>
                        <style>
                            body { font-family: 'Segoe UI', Roboto, Arial, sans-serif; background:#f5f7fa; margin:0; padding:0; }
                            .container { max-width:480px; margin:40px auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 8px 20px rgba(0,0,0,.08); }
                            .header { background:linear-gradient(135deg,#ef4444,#dc2626); color:#fff; text-align:center; padding:24px; }
                            .header h1 { margin:0; font-size:20px; font-weight:600; }
                            .content { padding:32px 24px; text-align:center; }
                            .content p { font-size:15px; color:#333; margin:0 0 16px; }
                            .otp-box { font-size:32px; font-weight:700; letter-spacing:8px; background:#fff5f5; color:#b91c1c; padding:16px; border-radius:12px; display:inline-block; margin:20px 0; border:2px dashed #ef4444; }
                            .footer { font-size:12px; color:#777; text-align:center; padding:16px; border-top:1px solid #eee; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header"><h1>Password Reset</h1></div>
                            <div class="content">
                                <p>Hello,</p>
                                <p>We received a request to reset your password. Use the OTP below:</p>
                                <div class="otp-box">%s</div>
                                <p>This OTP will expire in %d minutes.</p>
                                <p>If you did not request a password reset, please ignore this email.</p>
                            </div>
                            <div class="footer">
                                <p>&copy; 2025 Room Bridge</p>
                            </div>
                        </div>
                    </body>
                    </html>
                    """.formatted(otp, expiryMinutes);

            helper.setText(htmlContent, true); // ✅ HTML mode
            mailSender.send(mimeMessage);

        } catch (Exception e) {
            throw new RuntimeException("❌ Failed to send Password Reset OTP email", e);
        }
    }

    // Send general email
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message); // use final mailSender
            System.out.println("Email sent to: " + to);
        } catch (Exception e) {
            System.err.println(" Failed to send email to: " + to);
            e.printStackTrace();
        }
    }
}