package indie.shawn.restaurant_backend.repository;

import indie.shawn.restaurant_backend.model.OrderQuantityOfDate;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface OrderQuantityOfDateRepository extends MongoRepository<OrderQuantityOfDate, String> {
    Optional<OrderQuantityOfDate> findByBranchIdAndDate(String branchId, LocalDate date);
    Integer findQuantityByBranchIdAndDate(String branchId, LocalDate date);
//    OrderQuantityOfDate addOneOnQuantityByBranchId(String branchId);
}
