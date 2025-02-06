package indie.shawn.restaurant_backend.repository;

import indie.shawn.restaurant_backend.model.Employee;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface EmployeeRepository extends MongoRepository<Employee, String> {
    Optional<Employee> findByBranchIdAndName(String branchId, String name);
}
