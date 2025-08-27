package roomy.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import roomy.entities.User;
import roomy.entities.UserDocument;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDocumentRepository extends JpaRepository<UserDocument, Long> {
    List<UserDocument> findByUser(User user);
    Optional<UserDocument> findByIdAndUser(Long id, User user);
}