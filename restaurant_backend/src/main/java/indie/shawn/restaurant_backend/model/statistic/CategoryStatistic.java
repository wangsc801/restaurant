package indie.shawn.restaurant_backend.model.statistic;

import indie.shawn.restaurant_backend.model.MenuItem;

import java.util.List;

public class CategoryStatistic {
    private String category;
    private List<SimpleMenuItemStatistic> simpleMenuItemStatisticList;

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<SimpleMenuItemStatistic> getSimpleMenuItemStatisticList() {
        return simpleMenuItemStatisticList;
    }

    public void setSimpleMenuItemStatisticList(List<SimpleMenuItemStatistic> simpleMenuItemStatisticList) {
        this.simpleMenuItemStatisticList = simpleMenuItemStatisticList;
    }

    @Override
    public String toString() {
        return "CategoryStatistic{" +
                "category='" + category + '\'' +
                ", simpleMenuItemStatisticList=" + simpleMenuItemStatisticList +
                '}';
    }
}
