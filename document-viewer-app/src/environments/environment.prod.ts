export const environment = {
  production: true,
  keycloak: {
    RootUrl: 'KEYCLOAK_AUTH_URL',
    authServerUrl: 'KEYCLOAK_SERVER_URL',
    realm : 'ReferenceImplementations',
    client_secret : 'KEYCLOAK_CLIENT_SECRET',
    client_id : 'ccri-cat'
  },
  login : '',
  messagingUrl : 'http://127.0.0.1:8182/ccri-messaging/STU3',
  oauth2 : {
    eprUrl : 'FHIR_SERVER_URL',
    client_id : 'clinical-assurance-tool',
    client_secret : 'SMART_OAUTH2_CLIENT_SECRET',
    cookie_domain: 'CAT_COOKIE_DOMAIN'
  },
  keycloakRootUrl: 'http://localhost:8080/auth'
};
