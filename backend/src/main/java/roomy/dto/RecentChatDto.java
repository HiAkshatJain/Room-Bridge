package roomy.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecentChatDto {
    private Long userId;
    private String name;
    private String profileImageUrl;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
}