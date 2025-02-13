package indie.shawn.restaurant_backend.controller;

import indie.shawn.restaurant_backend.model.statistic.CategoryStatistic;
import indie.shawn.restaurant_backend.model.statistic.SimpleMenuItemStatistic;
import indie.shawn.restaurant_backend.service.StatisticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistic")
public class StatisticController {

    @Autowired
    StatisticService statisticService;

    @GetMapping("/total/date/{date}/branch-id/{branchId}")
    public Double totalOfTheDate(@PathVariable String date, @PathVariable String branchId) {
        return statisticService.totalOfTheDate(date, branchId);
    }

    @GetMapping("/category/date/{date}/branch-id/{branchId}")
    public Map<String, List<SimpleMenuItemStatistic>> categoryStatisticOfTheDate(@PathVariable String date, @PathVariable String branchId) {
        return statisticService.categoryStatistics(date, branchId);
    }
}
