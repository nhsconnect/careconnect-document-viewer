package uk.nhs.careconnect.ri.documentviewer;

import org.apache.camel.CamelContext;
import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.http4.HttpComponent;
import org.apache.camel.language.Constant;
import org.apache.camel.util.jsse.KeyManagersParameters;
import org.apache.camel.util.jsse.KeyStoreParameters;
import org.apache.camel.util.jsse.SSLContextParameters;
import org.apache.camel.util.jsse.TrustManagersParameters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class CamelMonitorRoute extends RouteBuilder {

	@Autowired
	protected Environment env;



	@Value("${fhir.resource.serverBase}")
	private String serverBase;

	@Value("${fhir.messaging.serverBase}")
	private String messagingBase;

	@Value("${oauth2.client_id}")
	private String oauth2client_id;

	@Value("${oauth2.client_secret}")
	private String oauth2client_secret;

	@Value("${oauth2.cookie_domain}")
	private String oauth2cookie_domain;

	@Value("${conf.logon}")
	private String logonUrl;

	@Override
    public void configure() 
    {

		restConfiguration()
				.component("servlet")
				.contextPath("api")
				.dataFormatProperty("prettyPrint", "true")
				.enableCORS(true);

		log.info("Starting Camel Route MAIN FHIR Server = " + serverBase);


		rest("/config")
				.get("/http").to("direct:hello");

		from("direct:hello")
				.routeId("helloTest")
				.setHeader("Content-Type", constant("application/json"))
				.transform().constant("{ \"fhirServer\": \""+serverBase+"\", "
				+"\"messagingServer\": \""+messagingBase+"\", "
				+"\"oauth2client_id\": \""+oauth2client_id+"\", "
				+"\"oauth2client_secret\": \""+oauth2client_secret+"\", "
				+"\"oauth2cookie_domain\": \""+oauth2cookie_domain+"\""
				+"\"logonUrl\": \""+logonUrl+"\", "
				+ " }");



	}
}
