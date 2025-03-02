package indie.shawn.restaurant_backend.model.category;

public class Category {
    private String name;
    private Integer sortWeight;

    public Category(String name, Integer sortWeight) {
        this.name = name;
        this.sortWeight = sortWeight;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getSortWeight() {
        return sortWeight;
    }

    public void setSortWeight(Integer sortWeight) {
        this.sortWeight = sortWeight;
    }

    @Override
    public String toString() {
        return "Category{" +
                "name='" + name + '\'' +
                ", sortWeight=" + sortWeight +
                '}';
    }
}
