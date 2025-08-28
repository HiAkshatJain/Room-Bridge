package roomy.config;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class UploadDirectoryConfig {

    @Value("${profile.image.upload-dir:uploads/profile-image}")
    private String profileImageDir;

    @Value("${document.upload-dir:uploads/documents}")
    private String documentDir;

    @Value("${room.image.upload-dir:uploads/rooms}")
    private String roomImageDir;

    @PostConstruct
    public void init() {
        createDirectory(profileImageDir);
        createDirectory(documentDir);
        createDirectory(roomImageDir);
    }

    private void createDirectory(String path) {
        try {
            Path dirPath = Paths.get(path).toAbsolutePath().normalize();
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
                System.out.println("✅ Folder created: " + dirPath);
            } else {
                System.out.println("📂 Folder already exists: " + dirPath);
            }
        } catch (IOException e) {
            System.err.println("❌ Failed to create folder: " + path);
            e.printStackTrace();
        }
    }
}
