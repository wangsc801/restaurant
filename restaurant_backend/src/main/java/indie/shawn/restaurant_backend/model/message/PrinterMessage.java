package indie.shawn.restaurant_backend.model.message;

import java.util.List;

public class PrinterMessage {
    private List<String> printers;
    private String message;

    public List<String> getPrinters() {
        return printers;
    }

    public void setPrinters(List<String> printers) {
        this.printers = printers;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
