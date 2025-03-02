package indie.shawn.restaurant_backend.model.category;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("categories_sort_weight")
public class CategoriesSortWeight {
    @Id
    private String id;
    private String branchId;
    private List<Category> categories;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBranchId() {
        return branchId;
    }

    public void setBranchId(String branchId) {
        this.branchId = branchId;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

    @Override
    public String toString() {
        return "CategoriesSortWeight{" +
                "id='" + id + '\'' +
                ", branchId='" + branchId + '\'' +
                ", categories=" + categories +
                '}';
    }
}
