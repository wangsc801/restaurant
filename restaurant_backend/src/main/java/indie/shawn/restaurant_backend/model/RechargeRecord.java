package indie.shawn.restaurant_backend.model;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Document("recharge_records")
public class RechargeRecord {
    @MongoId
    private String id;
    private String customerId;
    private String phone;
    private Double rechargeAmount;
    private Double bonusAmount;
    private Double currentTotalAmount;
    private LocalDateTime rechargeTime;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public Double getRechargeAmount() {
        return rechargeAmount;
    }

    public void setRechargeAmount(Double rechargeAmount) {
        this.rechargeAmount = rechargeAmount;
    }

    public Double getBonusAmount() {
        return bonusAmount;
    }

    public void setBonusAmount(Double bonusAmount) {
        this.bonusAmount = bonusAmount;
    }

    public Double getCurrentTotalAmount() {
        return currentTotalAmount;
    }

    public void setCurrentTotalAmount(Double currentTotalAmount) {
        this.currentTotalAmount = currentTotalAmount;
    }

    public LocalDateTime getRechargeTime() {
        return rechargeTime;
    }

    public void setRechargeTime(LocalDateTime rechargeTime) {
        this.rechargeTime = rechargeTime;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    @Override
    public String toString() {
        return "CustomerRechargeRecord{" +
                "id='" + id + '\'' +
                ", phone='" + phone + '\'' +
                ", rechargeAmount=" + rechargeAmount +
                ", bonusAmount=" + bonusAmount +
                ", currentTotalAmount=" + currentTotalAmount +
                ", rechargeTime=" + rechargeTime +
                '}';
    }
}
