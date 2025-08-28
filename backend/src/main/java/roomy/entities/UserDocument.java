package roomy.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import roomy.entities.enums.VerificationStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_documents")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String documentName;       // Original file name
    private String documentPath;       // Stored path in uploads folder
    private LocalDateTime uploadedAt;

    @Enumerated(EnumType.STRING)
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    @PrePersist
    public void prePersist() {
        uploadedAt = LocalDateTime.now();
    }
}
