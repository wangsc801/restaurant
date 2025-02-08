package indie.shawn.restaurant_backend.service;

import indie.shawn.restaurant_backend.repository.OrderRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.Map;

@Service
public class StatisticService {

    @Autowired
    OrderRecordRepository orderRecordRepository;


    @Autowired
    private MongoTemplate mongoTemplate;

    public Double totalOfToday(String date, String branchId) {
        LocalDate today = LocalDate.parse(date);
        Date startOfDay = Date.from(today.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endOfDay = Date.from(today.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
        Criteria criteria = Criteria.where("orderedAt").gte(startOfDay).lt(endOfDay)
                .and("branchId").is(branchId);
        MatchOperation matchOperation = Aggregation.match(criteria);
        GroupOperation groupOperation = Aggregation.group().sum("total").as("totalSum");
        Aggregation aggregation = Aggregation.newAggregation(matchOperation, groupOperation);

        AggregationResults<Map> results = mongoTemplate.aggregate(aggregation, "order_records", Map.class);

        if (results.getMappedResults().isEmpty()) {
            return .0;
        }
        Object totalSum = results.getMappedResults().getFirst().get("totalSum");
        if(totalSum.getClass().equals(Integer.class)){
            return ((Integer) totalSum).doubleValue();
        }
        return Double.valueOf((String) totalSum);
    }

}
