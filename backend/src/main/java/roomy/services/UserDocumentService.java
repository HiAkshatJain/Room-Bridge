package roomy.services;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import roomy.dto.UserDocumentDto;
import roomy.entities.User;
import roomy.entities.UserDocument;
import roomy.entities.enums.VerificationStatus;
import roomy.exceptions.ResourceNotFoundException;
import roomy.repositories.UserDocumentRepository;
import roomy.repositories.UserRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserDocumentService {

    private final UserDocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${document.upload-dir}")
    private String uploadDir;



    public UserDocument uploadDocument(Long userId, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath(); // ensure absolute path
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
            System.out.println("Created folder: " + uploadPath);
        }

        String originalFileName = file.getOriginalFilename();
        String extension = originalFileName != null && originalFileName.contains(".")
                ? originalFileName.substring(originalFileName.lastIndexOf("."))
                : "";

        String newFileName = UUID.randomUUID().toString() + extension;
        Path filePath = uploadPath.resolve(newFileName);

        System.out.println("Uploading file to: " + filePath); // debug path

        file.transferTo(filePath.toFile());

        UserDocument document = new UserDocument();
        document.setUser(user);
        document.setDocumentName(originalFileName);
        document.setDocumentPath("/uploads/documents/" + newFileName);
        return documentRepository.save(document);
    }





    public UserDocumentDto verifyDocument(Long documentId, VerificationStatus status) {
        UserDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

        // Update verification status
        document.setVerificationStatus(status);
        UserDocument savedDocument = documentRepository.save(document);

        // Send email
        String userEmail = savedDocument.getUser().getEmail();
        String subject = "Document Verification Status";
        String body;
        switch (status) {
            case APPROVED:
                body = "Dear " + savedDocument.getUser().getName() + ",\n\n"
                        + "Your document \"" + savedDocument.getDocumentName() + "\" has been approved.";
                break;
            case REJECTED:
                body = "Dear " + savedDocument.getUser().getName() + ",\n\n"
                        + "Your document \"" + savedDocument.getDocumentName() + "\" was rejected. Please upload a valid document.";
                break;
            default:
                body = "Dear " + savedDocument.getUser().getName() + ",\n\n"
                        + "Your document \"" + savedDocument.getDocumentName() + "\" is pending review.";
                break;
        }
        emailService.sendEmail(userEmail, subject, body);

        // Return DTO
        return new UserDocumentDto(
                savedDocument.getId(),
                savedDocument.getUser().getId(),
                savedDocument.getUser().getName(),
                savedDocument.getDocumentName(),
                savedDocument.getDocumentPath(),
                savedDocument.getVerificationStatus()
        );
    }


    public List<UserDocumentDto> getUserDocuments(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return documentRepository.findByUser(user)
                .stream()
                .map(doc -> new UserDocumentDto(
                        doc.getId(),
                        doc.getUser().getId(),
                        doc.getUser().getName(),
                        doc.getDocumentName(),
                        doc.getDocumentPath(),
                        doc.getVerificationStatus()
                )) // <- close map parenthesis here
                .collect(Collectors.toList());
    }

    public void deleteUserDocument(Long userId, Long documentId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserDocument document = documentRepository.findByIdAndUser(documentId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found or not yours"));

        // Optionally also delete the physical file from storage
        Path path = Paths.get(document.getDocumentPath());
        try {
            Files.deleteIfExists(path);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete document file", e);
        }

        documentRepository.delete(document);
    }


    public List<UserDocumentDto> getAllDocuments() {
        return documentRepository.findAll()
                .stream()
                .map(doc -> new UserDocumentDto(
                        doc.getId(),
                        doc.getUser().getId(),
                        doc.getUser().getName(),
                        doc.getDocumentName(),
                        doc.getDocumentPath(),
                        doc.getVerificationStatus()
                ))
                .collect(Collectors.toList());
    }


}
