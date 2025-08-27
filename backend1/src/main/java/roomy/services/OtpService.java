package roomy.services;

import lombok.RequiredArgsConstructor;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;
import roomy.entities.OtpVerification;
import roomy.repositories.OtpVerificationRepository;
import org.springframework.beans.factory.annotation.Value;


import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;


@Service
@EnableAsync
@RequiredArgsConstructor
public class OtpService {

    private final JavaMailSender mailSender;
    private final OtpVerificationRepository otpRepo;

    @Value("${otp.expiry.minutes:5}")
    private long expiryMinutes;

    public void sendOtp(String email) {
        String otp = String.format("%06d", ThreadLocalRandom.current().nextInt(0, 1000000));
        otpRepo.findByEmail(email).ifPresent(otpRepo::delete);

        OtpVerification otpVerification = new OtpVerification();
        otpVerification.setEmail(email);
        otpVerification.setOtp(otp);
        otpVerification.setExpiryTime(LocalDateTime.now().plusMinutes(expiryMinutes));
        otpVerification.setVerified(false);

        otpRepo.save(otpVerification);
        sendEmail(email, otp);
    }

    private void sendEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("OTP for Email Verification");
        message.setText("Your OTP is: " + otp + ". It will expire in " + expiryMinutes + " minutes.");
        mailSender.send(message);
    }

    public boolean verifyOtp(String email, String otp) {
        return otpRepo.findByEmail(email)
                .filter(record -> record.getOtp().equals(otp))
                .filter(record -> !record.isVerified())
                .filter(record -> record.getExpiryTime().isAfter(LocalDateTime.now()))
                .map(record -> {
                    record.setVerified(true);
                    otpRepo.save(record);
                    return true;
                })
                .orElse(false);
    }
}
