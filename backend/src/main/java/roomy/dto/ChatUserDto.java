package roomy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatUserDto {
    private Long userId;
    private String name;
    private String profileImageUrl;
    private List<ChatMessageDto> chats;
}