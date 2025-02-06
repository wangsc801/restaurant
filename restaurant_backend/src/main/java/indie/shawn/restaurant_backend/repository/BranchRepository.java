package indie.shawn.restaurant_backend.repository;

import indie.shawn.restaurant_backend.model.Branch;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BranchRepository extends MongoRepository<Branch,String> {
}
