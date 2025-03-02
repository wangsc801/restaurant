package indie.shawn.restaurant_backend.controller;

import indie.shawn.restaurant_backend.model.category.CategoriesSortWeight;
import indie.shawn.restaurant_backend.service.CategoriesSortWeightService;
import indie.shawn.restaurant_backend.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoriesController {

    @Autowired
    MenuItemService menuItemService;

    @Autowired
    CategoriesSortWeightService categoriesSortWeightService;

    @GetMapping("")
    public List<String> getAllCategories() {
        return menuItemService.getAllUniqueCategories();
    }

    @GetMapping("/sort-weight/branch-id/{branchId}")
    public CategoriesSortWeight findByBranchId(@PathVariable("branchId") String branchId){
        return categoriesSortWeightService.findByBranchId(branchId);
    }

    @PutMapping("/sort-weight/update")
    public CategoriesSortWeight update(@RequestBody CategoriesSortWeight c){
        System.out.println(c);
        return categoriesSortWeightService.save(c);
    }
}
