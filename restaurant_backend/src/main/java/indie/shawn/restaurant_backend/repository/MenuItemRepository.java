package indie.shawn.restaurant_backend.repository;


import indie.shawn.restaurant_backend.model.MenuItem;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MenuItemRepository extends MongoRepository<MenuItem, String> {
}
