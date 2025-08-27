package roomy.dto;

import lombok.Data;
import roomy.entities.enums.VerificationStatus;

@Data
public class DocumentVerifyDto {
    private VerificationStatus status; // APPROVED or REJECTED
}