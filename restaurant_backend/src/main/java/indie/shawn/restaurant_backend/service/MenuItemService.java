package indie.shawn.restaurant_backend.service;

import indie.shawn.restaurant_backend.model.MenuItem;
import indie.shawn.restaurant_backend.repository.MenuItemRepository;
import net.sourceforge.pinyin4j.PinyinHelper;
import net.sourceforge.pinyin4j.format.HanyuPinyinCaseType;
import net.sourceforge.pinyin4j.format.HanyuPinyinOutputFormat;
import net.sourceforge.pinyin4j.format.HanyuPinyinToneType;
import net.sourceforge.pinyin4j.format.exception.BadHanyuPinyinOutputFormatCombination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
// import java.util.Optional;
// import java.util.Set;
import java.util.stream.Collectors;
import java.text.Collator;

@Service
public class MenuItemService {

    @Autowired
    MenuItemRepository menuItemRepository;

    public MenuItem save(MenuItem menuItem) {
        String title = menuItem.getTitle();
        StringBuilder abbr = new StringBuilder();
        
        // Process each character in the title
        for (int i = 0; i < title.length(); i++) {
            char c = title.charAt(i);
            
            // If it's a Chinese character
            if (Character.UnicodeBlock.of(c) == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS) {
                try {
                    // Convert Chinese character to pinyin
                    HanyuPinyinOutputFormat format = new HanyuPinyinOutputFormat();
                    format.setCaseType(HanyuPinyinCaseType.UPPERCASE);
                    format.setToneType(HanyuPinyinToneType.WITHOUT_TONE);
                    
                    String[] pinyinArray = PinyinHelper.toHanyuPinyinStringArray(c, format);
                    if (pinyinArray != null && pinyinArray.length > 0) {
                        abbr.append(pinyinArray[0].charAt(0)); // Take first letter of pinyin
                    }
                } catch (BadHanyuPinyinOutputFormatCombination e) {
                    // If conversion fails, just skip this character
                    continue;
                }
            } 
            // If it's an English word (start of a word)
            else if (Character.isLetter(c) && (i == 0 || !Character.isLetter(title.charAt(i - 1)))) {
                abbr.append(Character.toUpperCase(c)); // Add the first letter of each English word
            }
        }
        menuItem.setAbbr(abbr.toString());
        return menuItemRepository.save(menuItem);
    }

    public List<MenuItem> findAll() {
        List<MenuItem> items = menuItemRepository.findAll();

        // 使用 Java Streams 进行过滤
        List<MenuItem> filteredItems = items.stream()
                .filter(item -> item.getOnShelf() == null || item.getOnShelf()) // 保留 getOnShelf 为 true 或 null 的元素
                .toList();

        // Create a Chinese collator for pinyin sorting
        Collator collator = Collator.getInstance(Locale.CHINESE);
        
        // Sort items by title (using pinyin) first, then by price
        items.sort((item1, item2) -> {
            // First compare by title using Chinese collator
            int titleCompare = collator.compare(item1.getTitle(), item2.getTitle());
            
            // If titles are same, compare by price
            if (titleCompare == 0) {
                return Double.compare(item1.getPrice(), item2.getPrice());
            }
            return titleCompare;
        });
        
        return items;
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
                .flatMap(menuItem -> menuItem
                        .getCategories().stream())
                .distinct().collect(Collectors.toList()); // collect and return as List
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
