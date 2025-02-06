package indie.shawn.restaurant_backend.service;

import indie.shawn.restaurant_backend.model.OrderQuantityOfDate;
import indie.shawn.restaurant_backend.repository.OrderQuantityOfDateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class OrderQuantityOfDateService {
    @Autowired
    private OrderQuantityOfDateRepository orderQuantityOfDateRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public Integer findQuantityByBranchIdAndDate(String branchId, LocalDate date) {
        var quantity = orderQuantityOfDateRepository.findByBranchIdAndDate(branchId, date);
        return quantity.map(OrderQuantityOfDate::getQuantity).orElse(null);
    }

    public Integer quantityAddOneByBranchIdAndDate(String branchId, LocalDate date) {
        Query query = new Query(Criteria.where("branchId").is(branchId).and("date").is(date));
        Update update = new Update().inc("quantity", 1);
        mongoTemplate.updateFirst(query, update, OrderQuantityOfDate.class);
        return orderQuantityOfDateRepository.findByBranchIdAndDate(branchId, LocalDate.now())
                .map(OrderQuantityOfDate::getQuantity).orElse(-1);
    }

    public Integer findTodayQuantityByBranchId(String branchId) {
        var today = LocalDate.now();
        return findQuantityByBranchIdAndDate(branchId, today);
    }

    public void establishRecordByBranchId(String branchId) {
        var today = LocalDate.now();
        if (findTodayQuantityByBranchId(branchId) == null) {
            var now = LocalDateTime.now();
            OrderQuantityOfDate orderQuantityOfDate = new OrderQuantityOfDate();
            orderQuantityOfDate.setBranchId(branchId);
            orderQuantityOfDate.setQuantity(0);
            orderQuantityOfDate.setDate(today);
            orderQuantityOfDate.setCreatedAt(now);
            orderQuantityOfDate.setUpdatedAt(now);
            orderQuantityOfDateRepository.save(orderQuantityOfDate);
        }
    }
}
