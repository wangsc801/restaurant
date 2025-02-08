package indie.shawn.restaurant_backend.controller;

import indie.shawn.restaurant_backend.service.StatisticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistic")
public class StatisticController {

    @Autowired
    StatisticService statisticService;

    @GetMapping("/total/date/{date}/branch-id/{branchId}")
    public Double todayTotal(@PathVariable String date, @PathVariable String branchId){
        var total = statisticService.totalOfToday(date,branchId);
        return total;
    }
}
