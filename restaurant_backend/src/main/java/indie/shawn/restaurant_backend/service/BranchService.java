package indie.shawn.restaurant_backend.service;

import indie.shawn.restaurant_backend.model.Branch;
import indie.shawn.restaurant_backend.repository.BranchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BranchService {

    @Autowired
    BranchRepository branchRepository;

    public List<Branch> findAll(){
        return branchRepository.findAll();
    }
}
