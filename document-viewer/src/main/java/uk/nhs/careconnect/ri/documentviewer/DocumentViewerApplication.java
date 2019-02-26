package uk.nhs.careconnect.ri.documentviewer;

import org.apache.camel.CamelContext;
import org.apache.camel.component.servlet.CamelHttpTransportServlet;
import org.apache.camel.impl.DefaultCamelContextNameStrategy;
import org.apache.camel.spring.boot.CamelContextConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class DocumentViewerApplication {

    public static void main(String[] args) {

        System.setProperty("hawtio.authenticationEnabled", "false");
        System.setProperty("management.security.enabled","false");
        System.setProperty("management.contextPath","");

        SpringApplication.run(DocumentViewerApplication.class, args);
    }

      @Bean
    CamelContextConfiguration contextConfiguration() {
        return new CamelContextConfiguration() {

            @Override
            public void beforeApplicationStart(CamelContext camelContext) {

                camelContext.setNameStrategy(new DefaultCamelContextNameStrategy("CcriMonitor"));

            }

            @Override
            public void afterApplicationStart(CamelContext camelContext) {

            }
        };
    }
/*
    @Bean(name = "LogQuery", destroyMethod = "stop", initMethod = "start")
    @Scope("singleton")
    @Lazy(false)
    public Log4jLogQuery log4jLogQuery() {
        Log4jLogQuery log4jLogQuery = new Log4jLogQuery();
        return log4jLogQuery;
    }
*/
}
