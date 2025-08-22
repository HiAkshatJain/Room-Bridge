package roomy.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import roomy.entities.Room;
import roomy.entities.User;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByUser(User user);

    Optional<Room> findByIdAndUserId(Long roomId, Long userId);
    List<Room> findByLocationContainingIgnoreCase(String location);
}
