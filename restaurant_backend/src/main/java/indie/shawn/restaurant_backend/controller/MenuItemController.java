package indie.shawn.restaurant_backend.controller;

import indie.shawn.restaurant_backend.model.MenuItem;
import indie.shawn.restaurant_backend.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.Base64;
import java.net.MalformedURLException;

@RestController
@RequestMapping("/api/menu-items")
public class MenuItemController {

    @Autowired
    private MenuItemService menuItemService;

    @Value("${app.upload-path.menu-item}")
    private String uploadPathMenuItem;

    @Value("${app.uploaded-url-prefix.menu-item}")
    private String uploadedUrlPrefixMenuItem;

    @GetMapping(value = "")
    public List<MenuItem> getAllMenuItems() {
        return menuItemService.findAll();
    }

    @GetMapping("/categories")
    public List<String> getAllCategories() {
        return menuItemService.getAllUniqueCategories();
    }

    @GetMapping("/{id}")
    public MenuItem findById(@PathVariable String id){
        return menuItemService.findById(id);
    }

    @PostMapping("/upload-binary-image")
    public ResponseEntity<String> uploadBinaryImage(@RequestBody String base64Image) {
        try {
            // Remove base64 prefix if it exists (it shouldn't in your case since you're already removing it in frontend)
            if (base64Image.contains(",")) {
                base64Image = base64Image.split(",")[1];
            }

            // Decode base64 string to byte array
            byte[] imageBytes = Base64.getDecoder().decode(base64Image);

            // Generate unique filename
            String fileName = UUID.randomUUID().toString() + ".jpg";
            
            // Define the directory to save images
            String uploadDir = "./uploads/menu-items";
            Path uploadPath = Paths.get(uploadDir);
            
            // Create directory if it doesn't exist
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Save the file
            Path filePath = uploadPath.resolve(fileName);
            Files.write(filePath, imageBytes);

            // Return the file path that can be stored in database
            return ResponseEntity.ok(fileName);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid base64 string");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save image: " + e.getMessage());
        }
    }

    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Create absolute path for upload directory
            Path uploadPath = Paths.get(uploadPathMenuItem).toAbsolutePath();
            System.out.println("Upload directory absolute path: " + uploadPath);
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
            String uniqueFileName = System.currentTimeMillis() + "_" + fileName;

            Path filePath = uploadPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return ResponseEntity.ok(uploadedUrlPrefixMenuItem + uniqueFileName);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not upload file: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<MenuItem> createMenuItem(@RequestBody MenuItem menuItem) {
        return ResponseEntity.ok(menuItemService.save(menuItem));
    }

    @GetMapping("/tags")
    public List<String> getAllTags() {
        return menuItemService.getAllUniqueTags();
    }

    @PostMapping("/add")
    public MenuItem add(@RequestBody MenuItem menuItem){
        System.out.println(menuItem);
        return menuItemService.save(menuItem);
    }

    @PostMapping("/update")
    public MenuItem update(@RequestBody MenuItem menuItem){
        menuItem.setUpdatedAt(LocalDateTime.now());
        System.out.println("update");
        System.out.println(menuItem);
        return menuItemService.save(menuItem);
    }

    // Add this method to serve the images
    @GetMapping("/menu-items/images/{fileName}")
    public ResponseEntity<Resource> getImage(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get("./uploads/menu-items").resolve(fileName);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


}