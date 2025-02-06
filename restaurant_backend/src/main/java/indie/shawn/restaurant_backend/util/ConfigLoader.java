package indie.shawn.restaurant_backend.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import indie.shawn.restaurant_backend.model.printer.ThermalPrinterJsonConfig;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.FileCopyUtils;

import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

//@Component
public class ConfigLoader {
    private static final ObjectMapper objectMapper = new ObjectMapper();

//    @Override
//    public void run(String... args) throws Exception {
//        String content = new String(Files.readAllBytes(Paths.get("./printers.config.json")));
//        List<ThermalPrinterJsonConfig> configList = objectMapper.readValue(content,
//                objectMapper.getTypeFactory().constructCollectionType(List.class, ThermalPrinterJsonConfig.class));
//    }

    public static String loadConfig(String filename) throws IOException {
        return new String(Files.readAllBytes(Paths.get(filename)));

        // If external config doesn't exist, load from resources
//        var resource = new ClassPathResource(filename);
//        try (Reader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)) {
//            return FileCopyUtils.copyToString(reader);
//        }
    }

    public static List<ThermalPrinterJsonConfig> loadPrinterConfigs(String content) throws IOException {
        return objectMapper.readValue(content,
                objectMapper.getTypeFactory().constructCollectionType(List.class, ThermalPrinterJsonConfig.class));
    }
}
