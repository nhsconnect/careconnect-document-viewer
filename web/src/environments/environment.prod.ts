export const environment = {
  production: true,
  messagingUrl : 'https://data.developer.nhs.uk/ccri/camel/ccri-messaging/STU3',
  oauth2 : {
    eprUrl : 'https://data.developer.nhs.uk/ccri-fhir/STU3',
    client_id : 'clinical-assurance-tool',
    client_secret : 'AM3ai-PGoZZRW-7osWbzvGlDBHjHq7M2aBlpNttreHeEyB5jequWy8fsHMVQP4JV0Kd0Fzrtu0iNEqGqguq69Qs',
    cookie_domain : 'data.developer.nhs.uk',
    logonUrl: 'http://localhost:4200/ccri-logon'
  },
  keycloak: {
    RootUrl: 'https://enterprisearchitecture.digital.nhs.uk/auth',
    authServerUrl: 'https://enterprisearchitecture.digital.nhs.uk/auth',
    realm : 'ReferenceImplementations',
    client_secret : '709c79a1-7710-452f-859c-fb6edfb86027',
    client_id : 'ccri-cat',
    cookie_domain : 'data.developer.nhs.uk'
  }
};
