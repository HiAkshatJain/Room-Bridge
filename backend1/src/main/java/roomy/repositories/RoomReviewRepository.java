package roomy.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import roomy.entities.Room;
import roomy.entities.RoomReview;

import java.util.List;

public interface RoomReviewRepository extends JpaRepository<RoomReview, Long> {
    List<RoomReview> findByRoomId(Long roomId);
    boolean existsByRoomIdAndUserId(Long roomId, Long userId);// optional: prevent duplicate reviews
    List<RoomReview> findByRoom(Room room);
}
