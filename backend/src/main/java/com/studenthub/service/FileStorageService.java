package com.studenthub.service;

import com.studenthub.exception.InvalidFileException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    private Path uploadPath; // pas final, assigné plus tard

    @PostConstruct
    public void init() throws IOException {
        this.uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
    }

    private static final Map<String, String> EXTENSIONS_BY_CONTENT_TYPE = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp"
    );

    public String store(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("Image is empty");
        }

        String contentType = file.getContentType();
        if (!"image/jpeg".equals(contentType)
                && !"image/png".equals(contentType)
                && !"image/webp".equals(contentType)) {
            throw new InvalidFileException("Invalid image type");
        }

        if (file.getSize() > 5*1024*1024) {
            throw new InvalidFileException("Image too large");
        }


        String extension = EXTENSIONS_BY_CONTENT_TYPE.get(contentType);

        String fileName = UUID.randomUUID() + extension;

        Path filePath = uploadPath.resolve(fileName);

        Files.copy(file.getInputStream(), filePath);

        return fileName;
    }

    public void delete(String filename) throws IOException {
        if (filename == null) {
            return;
        }

        Path filePath = uploadPath.resolve(filename);
        Files.deleteIfExists(filePath);
    }
}
