package indie.shawn.restaurant_backend.repository;

import indie.shawn.restaurant_backend.model.category.CategoriesSortWeight;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CategoriesSortWeightRepository extends MongoRepository<CategoriesSortWeight,String> {
    Optional<CategoriesSortWeight> findByBranchId(String branchId);
}
