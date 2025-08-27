package roomy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import roomy.entities.enums.Role;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class LoginResponseDto {

    private Long id;
    private String accessToken;
    private String refreshToken;
    private Set<Role> roles;
}
