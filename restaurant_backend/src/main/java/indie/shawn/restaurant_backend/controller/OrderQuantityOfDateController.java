package indie.shawn.restaurant_backend.controller;

import indie.shawn.restaurant_backend.service.OrderQuantityOfDateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;


@RestController
@RequestMapping("/api/order-quantity-of-date")
public class OrderQuantityOfDateController {

    @Autowired
    private OrderQuantityOfDateService orderQuantityOfDateService;

    @GetMapping("/today/branch-id/{branchId}")
    public Integer findTodayQuantityByBranchId(@PathVariable String branchId) {
        Integer todayQuantity = orderQuantityOfDateService.findTodayQuantityByBranchId(branchId);
        if(todayQuantity==null){
            return -1;
        }
        return orderQuantityOfDateService.findTodayQuantityByBranchId(branchId);
    }

    @PostMapping("/today-add-one/branch-id/{branchId}")
    public Integer todayAddOneOfBranchId(@PathVariable String branchId) {
        Integer quantityOfToday = orderQuantityOfDateService.findTodayQuantityByBranchId(branchId);
        if (quantityOfToday == null) {
            orderQuantityOfDateService.establishRecordByBranchId(branchId);
        }
        return orderQuantityOfDateService.quantityAddOneByBranchIdAndDate(branchId, LocalDate.now());
    }
}
