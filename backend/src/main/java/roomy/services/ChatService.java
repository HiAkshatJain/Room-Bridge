package roomy.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import roomy.dto.ChatMessageDto;
import roomy.dto.RecentChatDto;
import roomy.entities.ChatMessage;
import roomy.entities.User;
import roomy.repositories.ChatMessageRepository;
import roomy.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

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


    public List<User> getChatUsers(Long userId) {
        List<User> receivers = chatRepository.findReceivers(userId);
        List<User> senders = chatRepository.findSenders(userId);

        Set<User> users = new HashSet<>();
        users.addAll(receivers);
        users.addAll(senders);

        return new ArrayList<>(users);
    }

    public List<RecentChatDto> getRecentChats(Long loginUserId) {
        List<ChatMessage> allChats = chatRepository.findAllChatsOfUser(loginUserId);

        // ✅ Collect all unique other user IDs
        Set<Long> otherUserIds = allChats.stream()
                .map(chat -> chat.getSender().getId().equals(loginUserId)
                        ? chat.getReceiver().getId()
                        : chat.getSender().getId())
                .collect(Collectors.toSet());

        List<RecentChatDto> recentChats = new ArrayList<>();

        for (Long otherUserId : otherUserIds) {
            ChatMessage lastMessage = chatRepository
                    .findTopBySenderIdAndReceiverIdOrSenderIdAndReceiverIdOrderByTimestampDesc(
                            loginUserId, otherUserId,
                            otherUserId, loginUserId
                    );

            userRepository.findById(otherUserId).ifPresent(user -> {
                // ✅ Fetch profile automatically because of EAGER
                String profileImage = (user.getProfile() != null)
                        ? user.getProfile().getProfileImageUrl()
                        : null;

                System.out.println(profileImage);
                System.out.println(user.getProfile());

                recentChats.add(RecentChatDto.builder()
                        .userId(user.getId())
                        .name(user.getName())
                        .profileImageUrl(profileImage)
                        .lastMessage(lastMessage != null ? lastMessage.getContent() : null)
                        .lastMessageTime(lastMessage != null ? lastMessage.getTimestamp() : null)
                        .build());
            });
        }

        // ✅ Sort by last message time
        recentChats.sort(Comparator.comparing(
                RecentChatDto::getLastMessageTime,
                Comparator.nullsLast(Comparator.reverseOrder())
        ));

        return recentChats;
    }

}
