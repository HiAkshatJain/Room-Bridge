package roomy.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProfileDto {
    private Long id;
    private Long userId;
    private String fullName;
    private String phoneNumber;
    private String address;
    private String bio;
    private String profileImageUrl;

    private boolean verificationStatus;
    private String socialLinks;
    private LocalDateTime createdAt;
}
