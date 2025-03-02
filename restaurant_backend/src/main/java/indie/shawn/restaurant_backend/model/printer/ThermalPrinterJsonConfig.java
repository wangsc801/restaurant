package indie.shawn.restaurant_backend.model.printer;

import java.util.List;

public class ThermalPrinterJsonConfig {
    private String printerName;
    private int baudRate;
    private int dataBits;
    private int stopBits;
    private String usage;
    private int parity;
    private String connectionType;
    private String ip;
    private Integer port;
    private String charSet;
    private List<String> categories;
    private List<String> assignedStalls;

    public String getPrinterName() {
        return printerName;
    }

    public void setPrinterName(String printerName) {
        this.printerName = printerName;
    }

    public String getUsage() {
        return usage;
    }

    public void setUsage(String usage) {
        this.usage = usage;
    }

    public int getBaudRate() {
        return baudRate;
    }

    public void setBaudRate(int baudRate) {
        this.baudRate = baudRate;
    }

    public int getDataBits() {
        return dataBits;
    }

    public void setDataBits(int dataBits) {
        this.dataBits = dataBits;
    }

    public int getStopBits() {
        return stopBits;
    }

    public void setStopBits(int stopBits) {
        this.stopBits = stopBits;
    }

    public int getParity() {
        return parity;
    }

    public void setParity(int parity) {
        this.parity = parity;
    }

    public String getConnectionType() {
        return connectionType;
    }

    public void setConnectionType(String connectionType) {
        this.connectionType = connectionType;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }

    public String getCharSet() {
        return charSet;
    }

    public void setCharSet(String charSet) {
        this.charSet = charSet;
    }

    public List<String> getCategories() {
        return categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    public List<String> getAssignedStalls() {
        return assignedStalls;
    }

    public void setAssignedStalls(List<String> assignedStalls) {
        this.assignedStalls = assignedStalls;
    }

    @Override
    public String toString() {
        return "ThermalPrinterJsonConfig{" +
                "printerName='" + printerName + '\'' +
                ", baudRate=" + baudRate +
                ", dataBits=" + dataBits +
                ", stopBits=" + stopBits +
                ", usage='" + usage + '\'' +
                ", parity=" + parity +
                ", connectionType='" + connectionType + '\'' +
                ", ip='" + ip + '\'' +
                ", port=" + port +
                ", charSet='" + charSet + '\'' +
                ", categories=" + categories +
                ", assignedStalls=" + assignedStalls +
                '}';
    }
}
