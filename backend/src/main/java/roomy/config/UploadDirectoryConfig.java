package roomy.config;


import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.File;

@Configuration
public class UploadDirectoryConfig {

    @Value("${profile.image.upload-dir:uploads/profile-image}")
    private String profileImageDir;

    @Value("${document.upload-dir:uploads/documents}")
    private String documentDir;

    @PostConstruct
    public void init() {
        createDirectory(profileImageDir);
        createDirectory(documentDir);
    }

    private void createDirectory(String path) {
        File dir = new File(path);
        System.out.println("Trying to create folder: " + dir.getAbsolutePath());
        if (!dir.exists()) {
            if (dir.mkdirs()) {
                System.out.println("✅ Folder created: " + dir.getAbsolutePath());
            } else {
                System.out.println("❌ Failed to create folder: " + dir.getAbsolutePath());
            }
        } else {
            System.out.println("Folder already exists: " + dir.getAbsolutePath());
        }
    }
}
