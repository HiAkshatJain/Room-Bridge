package roomy.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import roomy.dto.DocumentVerifyDto;
import roomy.dto.UserDocumentDto;
import roomy.entities.User;
import roomy.entities.UserDocument;
import roomy.services.EmailService;
import roomy.services.UserDocumentService;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserDocumentController {

    private final UserDocumentService documentService;


    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadDocument(
            @AuthenticationPrincipal User currentUser,
            @RequestPart("file") MultipartFile file) throws IOException {

        UserDocument doc = documentService.uploadDocument(currentUser.getId(), file);
        return ResponseEntity.ok(Map.of(
                "message", "Document uploaded successfully",
                "documentPath", doc.getDocumentPath()
        ));
    }

    @GetMapping("/my-documents")
    public ResponseEntity<List<UserDocumentDto>> getMyDocuments(@AuthenticationPrincipal User currentUser) {
        List<UserDocumentDto> docs = documentService.getUserDocuments(currentUser.getId());
        return ResponseEntity.ok(docs);
    }

    @DeleteMapping("/my-documents/{documentId}")
    public ResponseEntity<String> deleteDocument(
            @PathVariable Long documentId,
            @AuthenticationPrincipal User currentUser) {

        documentService.deleteUserDocument(currentUser.getId(), documentId);
        return ResponseEntity.ok("Document deleted successfully");
    }

    @PutMapping("/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDocumentDto> verifyDocument(
            @PathVariable Long id,
            @RequestBody DocumentVerifyDto verifyDto) {

        UserDocumentDto docDto = documentService.verifyDocument(id, verifyDto.getStatus());
        return ResponseEntity.ok(docDto);
    }

}
