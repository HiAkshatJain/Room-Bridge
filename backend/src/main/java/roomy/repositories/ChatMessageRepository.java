package roomy.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import roomy.entities.ChatMessage;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySenderIdAndReceiverIdOrderByTimestampAsc(Long senderId, Long receiverId);
    List<ChatMessage> findByReceiverIdAndSenderIdOrderByTimestampAsc(Long receiverId, Long senderId);
}
