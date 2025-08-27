package roomy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import roomy.entities.enums.VerificationStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDocumentDto {
    private Long id;
    private String documentName;
    private String documentPath;
    private VerificationStatus verificationStatus;
}
