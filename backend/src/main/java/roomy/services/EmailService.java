package roomy.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {



    private final JavaMailSender mailSender;

    // Send OTP email
    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Verify your email with OTP");
        message.setText("Your OTP is: " + otp);
        mailSender.send(message); // use final mailSender
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