package roomy.controller;
import org.springframework.web.bind.annotation.*;
import roomy.dto.ChatMessageDto;
import roomy.entities.ChatMessage;
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
}
