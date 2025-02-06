package indie.shawn.restaurant_backend.util;

import java.text.Collator;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;

public class SortUtil {
    public static List<String> categoriesSetSort(Set<String> categories){
        List<String> list = new ArrayList<>(categories);
        list.sort(Collator.getInstance(Locale.CHINA)::compare);
        return list.stream().toList();
    }
}
