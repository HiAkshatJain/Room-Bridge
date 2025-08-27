package roomy.repositories;



import org.springframework.data.jpa.repository.JpaRepository;
import roomy.entities.Session;
import roomy.entities.User;

import java.util.List;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByUser(User user);

    Optional<Session> findByRefreshToken(String refreshToken);
}
