package com.roomy.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class OTPVerifyRequest {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotBlank(message = "OTP is required")
    private String otp;
    
    // Constructors
    public OTPVerifyRequest() {}
    
    public OTPVerifyRequest(String email, String otp) {
        this.email = email;
        this.otp = otp;
    }
    
    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
}