package roomy.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import roomy.dto.ChatMessageDto;
import roomy.entities.ChatMessage;
import roomy.entities.User;
import roomy.repositories.ChatMessageRepository;
import roomy.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatRepository;
    private final UserRepository userRepository;



    public ChatMessage saveMessage(ChatMessageDto dto) {
        User sender = userRepository.findById(dto.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        ChatMessage message = ChatMessage.builder()
                .content(dto.getContent())
                .timestamp(LocalDateTime.now())
                .sender(sender)
                .receiver(receiver)
                .build();

        return chatRepository.save(message);
    }

    public List<ChatMessage> getConversation(Long senderId, Long receiverId) {
        List<ChatMessage> messages1 = chatRepository.findBySenderIdAndReceiverIdOrderByTimestampAsc(senderId, receiverId);
        List<ChatMessage> messages2 = chatRepository.findBySenderIdAndReceiverIdOrderByTimestampAsc(receiverId, senderId);
        messages1.addAll(messages2);
        messages1.sort((a,b) -> a.getTimestamp().compareTo(b.getTimestamp()));
        return messages1;
    }
}
