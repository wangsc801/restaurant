package indie.shawn.restaurant_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//@Configuration
//public class GlobalCorsConfig implements WebMvcConfigurer {
//    @Override
//    public void addCorsMappings(@NonNull CorsRegistry registry) {
//        String[] origins = {"http://localhost:5173",
//                "http://localhost:5174",
//                "http://localhost:5175",
//                "http://192.168.123.121:5678"};
//        registry.addMapping("/**") // Apply CORS to all endpoints
//                .allowedOrigins("*") // Allow specific origins
//                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allowed HTTP methods
//                .allowedHeaders("*") // Allow all headers
//                .maxAge(3600); // Max age for preflight requests
//    }
//}