package github.io.adrianovictorn.sistema_controle_de_acesso.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

@Configuration
@EnableWebMvc
public class WebConfiguration implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Encaminha (forward) para os arquivos estáticos que estão em src/main/resources/static
        registry.addViewController("/login")
                .setViewName("forward:/login.html");
        registry.addViewController("/dashboard")
                .setViewName("forward:/dashboard.html");
        registry.addViewController("/novo-atendimento")
                .setViewName("forward:/novo-atendimento.html");
        registry.addViewController("/atendimentos-abertos")
                .setViewName("forward:/atendimentos-abertos.html");
        registry.addViewController("/atendimentos-finalizados")
                .setViewName("forward:/atendimentos-finalizados.html");
        registry.setOrder(Ordered.HIGHEST_PRECEDENCE);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/reports/**")
                .addResourceLocations("classpath:/reports/");

        registry.addResourceHandler("/css/**")
                .addResourceLocations("classpath:/static/css/");
        
        registry.addResourceHandler("/js/**")
                .addResourceLocations("classpath:/static/js/");
        
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/");
                
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }

    @Bean
    public InternalResourceViewResolver internalResourceViewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        // Ao deixar prefixo e sufixo vazios, o resolver encaminha exatamente para a URL informada
        resolver.setPrefix("/");
        resolver.setSuffix("");
        resolver.setOrder(Ordered.LOWEST_PRECEDENCE);
        return resolver;
    }
}
