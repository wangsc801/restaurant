package indie.shawn.restaurant_backend.controller;

import indie.shawn.restaurant_backend.model.Branch;
import indie.shawn.restaurant_backend.service.BranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/branch")
public class BranchController {

    @Autowired
    private BranchService branchService;

    @GetMapping(value = "")
    public List<Branch> getAllBranches() {
        return branchService.findAll();
    }
}
