package indie.shawn.restaurant_backend.model.message;

import java.util.Map;

public class OrderItemMessage {
    private String type;
    private String orderId;
    private String itemId;
    private Map<String, Object> updates;

    // Constructor, getters, and setters

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getItemId() {
        return itemId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public Map<String, Object> getUpdates() {
        return updates;
    }

    public void setUpdates(Map<String, Object> updates) {
        this.updates = updates;
    }

    @Override
    public String toString() {
        return "OrderItemUpdateMessage{" +
                "type='" + type + '\'' +
                ", orderId=" + orderId +
                ", itemId=" + itemId +
                ", updates=" + updates +
                '}';
    }
}
