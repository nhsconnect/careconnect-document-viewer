// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  login : '',
  messagingUrl : 'https://data.developer-test.nhs.uk/ccri-fhir/STU3',
  oauth2 : {
    eprUrl : 'https://data.developer-test.nhs.uk/ccri-fhir/STU3',
    client_id : 'clinical-assurance-tool',
    client_secret : 'AM3ai-PGoZZRW-7osWbzvGlDBHjHq7M2aBlpNttreHeEyB5jequWy8fsHMVQP4JV0Kd0Fzrtu0iNEqGqguq69Qs',
    cookie_domain : 'localhost',
    logonUrl: 'http://localhost:4200/ccri-logon'
  }
};
