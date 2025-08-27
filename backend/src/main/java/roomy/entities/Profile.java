package roomy.entities;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@AllArgsConstructor
@NoArgsConstructor
@Builder


@Entity
@Table(name = "profiles")
@Data
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String fullName;
    private String phoneNumber;
    private String address;
    private String bio;
    private String profileImageUrl;

    // New fields

    private boolean verificationStatus = false;

    // Store social links as JSON string or comma-separated string
    @Column(length = 2000)
    private String socialLinks;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    // Automatically set createdAt on persist
    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
