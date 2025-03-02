package indie.shawn.restaurant_backend.repository;

import indie.shawn.restaurant_backend.model.RechargeRecord;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RechargeRecordRepository extends MongoRepository<RechargeRecord, String> {

}
