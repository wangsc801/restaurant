package indie.shawn.restaurant_backend.service;

import indie.shawn.restaurant_backend.model.MenuItem;
import indie.shawn.restaurant_backend.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
// import java.util.Optional;
// import java.util.Set;
import java.util.stream.Collectors;
import java.util.Arrays;

@Service
public class MenuItemService {

    @Autowired
    MenuItemRepository menuItemRepository;

    public MenuItem save(MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

    public List<MenuItem> findAll() {
        return menuItemRepository.findAll();
    }

    public MenuItem findById(String id) {
        return menuItemRepository.findById(id)
                .orElse(null);  // Returns null if not found
    }

    /**
     * Extract unique categories from all menu items
     *
     * @return List<String> containing unique categories
     */
    public List<String> getAllUniqueCategories() {
        return menuItemRepository.findAll().stream()
                .flatMap(menuItem -> menuItem.getCategories().stream())
                .collect(Collectors.toCollection(HashSet::new)) // use HashSet to remove duplicates
                .stream()
                .collect(Collectors.toList()); // collect and return as List
    }

    /**
     * Extract unique tags from all menu items
     *
     * @return List<String> containing unique tags
     */
    public List<String> getAllUniqueTags() {
        return menuItemRepository.findAll().stream()
                .flatMap(menuItem -> menuItem.getTags().stream())
                .filter(tag -> tag != null && !tag.isEmpty()) // filter out null or empty strings
                .collect(Collectors.toCollection(HashSet::new)) // use HashSet to remove duplicates
                .stream()
                .collect(Collectors.toList()); // collect and return as List
    }
}
