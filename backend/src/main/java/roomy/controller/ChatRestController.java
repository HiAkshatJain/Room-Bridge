package roomy.controller;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import roomy.dto.ChatMessageDto;
import roomy.dto.RecentChatDto;
import roomy.dto.UserDto;
import roomy.entities.ChatMessage;
import roomy.entities.User;
import roomy.services.ChatService;

import java.util.List;

@RestController
@RequestMapping("/api/chat")

public class ChatRestController {

    private final ChatService chatService;



    public ChatRestController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/send")
    public ChatMessageDto sendMessage(@RequestBody ChatMessageDto chatMessageDto) {
        ChatMessage savedMessage = chatService.saveMessage(chatMessageDto);
        return ChatMessageDto.builder()
                .senderId(savedMessage.getSender().getId())
                .receiverId(savedMessage.getReceiver().getId())
                .content(savedMessage.getContent())
                .timestamp(savedMessage.getTimestamp())
                .build();
    }

    @GetMapping("/conversation")
    public List<ChatMessageDto> getConversation(
            @RequestParam Long senderId,
            @RequestParam Long receiverId) {
        return chatService.getConversation(senderId, receiverId)
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    private ChatMessageDto convertToDto(ChatMessage message) {
        return ChatMessageDto.builder()
                .senderId(message.getSender().getId())
                .receiverId(message.getReceiver().getId())
                .content(message.getContent())
                .timestamp(message.getTimestamp())
                .build();
    }


        @GetMapping("/users")
        public List<UserDto> getChatUsers(@AuthenticationPrincipal User loggedInUser) {
            List<User> users = chatService.getChatUsers(loggedInUser.getId());

            return users.stream()
                    .map(this::convertToDto)
                    .toList();
        }

        private UserDto convertToDto(User user) {
            UserDto dto = new UserDto();
            dto.setId(user.getId());
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            return dto;
        }

    @GetMapping("/recent")
    public ResponseEntity<List<RecentChatDto>> getRecentChats(@AuthenticationPrincipal User loginUser) {
        List<RecentChatDto> recentChats = chatService.getRecentChats(loginUser.getId());
        return ResponseEntity.ok(recentChats);
    }
}
