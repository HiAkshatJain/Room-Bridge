package roomy.repositories;



import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import roomy.entities.Session;
import roomy.entities.User;

import java.util.List;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByUser(User user);

    Optional<Session> findByRefreshToken(String refreshToken);
    @Modifying
    @Transactional
    @Query("DELETE FROM Session s WHERE s.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
}
