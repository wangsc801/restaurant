package indie.shawn.restaurant_backend.controller;

import indie.shawn.restaurant_backend.model.OrderRecord;
import indie.shawn.restaurant_backend.service.OrderRecordService;
import indie.shawn.restaurant_backend.service.printer.ThermalPrinterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/api/order-record")
public class OrderRecordController {
    @Autowired
    OrderRecordService orderRecordService;

    @Autowired
    ThermalPrinterService thermalPrinterService;

    @PostMapping("/add")
    public OrderRecord add(@RequestBody OrderRecord orderRecord,
                           @RequestHeader("X-Print-Receipt") Boolean printReceipt,
                           @RequestHeader("X-Print-Times") Integer times) throws IOException {
        var order = orderRecordService.add(orderRecord, false);
        if (printReceipt) {
            thermalPrinterService.printCustomerReceipt(order, times);
        }
        return order;
    }

    @GetMapping("/count-today/branch-id/{id}")
    public Long countTodayOrders(@PathVariable String id) {
        return orderRecordService.countTodayOrdersByBranchId(id);
    }

    @GetMapping("get-recent-quantity/{quantity}/branch-id/{id}")
    public List<OrderRecord> getRecentByBranchIdWithLimitedQuantity(@PathVariable String id, @PathVariable int quantity) {
        return orderRecordService.findByBranchId(id, quantity);
    }

    @GetMapping("/get-recent-hours/{hours}/branch-id/{branchId}")
    public List<OrderRecord> findAll(@PathVariable int hours, @PathVariable String branchId) {
        return orderRecordService.findRecentOrders(hours);
    }

    @GetMapping("/get-recent/{limit}/categories/{categories}/branch-id/{branchId}")
    public ResponseEntity<List<OrderRecord>>
    findRecentOrdersByBranchAndCategory(@PathVariable Integer limit, @PathVariable String branchId, @PathVariable String categories) {
        List<OrderRecord> orders = orderRecordService.findRecentOrdersByBranchAndCategory(limit, branchId, categories);
        return ok(orders);
    }

    @PostMapping("/{id}/order-item/{orderItemId}/plated")
    public Boolean setPlatedByIdAndOrderItemId(@PathVariable String id, @PathVariable String orderItemId) {
        return orderRecordService.setPlatedByIdAndOrderItemId(id, orderItemId, true);
    }

    @PostMapping("/{id}/order-item/{orderItemId}/not-plated")
    public Boolean setNotPlatedByIdAndOrderItemId(@PathVariable String id, @PathVariable String orderItemId) {
        return orderRecordService.setPlatedByIdAndOrderItemId(id, orderItemId, false);
    }

    @PostMapping("/{id}/order-item/{orderItemId}/delivered")
    public Boolean setDeliveredByIdAndOrderItemId(@PathVariable String id, @PathVariable String orderItemId) {
        return orderRecordService.setDeliveredByIdAndOrderItemId(id, orderItemId, true);
    }

    @PostMapping("/{id}/order-item/{orderItemId}/not-delivered")
    public Boolean setNotDeliveredByIdAndOrderItemId(@PathVariable String id, @PathVariable String orderItemId) {
        return orderRecordService.setDeliveredByIdAndOrderItemId(id, orderItemId, false);
    }


    @PostMapping("/{id}/print/times/{times}")
    public void print(@PathVariable String id, @PathVariable Integer times) throws IOException {
        Optional<OrderRecord> record = orderRecordService.findById(id);

        if (record.isPresent()) {
            thermalPrinterService.printCustomerReceipt(record.get(), times);

        } else {
            System.out.println("error happend while printing");
        }
    }
}
