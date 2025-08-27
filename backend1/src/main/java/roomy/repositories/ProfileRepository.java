package roomy.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import roomy.entities.Profile;
import roomy.entities.User;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByUser(User user);

}
