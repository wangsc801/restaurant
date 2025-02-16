package indie.shawn.restaurant_backend.service;

import indie.shawn.restaurant_backend.model.OrderItem;
import indie.shawn.restaurant_backend.model.OrderRecord;
import indie.shawn.restaurant_backend.model.statistic.CategoryStatistic;
import indie.shawn.restaurant_backend.model.statistic.SimpleMenuItemStatistic;
import indie.shawn.restaurant_backend.repository.OrderRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

class StartAndEndDate {
    private Date startDate;
    private Date endDate;

    public StartAndEndDate(String startDateStr) {
        LocalDate startDate = LocalDate.parse(startDateStr);
        ZoneId localZone = ZoneId.systemDefault();

        ZoneId gmtZone = ZoneId.of("GMT");
        Date startOfDay = Date.from(startDate.atStartOfDay(localZone)
                .withZoneSameInstant(gmtZone).toInstant());
        Date endOfDay = Date.from(startDate.plusDays(1).atStartOfDay(localZone)
                .withZoneSameInstant(gmtZone).toInstant());
        setStartDate(startOfDay);
        setEndDate(endOfDay);
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }
}

@Service
public class StatisticService {

    @Autowired
    OrderRecordRepository orderRecordRepository;

    @Autowired
    private MongoTemplate mongoTemplate;


    public List<OrderRecord> findAllOrderRecordByDateAndBranchId(String date, String branchId) {
        StartAndEndDate startAndEndDate = new StartAndEndDate(date);

        Query query = new Query(
                Criteria.where("branchId").is(branchId)
                        .and("orderedAt")
                        .gte(startAndEndDate.getStartDate()).lt(startAndEndDate.getEndDate()));

        return mongoTemplate.find(query, OrderRecord.class, "order_records");
    }

    public Double totalOfTheDate(String date, String branchId) {
//        StartAndEndDate startAndEndDate = new StartAndEndDate(date);
//
//        Query query = new Query(
//                Criteria.where("branchId").is(branchId)
//                        .and("orderedAt")
//                        .gte(startAndEndDate.getStartDate()).lt(startAndEndDate.getEndDate()));
        List<OrderRecord> orders = findAllOrderRecordByDateAndBranchId(date, branchId);
        // 3. Then calculate total
        return orders.stream()
                .mapToDouble(OrderRecord::getTotal)
                .sum();
    }

    public Map<String, List<SimpleMenuItemStatistic>> categoryStatistics(String date, String branchId) {
        List<OrderRecord> orders = findAllOrderRecordByDateAndBranchId(date, branchId);

        // Map to store category -> List<SimpleMenuItemStatistic>
        Map<String, List<SimpleMenuItemStatistic>> categoryMap = new HashMap<>();

        // Iterate through all orders and their items
        for (OrderRecord order : orders) {
            for (OrderItem item : order.getOrderItems()) {
                double price = item.getPrice();
                Integer quantity = item.getQuantity();
                double total = price * quantity;

                // Iterate through categories of the current item
                for (String category : item.getCategories()) {
                    categoryMap.computeIfAbsent(category, k -> new ArrayList<>());

                    // Check if the menu item already exists in the list for this category
                    boolean found = false;
                    for (SimpleMenuItemStatistic stat : categoryMap.get(category)) {
                        if (stat.getMenuItemTitle().equals(item.getTitle())) {
                            stat.setQuantity(stat.getQuantity() + quantity);
                            stat.setTotal(stat.getTotal() + total);
                            found = true;
                            break;
                        }
                    }

                    // If not found, add a new SimpleMenuItemStatistic
                    if (!found) {
                        categoryMap.get(category).add(new SimpleMenuItemStatistic(item.getTitle(), quantity, total));
                    }
                }
            }
        }
        return categoryMap;
    }
}
