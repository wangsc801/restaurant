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
import javax.print.attribute.Attribute;
import javax.print.attribute.AttributeSet;
import javax.print.attribute.PrintServiceAttribute;
import javax.print.DocFlavor;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;
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
        List<ThermalPrinterJsonConfig> configs = printerConfigs.stream()
                .filter(o -> "kitchen".equals(o.getUsage()))
                .toList();

        for (var config : configs) {
            EscPos escpos = null;
            try {
                if ("ByName".equals(config.getConnectionType())) {
                    // For USB connected printer
                    PrintService printService = PrinterOutputStream.getPrintServiceByName(config.getPrinterName());
                    if (printService == null) {
                        System.err.println("Printer not found: " + config.getPrinterName());
                        continue;
                    }

                    PrinterOutputStream printerOutputStream = new PrinterOutputStream(printService);
                    escpos = new EscPos(printerOutputStream);
                    escpos.setCharsetName("GB18030");
                    escposPrintKitchenTemplate(escpos, orderRecord, config.getCategories());

                    // Ensure proper flushing and closing
                    escpos.flush();
                }

                if ("LAN".equals(config.getConnectionType())) {
                    // For network printer
                    Socket socket = null;
                    try {
                        socket = new Socket();
                        socket.connect(
                                new InetSocketAddress(config.getIp(), config.getPort()),
                                500  // 0.5 second timeout
                        );

                        // Create output stream directly from socket
                        escpos = new EscPos(socket.getOutputStream());
                        escpos.setCharsetName("GB18030");
                        escposPrintKitchenTemplate(escpos, orderRecord, config.getCategories());

                        // Ensure proper flushing
                        escpos.flush();
                    } finally {
                        if (socket != null) {
                            try {
                                socket.close();
                            } catch (IOException e) {
                                // Ignore close errors
                            }
                        }
                    }
                }
            } catch (IOException e) {
                System.err.println("Failed to print to printer " + config.getPrinterName() + ": " + e.getMessage());
            } finally {
                if (escpos != null) {
                    try {
                        escpos.close();
                    } catch (IOException e) {
                        // Ignore close errors
                    }
                }
            }
        }
    }

    public void printCustomerReceipt(OrderRecord orderRecord, int times) throws IOException {
        List<ThermalPrinterJsonConfig> configs = printerConfigs.stream()
                .filter(o -> "customer-receipt".equals(o.getUsage())).toList();
        EscPos escpos = null;
        for (var config : configs) {
            if ("LAN".equals(config.getConnectionType())) {
                TcpIpOutputStream steam = new TcpIpOutputStream(config.getIp(), config.getPort());
                escpos = new EscPos(steam);
                escpos.setCharsetName("GB18030");
                for (int i = 0; i < times; i++) {
                    escposCustomerReceiptTemplate(escpos, orderRecord);
                }
            }
            if ("ByName".equals(config.getConnectionType())) {
                PrintService printService = PrinterOutputStream.getPrintServiceByName(config.getPrinterName());
//                EscPos escpos;
                escpos = new EscPos(new PrinterOutputStream(printService));
                escpos.setCharsetName("GB18030");
                for (int i = 0; i < times; i++) {
                    escposCustomerReceiptTemplate(escpos, orderRecord);
                }
            }
        }
        if (escpos != null) {
            escpos.close();
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

        Style styleBoldSize3Center = new Style()
                .setFontSize(Style.FontSize._3, Style.FontSize._3)
                .setBold(true)
                .setJustification(EscPosConst.Justification.Center);
        Style styleSize2Center = new Style()
                .setFontSize(Style.FontSize._3, Style.FontSize._2)
                .setJustification(EscPosConst.Justification.Center);
        Style styleBoldSize3 = new Style().setFontSize(Style.FontSize._3, Style.FontSize._3).setBold(true);
        Style styleSize3 = new Style().setFontSize(Style.FontSize._3, Style.FontSize._3);
        Style styleSize2 = new Style().setFontSize(Style.FontSize._2, Style.FontSize._2);
        escpos.writeLF(styleSize2Center, orderRecord.getOrderNumber() + "号");
        escpos.feed(2);

        for (var item : orderItemsForPrintSet) {
            escpos.writeLF(styleSize2, item.getTitle());
            escpos.feed(1);
            double price = item.getPrice();
            if (item.getQuantity() > 1) {
                var quantity = item.getQuantity();
                var itemTotal = price * quantity;
                String text = "  " + price + "元x" + quantity + " [" + itemTotal + "元]";
                escpos.writeLF(styleSize2, text);
            } else {
                escpos.writeLF(styleSize2, "  " + price + "元");
            }
            escpos.feed(1);
            if (item.getSpiciness() != null && !item.getSpiciness().isEmpty())
                escpos.writeLF(styleSize2, "  辣度：" + item.getSpiciness());
            if (!item.getSeasoning().isEmpty())
                escpos.writeLF(styleSize2, "  调味：" + String.join(", ", item.getSeasoning()));
            if (!item.getIngredients().isEmpty())
                escpos.writeLF(styleSize2, "  食材：" + String.join(", ", item.getIngredients()));
            if (!item.getCustomRemark().isEmpty()) {
                escpos.writeLF(styleSize2, " 备注：" + item.getCustomRemark());
            }
            escpos.feed(1);
            escpos.writeLF(styleSize2, "----------");
        }
        escpos.feed(1);
        if (!orderRecord.getRemark().isEmpty()) {
            escpos.writeLF(styleSize2, "订单备注：" + orderRecord.getRemark());
        }
        escpos.feed(1);
        String formattedOrderedAt = orderRecord.getOrderedAt().format(DateTimeFormatter.ofPattern("yy-MM-dd HH:mm"));
        escpos.writeLF(styleSize2, formattedOrderedAt);
        escpos.feed(5);
//        escpos.writeLF(paymentStyle, "支付方式：" + orderRecord.getPaymentMethod());
//        escpos.feed(5);
        escpos.cut(EscPos.CutMode.FULL);
        escpos.flush();
    }

    private void escposCustomerReceiptTemplate(EscPos escpos, OrderRecord orderRecord) throws IOException {
        Style orderNumberStyle = new Style()
                .setFontSize(Style.FontSize._3, Style.FontSize._3)
                .setBold(true)
                .setJustification(EscPosConst.Justification.Center);
        Style styleBoldSize2 = new Style().setFontSize(Style.FontSize._2, Style.FontSize._2).setBold(true);
        Style styleSize2 = new Style().setFontSize(Style.FontSize._2, Style.FontSize._2);
        Style styleSize1 = new Style().setFontSize(Style.FontSize._1, Style.FontSize._1);
        escpos.writeLF(orderNumberStyle, orderRecord.getOrderNumber() + "号");
        escpos.feed(2);
        for (int i = 0; i < orderRecord.getOrderItems().size(); i++) {
            var item = orderRecord.getOrderItems().get(i);
            escpos.write(styleBoldSize2, (i + 1) + ". ");
            escpos.writeLF(styleBoldSize2, item.getTitle());
            if (item.getSpiciness() != null && !item.getSpiciness().isEmpty())
                escpos.writeLF(styleSize1, "  辣度：" + item.getSpiciness());
            if (!item.getSeasoning().isEmpty())
                escpos.writeLF(styleSize1, "  调味：" + String.join(", ", item.getSeasoning()));
            if (!item.getIngredients().isEmpty())
                escpos.writeLF(styleSize1, "  食材：" + String.join(", ", item.getIngredients()));
            if (!item.getCustomRemark().isEmpty()) {
                escpos.writeLF(styleBoldSize2, " 备注：" + item.getCustomRemark());
            }
            escpos.feed(1);
            var price = item.getPrice();
            if (item.getQuantity() > 1) {
                var quantity = item.getQuantity();
                double itemTotal = price * quantity;
                String text = "  " + price + "元x" + quantity + " [" + itemTotal + "元]";
                escpos.writeLF(styleSize2, text);
            } else {
                escpos.writeLF(styleSize2, "  " + price + "元");
            }
            escpos.feed(1);
        }
        escpos.writeLF(styleSize2, "合计：" + String.format("%.2f", orderRecord.getTotal()) + "元");
        escpos.writeLF(orderRecord.getOrderedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        escpos.feed(1);
        escpos.writeLF(styleSize1, "支付方式：" + orderRecord.getPaymentMethod());
        escpos.feed(5);
        escpos.cut(EscPos.CutMode.FULL);
    }
}
