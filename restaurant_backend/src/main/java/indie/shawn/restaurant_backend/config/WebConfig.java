package indie.shawn.restaurant_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${app.upload-path.menu-item}")
    private String uploadPathMenuItem;

    @Value("${app.uploaded-url-prefix.menu-item}")
    private String uploadedUrlPrefixMenuItem;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler(uploadedUrlPrefixMenuItem + "**")
                .addResourceLocations("file:" + uploadPathMenuItem);
        // registry.addResourceHandler("/uploaded/employee/**")
        //        .addResourceLocations("file:upload/image/employee/");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
//                .allowedOrigins("*","http://localhost:5678","http://localhost:5600","http://localhost:5677")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)   // 允许发送认证信息
                .maxAge(3600);           // 预检请求的有效期，单位为秒;
    }
}
