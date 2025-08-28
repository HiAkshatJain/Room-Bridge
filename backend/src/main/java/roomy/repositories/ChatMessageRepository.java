package roomy.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import roomy.entities.ChatMessage;
import roomy.entities.User;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySenderIdAndReceiverIdOrderByTimestampAsc(Long senderId, Long receiverId);


    @Query("SELECT DISTINCT CASE WHEN c.sender.id = :userId THEN c.receiver ELSE c.sender END " +
            "FROM ChatMessage c " +
            "WHERE c.sender.id = :userId OR c.receiver.id = :userId")
    List<User> findChatUsers(@Param("userId") Long userId);


    @Query("SELECT DISTINCT c.receiver FROM ChatMessage c WHERE c.sender.id = :userId")
    List<User> findReceivers(@Param("userId") Long userId);

    @Query("SELECT DISTINCT c.sender FROM ChatMessage c WHERE c.receiver.id = :userId")
    List<User> findSenders(@Param("userId") Long userId);

}
