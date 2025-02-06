package indie.shawn.restaurant_backend.model;

import org.springframework.data.annotation.Id;

import java.math.BigDecimal;
import java.util.List;

public class OrderItem {
    @Id
    private String id;
    private String menuItemId;
    private String title;        // Name of the menu item
    private BigDecimal price;    // Price per unit
    private Integer quantity;
    private List<String> categories;
    private String spiciness;    // Changed to single String to match TypeScript
    private List<String> seasoning;
    private List<String> ingredients;
    private String customRemark;        // Special instructions for this item
    private String orderItemStatus;
    private Boolean plated;
    private Boolean delivered;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMenuItemId() {
        return menuItemId;
    }

    public void setMenuItemId(String menuItemId) {
        this.menuItemId = menuItemId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }


    public String getSpiciness() {
        return spiciness;
    }

    public void setSpiciness(String spiciness) {
        this.spiciness = spiciness;
    }

    public List<String> getCategories() {
        return categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    public List<String> getSeasoning() {
        return seasoning;
    }

    public void setSeasoning(List<String> seasoning) {
        this.seasoning = seasoning;
    }

    public List<String> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<String> ingredients) {
        this.ingredients = ingredients;
    }

    public String getCustomRemark() {
        return customRemark;
    }

    public void setCustomRemark(String customRemark) {
        this.customRemark = customRemark;
    }

    public String getOrderItemStatus() {
        return orderItemStatus;
    }

    public void setOrderItemStatus(String orderItemStatus) {
        this.orderItemStatus = orderItemStatus;
    }

    public Boolean getPlated() {
        return plated;
    }

    public void setPlated(Boolean plated) {
        this.plated = plated;
    }

    public Boolean getDelivered() {
        return delivered;
    }

    public void setDelivered(Boolean delivered) {
        this.delivered = delivered;
    }

    @Override
    public String toString() {
        return "OrderItem{" +
                "id='" + id + '\'' +
                ", menuItemId='" + menuItemId + '\'' +
                ", title='" + title + '\'' +
                ", price=" + price +
                ", quantity=" + quantity +
                ", categories=" + categories +
                ", spiciness='" + spiciness + '\'' +
                ", seasoning=" + seasoning +
                ", ingredients=" + ingredients +
                ", customRemark='" + customRemark + '\'' +
                ", orderItemStatus='" + orderItemStatus + '\'' +
                ", plated=" + plated +
                ", delivered=" + delivered +
                '}';
    }
}