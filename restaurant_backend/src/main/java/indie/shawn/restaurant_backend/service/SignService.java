package indie.shawn.restaurant_backend.service;

import indie.shawn.restaurant_backend.model.message.ApiError;
import indie.shawn.restaurant_backend.model.Employee;
import indie.shawn.restaurant_backend.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

// import java.util.Optional;

@Service
public class SignService {
    @Autowired
    EmployeeRepository employeeRepository;

    public ResponseEntity<?> signIn(String branchId, String name, String password) {
        try {
            var employeeOpt = employeeRepository.findByBranchIdAndName(branchId, name);
            
            if (employeeOpt.isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiError("Employee not found"));
            }

            Employee employee = employeeOpt.get();
            if (BCrypt.checkpw(password, employee.getPassword())) {
                return ResponseEntity.ok(employee);
            } else {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiError("Invalid password"));
            }
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiError("Authentication failed: " + e.getMessage()));
        }
    }
}
