package indie.shawn.restaurant_backend.model.statistic;

public class SimpleMenuItemStatistic {
    private String menuItemTitle;
    private Integer quantity;
    private Double total;

    public SimpleMenuItemStatistic(String title, Integer quantity, double v) {
        this.menuItemTitle = title;
        this.quantity = quantity;
        this.total = v;
    }

    public String getMenuItemTitle() {
        return menuItemTitle;
    }

    public void setMenuItemTitle(String menuItemTitle) {
        this.menuItemTitle = menuItemTitle;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }
}
