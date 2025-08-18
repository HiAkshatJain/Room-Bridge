package roomy.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageDto {
    private String content;
    private LocalDateTime timestamp;
    private Long senderId;
    private Long receiverId;
}