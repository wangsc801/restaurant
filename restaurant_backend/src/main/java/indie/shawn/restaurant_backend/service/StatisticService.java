package indie.shawn.restaurant_backend.service;

import indie.shawn.restaurant_backend.model.OrderRecord;
import indie.shawn.restaurant_backend.repository.OrderRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Service
public class StatisticService {

    @Autowired
    OrderRecordRepository orderRecordRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public Double totalOfTheDate(String date, String branchId) {
        LocalDate theDate = LocalDate.parse(date);
        ZoneId localZone = ZoneId.systemDefault();

        ZoneId gmtZone = ZoneId.of("GMT");
        Date startOfDay = Date.from(theDate.atStartOfDay(localZone)
                .withZoneSameInstant(gmtZone).toInstant());
        Date endOfDay = Date.from(theDate.plusDays(1).atStartOfDay(localZone)
                .withZoneSameInstant(gmtZone).toInstant());

        System.out.println(startOfDay);
        System.out.println(endOfDay);

        Query query = new Query(
                Criteria.where("branchId").is(branchId)
                        .and("createdAt").gte(startOfDay).lt(endOfDay)
        );

        List<OrderRecord> orders = mongoTemplate.find(query, OrderRecord.class, "order_records");
        // 3. Then calculate total
        return orders.stream()
                .mapToDouble(OrderRecord::getTotal)
                .sum();
    }
}
