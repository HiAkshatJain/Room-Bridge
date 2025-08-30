package roomy.repositories;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import roomy.entities.Room;
import roomy.entities.RoomReview;

import java.util.List;

public interface RoomReviewRepository extends JpaRepository<RoomReview, Long> {
//    List<RoomReview> findByRoomId(Long roomId);
//    boolean existsByRoomIdAndUserId(Long roomId, Long userId);// optional: prevent duplicate reviews
//    List<RoomReview> findByRoom(Room room);
////    void deleteByUserId(Long userId);
//    @Modifying
//    @Transactional
//    @Query("DELETE FROM RoomReview r WHERE r.user.id = :userId")
//    void deleteByUserId(@Param("userId") Long userId);
//    @Modifying
//    @Transactional
//    void deleteBySenderIdOrReceiverId(Long senderId, Long receiverId);
//
//    @Modifying
//    @Transactional
//    @Query("DELETE FROM RoomReview r WHERE r.user.id = :userId OR r.room.id IN (SELECT rm.id FROM Room rm WHERE rm.user.id = :userId)")
//    void deleteByUserOrUserRooms(@Param("userId") Long userId);


List<RoomReview> findByRoomId(Long roomId);

    boolean existsByRoomIdAndUserId(Long roomId, Long userId);

    List<RoomReview> findByRoom(Room room);

//    @Modifying
//    @Transactional
//    @Query("DELETE FROM RoomReview r WHERE r.user.id = :userId")
//    void deleteByUserId(@Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query("""
        DELETE FROM RoomReview r 
        WHERE r.user.id = :userId 
        OR r.room.id IN (SELECT rm.id FROM Room rm WHERE rm.user.id = :userId)
    """)
    void deleteByUserOrUserRooms(@Param("userId") Long userId);


    void deleteAllByRoom(Room room);

    void deleteByUserId(Long userId);

    // Delete reviews for all rooms owned by this user
    @Modifying
    @Query("DELETE FROM RoomReview r WHERE r.room.user.id = :userId")
    void deleteByUserRooms(@Param("userId") Long userId);

}
