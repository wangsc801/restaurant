package indie.shawn.restaurant_backend.controller;

import indie.shawn.restaurant_backend.model.message.PrinterMessage;
import indie.shawn.restaurant_backend.model.printer.ThermalPrinterJsonConfig;
import indie.shawn.restaurant_backend.service.printer.ThermalPrinterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/thermal-printer")
public class ThermalPrinterController {
    @Autowired
    ThermalPrinterService thermalPrinterService;

//    @GetMapping("/get-all-names")
//    public List<String> getAllNames() {
//        return thermalPrinterService.getThermalPrintersNameList();
//    }

    @GetMapping("/get-all-configs")
    public List<ThermalPrinterJsonConfig> getAllConfigs(){
        return thermalPrinterService.getAllConfigs();
    }

    @PostMapping("/print-message")
    public void printerMessage(@RequestBody PrinterMessage msg) throws IOException {
        String message = msg.getMessage();
        for(String printerName: msg.getPrinters()){
            thermalPrinterService.printMessageByName(printerName, message);
        }
    }
}