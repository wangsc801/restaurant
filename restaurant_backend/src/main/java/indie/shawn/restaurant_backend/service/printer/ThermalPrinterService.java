package indie.shawn.restaurant_backend.service.printer;

import com.github.anastaciocintra.escpos.EscPos;
import com.github.anastaciocintra.escpos.EscPosConst;
import com.github.anastaciocintra.escpos.Style;
import com.github.anastaciocintra.output.PrinterOutputStream;
import com.github.anastaciocintra.output.TcpIpOutputStream;
import indie.shawn.restaurant_backend.model.OrderItem;
import indie.shawn.restaurant_backend.model.OrderRecord;
import indie.shawn.restaurant_backend.model.printer.ThermalPrinterJsonConfig;
import indie.shawn.restaurant_backend.util.ConfigLoader;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import javax.print.PrintService;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ThermalPrinterService {
    private List<ThermalPrinterJsonConfig> printerConfigs;

    @PostConstruct
    public void init() {
        try {
            String content = ConfigLoader.loadConfig("./config/printers.config.json");
            printerConfigs = ConfigLoader.loadPrinterConfigs(content);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load printer configurations", e);
        }
    }

    public ThermalPrinterJsonConfig getPrinterConfigByName(String printerName) {
        return printerConfigs.stream()
                .filter(config -> config.getPrinterName().equals(printerName))
                .findFirst()
                .orElse(null);
    }

    public List<ThermalPrinterJsonConfig> getAllConfigs() {
        return printerConfigs;
    }

    public void printKitchenReceipt(OrderRecord orderRecord) throws IOException {
        List<ThermalPrinterJsonConfig> configs = printerConfigs.stream().filter(o -> "kitchen".equals(o.getUsage())).toList();
        for (var config : configs) {
            if ("LAN".equals(config.getConnectionType())) {
                TcpIpOutputStream steam = new TcpIpOutputStream(config.getIp(), config.getPort());
                EscPos escpos = new EscPos(steam);
                escpos.setCharsetName("GB18030");
                escposPrintKitchenTemplate(escpos, orderRecord, config.getCategories());
            }
        }
    }

    public void printCustomerReceipt(OrderRecord orderRecord) throws IOException {
        List<ThermalPrinterJsonConfig> configs = printerConfigs.stream()
                .filter(o -> "customer-receipt".equals(o.getUsage())).toList();
        for (var config : configs) {
            if ("LAN".equals(config.getConnectionType())) {
                TcpIpOutputStream steam = new TcpIpOutputStream(config.getIp(), config.getPort());
                EscPos escpos = new EscPos(steam);
                escpos.setCharsetName("GB18030");
                escposCustomerReceiptTemplate(escpos, orderRecord);
            }
            if ("USB".equals(config.getConnectionType())) {
                PrintService printService = PrinterOutputStream.getPrintServiceByName(config.getPrinterName());
                EscPos escpos;
                escpos = new EscPos(new PrinterOutputStream(printService));
                escpos.setCharsetName("GB18030");
                escposCustomerReceiptTemplate(escpos, orderRecord);

            }
        }
    }

    private void escposPrintKitchenTemplate(EscPos escpos, OrderRecord orderRecord, List<String> deviceConfigCategories) throws IOException {

        Set<OrderItem> orderItemsForPrintSet = new HashSet<>();
        for (int i = 0; i < orderRecord.getOrderItems().size(); i++) {
            var item = orderRecord.getOrderItems().get(i);
            for (String orderItemCategory : item.getCategories()) {
                if (deviceConfigCategories.contains(orderItemCategory)) {
                    orderItemsForPrintSet.add(item);
                }
            }
        }
        if (orderItemsForPrintSet.isEmpty()) {
            return;
        }

        Style orderNumberStyle = new Style()
                .setFontSize(Style.FontSize._4, Style.FontSize._4)
                .setBold(true)
                .setJustification(EscPosConst.Justification.Center);
        Style itemStyle = new Style().setFontSize(Style.FontSize._3, Style.FontSize._3).setBold(true);
        Style itemPriceQuantityStyle = new Style().setFontSize(Style.FontSize._3, Style.FontSize._3);
        Style itemFlavorStyle = new Style().setFontSize(Style.FontSize._2, Style.FontSize._2);
        Style orderedAtStyle = new Style().setFontSize(Style.FontSize._3, Style.FontSize._3);
        Style paymentStyle = new Style().setFontSize(Style.FontSize._2, Style.FontSize._2);
        escpos.writeLF(orderNumberStyle, orderRecord.getOrderNumber() + "号");
        escpos.feed(2);

        for (var item : orderItemsForPrintSet) {
            escpos.writeLF(itemStyle, item.getTitle());
            escpos.feed(1);
            var price = item.getPrice();
            if (item.getQuantity() > 1) {
                var quantity = item.getQuantity();
                var itemTotal = price.multiply(new BigDecimal(quantity));
                String text = "  " + price + "元x" + quantity + " [" + itemTotal + "元]";
                escpos.writeLF(itemPriceQuantityStyle, text);
            } else {
                escpos.writeLF(itemPriceQuantityStyle, "  " + price + "元");
            }
            escpos.feed(1);
            if (!item.getSpiciness().isEmpty())
                escpos.writeLF(itemFlavorStyle, "  辣度：" + item.getSpiciness());
            if (!item.getSeasoning().isEmpty())
                escpos.writeLF(itemFlavorStyle, "  调味：" + String.join(", ", item.getSeasoning()));
            if (!item.getIngredients().isEmpty())
                escpos.writeLF(itemFlavorStyle, "  食材：" + String.join(", ", item.getIngredients()));
            if(!item.getCustomRemark().isEmpty()){
                escpos.writeLF(itemStyle," 备注："+item.getCustomRemark());
            }
            escpos.feed(1);
            escpos.writeLF(itemPriceQuantityStyle, "----------");
        }
        escpos.feed(1);
        if(!orderRecord.getRemark().isEmpty()){
            escpos.writeLF(itemStyle, "订单备注：" + orderRecord.getRemark());
        }
        escpos.feed(1);
        String formattedOrderedAt = orderRecord.getOrderedAt().format(DateTimeFormatter.ofPattern("yy-MM-dd HH:mm"));
        escpos.writeLF(orderedAtStyle, formattedOrderedAt);
        escpos.feed(1);
        escpos.writeLF(paymentStyle, "支付方式：" + orderRecord.getPaymentMethod());
        escpos.feed(5);
        escpos.writeLF("\n");
        escpos.cut(EscPos.CutMode.FULL);
        escpos.close();
    }

    private void escposCustomerReceiptTemplate(EscPos escpos, OrderRecord orderRecord) throws IOException {
        Style orderNumberStyle = new Style()
                .setFontSize(Style.FontSize._3, Style.FontSize._3)
                .setBold(true)
                .setJustification(EscPosConst.Justification.Center);
        Style itemStyle = new Style().setFontSize(Style.FontSize._2, Style.FontSize._2).setBold(true);
        Style itemPriceQuantity = new Style().setFontSize(Style.FontSize._2, Style.FontSize._2);
        Style paymentStyle = new Style().setFontSize(Style.FontSize._1, Style.FontSize._1);
        escpos.writeLF(orderNumberStyle, orderRecord.getOrderNumber() + "号");
        escpos.feed(2);
        for (int i = 0; i < orderRecord.getOrderItems().size(); i++) {
            var item = orderRecord.getOrderItems().get(i);
            escpos.write(itemStyle, (i + 1) + ". ");
            escpos.writeLF(itemStyle, item.getTitle());
            escpos.feed(1);
            var price = item.getPrice();
            if (item.getQuantity() > 1) {
                var quantity = item.getQuantity();
                var itemTotal = price.multiply(new BigDecimal(quantity));
                String text = "  " + price + "元x" + quantity + " [" + itemTotal + "元]";
                escpos.writeLF(itemPriceQuantity, text);
            } else {
                escpos.writeLF(itemPriceQuantity, "  " + price + "元");
            }
            escpos.feed(1);
        }
        escpos.writeLF(orderRecord.getOrderedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        escpos.feed(3);
        escpos.writeLF(paymentStyle, "支付方式：" + orderRecord.getPaymentMethod());
        escpos.feed(3);
        escpos.cut(EscPos.CutMode.FULL);
        escpos.close();
    }
}
