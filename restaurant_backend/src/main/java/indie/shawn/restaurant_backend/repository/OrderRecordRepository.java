package indie.shawn.restaurant_backend.repository;

import indie.shawn.restaurant_backend.model.OrderRecord;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface OrderRecordRepository extends MongoRepository<OrderRecord, String> {
    List<OrderRecord> findByBranchId(String branchId);

    List<OrderRecord> findByBranchId(String branchId, Pageable pageable);

    @Query("{'_id': ?0, 'orderItems._id': ?1}")
    Optional<OrderRecord> findByIdAndOrderItemId(String id, String orderItemId);
}
