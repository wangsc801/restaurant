package indie.shawn.restaurant_backend.service;

import indie.shawn.restaurant_backend.model.OrderItem;
import indie.shawn.restaurant_backend.model.message.OrderItemMessage;
import indie.shawn.restaurant_backend.model.OrderRecord;
import indie.shawn.restaurant_backend.repository.OrderRecordRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderRecordService {
    @Autowired
    private OrderRecordRepository orderRecordRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public OrderRecord add(OrderRecord orderRecord, Boolean isReserve) {
        orderRecord.getOrderItems().stream()
                .filter(item -> item.getId() == null) // Filter out items that do not have an ID set
                .forEach(item -> item.setId(String.valueOf(new ObjectId())));
        if (!isReserve) {
            var now = LocalDateTime.now();
            orderRecord.setCreatedAt(now);
            orderRecord.setUpdatedAt(now);
            orderRecord.setOrderedAt(now);
        }
        OrderRecord savedOrder = orderRecordRepository.save(orderRecord);

        messagingTemplate.convertAndSend("/topic/orders/new/branch-id/" + savedOrder.getBranchId(), savedOrder);
        for (var order : savedOrder.getOrderItems()) {
            for (String cate : order.getCategories()) {
                messagingTemplate.convertAndSend(
                        "/topic/orders/new/category/" + cate + "/branch-id/" + savedOrder.getBranchId(),
                        savedOrder);
            }
        }
        return savedOrder;
    }

    public List<OrderRecord> findByBranchId(String branchId, int limit) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        PageRequest pageRequest = PageRequest.of(0, limit, sort);
        return orderRecordRepository.findByBranchId(branchId, pageRequest);
    }

    public Long countTodayOrdersByBranchId(String id) {
        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.now().with(LocalTime.MAX);

        return orderRecordRepository.findByBranchId(id).stream()
                .filter(order -> {
                    LocalDateTime orderTime = order.getCreatedAt();
                    return orderTime != null &&
                            !orderTime.isBefore(startOfDay) &&
                            !orderTime.isAfter(endOfDay);
                })
                .count();
    }

    public List<OrderRecord> findRecentOrders(int recentHours) {
        // Get timestamp from specified hours ago
        LocalDateTime hoursAgo = LocalDateTime.now().minusHours(recentHours);

        return orderRecordRepository.findAll().stream()
                .filter(order -> {
                    LocalDateTime orderTime = order.getCreatedAt();
                    return orderTime != null && !orderTime.isBefore(hoursAgo);
                })
                .sorted(Comparator.comparing(OrderRecord::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    public List<OrderRecord> findRecentOrdersByBranchAndCategory(Integer limit, String branchId, String category) {
        Query query = new Query();
        query.addCriteria(Criteria.where("branchId").is(branchId));
        if (category.contains("&")) {
            String[] categories = category.split("&");
            query.addCriteria(Criteria.where("orderItems.categories").in((Object[]) categories));
        } else {
            query.addCriteria(Criteria.where("orderItems.categories").in(category));
        }
        // 按 createdAt 排序并限制返回数量
        query.with(Sort.by(Sort.Direction.DESC, "orderedAt")).limit(limit);
        return mongoTemplate.find(query, OrderRecord.class);
    }

    public Boolean setPlatedByIdAndOrderItemId(String orderId, String orderItemId, Boolean trueOrFalse) {
        Query query = new Query(Criteria.where("_id").is(orderId)
                .and("orderItems").elemMatch(Criteria.where("_id").is(orderItemId)));
        Update update = new Update().set("orderItems.$.plated", trueOrFalse);
        mongoTemplate.updateFirst(query, update, OrderRecord.class);
        Optional<OrderRecord> orderRecord = orderRecordRepository.findByIdAndOrderItemId(orderId, orderItemId);
        var res = orderRecord.flatMap(rec -> rec.getOrderItems().stream()
                        .filter(item -> item.getId().equals(orderItemId)).findFirst().map(OrderItem::getPlated))
                .orElse(null);
        OrderItemMessage message = new OrderItemMessage();
        message.setOrderId(orderId);
        message.setItemId(orderItemId);
        message.setUpdates(Map.of("plated", Objects.equals(res, true)));
        messagingTemplate.convertAndSend("/topic/order-item/update", message);
        return res;
    }

    public Boolean setDeliveredByIdAndOrderItemId(String orderId, String orderItemId, Boolean trueOrFalse) {
        Query query = new Query(Criteria.where("_id").is(orderId)
                .and("orderItems").elemMatch(Criteria.where("_id").is(orderItemId)));
        Update update = new Update().set("orderItems.$.delivered", trueOrFalse);
        mongoTemplate.updateFirst(query, update, OrderRecord.class);
        Optional<OrderRecord> orderRecord = orderRecordRepository.findByIdAndOrderItemId(orderId, orderItemId);
        var res = orderRecord.flatMap(rec -> rec.getOrderItems().stream()
                        .filter(item -> item.getId().equals(orderItemId)).findFirst().map(OrderItem::getDelivered))
                .orElse(null);
        OrderItemMessage message = new OrderItemMessage();
        message.setOrderId(orderId);
        message.setItemId(orderItemId);
        message.setUpdates(Map.of("delivered", Objects.equals(res, true)));
        messagingTemplate.convertAndSend("/topic/order-item/update", message);
        return res;
    }
}
