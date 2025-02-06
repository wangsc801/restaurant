package indie.shawn.restaurant_backend.controller;

import indie.shawn.restaurant_backend.model.EmployeeLoginRequest;
import indie.shawn.restaurant_backend.service.SignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employee")
public class SignController {

    @Autowired
    SignService signService;

    @PostMapping("/sign_in")
    public ResponseEntity<?> authenticateEmployee(@RequestBody EmployeeLoginRequest request) {
        return signService.signIn(request.getBranchId(), request.getName(), request.getPassword());
    }
}
