package roomy.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import roomy.dto.ChatMessageDto;


import org.springframework.messaging.handler.annotation.Payload;

import roomy.entities.ChatMessage;
import roomy.services.ChatService;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    public ChatController(SimpMessagingTemplate messagingTemplate, ChatService chatService) {
        this.messagingTemplate = messagingTemplate;
        this.chatService = chatService;
    }

    @MessageMapping("/private-message")
    public void sendPrivateMessage(@Payload ChatMessageDto chatMessageDto) {
        ChatMessage savedMessage = chatService.saveMessage(chatMessageDto);

        messagingTemplate.convertAndSend(
                "/user/" + chatMessageDto.getReceiverId() + "/queue/messages",
                chatMessageDto
        );
    }
}

