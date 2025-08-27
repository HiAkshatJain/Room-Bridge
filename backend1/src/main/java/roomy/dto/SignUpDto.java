package roomy.dto;

import lombok.Data;
import roomy.entities.enums.Role;

import java.util.Set;

@Data
public class SignUpDto {
    private String email;
    private String password;
    private String name;
    private Set<Role> roles;
}
