package indie.shawn.restaurant_backend.controller;

import indie.shawn.restaurant_backend.model.MenuItem;
import indie.shawn.restaurant_backend.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
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

    @GetMapping("/{id}")
    public MenuItem findById(@PathVariable String id){
        return menuItemService.findById(id);
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

    @GetMapping("/categories")
    public List<String> getAllCategories() {
        return menuItemService.getAllUniqueCategories();
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

}