package roomy.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import roomy.entities.OtpVerification;

import java.util.Optional;

public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findByEmail(String email);
    void deleteByEmail(String email);
}