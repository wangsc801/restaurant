package indie.shawn.restaurant_backend.service;

import indie.shawn.restaurant_backend.model.category.CategoriesSortWeight;
import indie.shawn.restaurant_backend.model.category.Category;
import indie.shawn.restaurant_backend.repository.CategoriesSortWeightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CategoriesSortWeightService {

    @Autowired
    CategoriesSortWeightRepository categoriesSortWeightRepository;

    @Autowired
    MenuItemService menuItemService;

    public CategoriesSortWeight findByBranchId(String branchId) {
        var optionalCategories = categoriesSortWeightRepository.findByBranchId(branchId);
        if (optionalCategories.isEmpty()) {
            List<String> categories = menuItemService.getAllUniqueCategories();
            List<Category> categoryList = new ArrayList<>();
            for (int i = 0; i < categories.size(); i++) {
                categoryList.add(new Category(categories.get(i), i));
            }
            CategoriesSortWeight categoriesSortWeight = new CategoriesSortWeight();
            categoriesSortWeight.setCategories(categoryList);
            categoriesSortWeight.setBranchId(branchId);
            categoriesSortWeightRepository.insert(categoriesSortWeight);
        } else {
            return optionalCategories.get();
        }
        return null;
    }

    public CategoriesSortWeight save(CategoriesSortWeight c){
        return categoriesSortWeightRepository.save(c);
    }
}
