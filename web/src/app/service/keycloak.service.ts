import {EventEmitter, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {CookieService} from 'ngx-cookie';
import {AppConfigService} from './app-config.service';

declare let Keycloak: any;

@Injectable()
export class KeycloakService {

  /*

  https://symbiotics.co.za/integrating-keycloak-with-an-angular-4-web-application/

   */

  constructor(

      private _cookieService: CookieService,
      public _appConfig: AppConfigService

  ) {

  }

  static auth: any = {};

  private cookieEvent: EventEmitter<any> = new EventEmitter();


  getClientSecret() {
    // This is a marker for entryPoint.sh to replace
    let secret = 'KEYCLOAK_CLIENT_SECRET';
    if (secret.indexOf('SECRET') !== -1 && this._appConfig.getConfig() !== undefined) {
      secret = this._appConfig.getConfig().keycloakclient_secret;
    } else if (secret.indexOf('SECRET') !== -1) {
      secret = environment.keycloak.client_secret;
    }
    return secret;
  }

  getKeycloakRootUrl() {
    let rootUrl = 'KEYCLOAK_ROOT_URL';
    if (rootUrl.indexOf('KEYCLOAK') !== -1 && this._appConfig.getConfig() !== undefined) {
      rootUrl = this._appConfig.getConfig().keycloakrooturl;
    } else if (rootUrl.indexOf('KEYCLOAK') !== -1) {
      rootUrl = environment.keycloak.RootUrl;
    }
    return rootUrl;
  }

  getKeycloakRealm() {
    let realm = 'KEYCLOAK_REALM';
    if (realm.indexOf('KEYCLOAK') !== -1 && this._appConfig.getConfig() !== undefined) {
      realm = this._appConfig.getConfig().keycloakrealm;
    } else if (realm.indexOf('KEYCLOAK') !== -1) {
      realm = environment.keycloak.realm;
    }
    return realm;
  }
  getKeycloakClientId() {
    let clienId = 'KEYCLOAK_CLIENT_ID';
    if (clienId.indexOf('KEYCLOAK') !== -1 && this._appConfig.getConfig() !== undefined) {
      clienId = this._appConfig.getConfig().keycloakclient_id;
    } else if (clienId.indexOf('KEYCLOAK') !== -1) {
      clienId = environment.keycloak.client_id;
    }
    return clienId;
  }

  getCookieDomain() {

    let cookieDomain = 'CAT_COOKIE_DOMAIN';
    if (cookieDomain.indexOf('CAT_') !== -1 && this._appConfig.getConfig() !== undefined) {
      cookieDomain = this._appConfig.getConfig().oauth2cookie_domain;
    } else  if (cookieDomain.indexOf('CAT_') !== -1) {
      cookieDomain = environment.keycloak.cookie_domain;
    }
      return cookieDomain;

  }



  public getUsername(): string {
    return KeycloakService.auth.authz.tokenParsed.preferred_username;
  }

  public getUserEmail(): string {
    return KeycloakService.auth.authz.tokenParsed.resource_access.toString();
  }

  getKeycloakServerUrl() {
    let rootUrl = 'KEYCLOAK_SERVER_URL';
    if (rootUrl.indexOf('KEYCLOAK') !== -1 && this._appConfig.getConfig()) {
      console.log(this._appConfig.getConfig());
      rootUrl = this._appConfig.getConfig().keycloakauthserverurl;
    } else if (rootUrl.indexOf('KEYCLOAK') !== -1) {
      rootUrl = environment.keycloak.authServerUrl;
    }
    return rootUrl;
  }

  public init(): Promise<any> {

    const keycloakAuth: any = Keycloak({
      url: this.getKeycloakRootUrl(),
      authServerUrl: this.getKeycloakServerUrl(),

      realm: this.getKeycloakRealm(),
      clientId: this.getKeycloakClientId(),

      credentials : {
        secret : this.getClientSecret(),
      },
      'ssl-required': 'external',
      'public-client': true
    });


    KeycloakService.auth.loggedIn = false;

    return new Promise((resolve, reject) => {
      keycloakAuth.init({onLoad: 'login-required'})
        .success(() => {

          KeycloakService.auth.loggedIn = true;
          KeycloakService.auth.authz = keycloakAuth;

          KeycloakService.auth.logoutUrl = keycloakAuth.authServerUrl
            + '/realms/fhir/protocol/openid-connect/logout?redirect_uri='
            + document.baseURI;
          resolve();
        })
        .error(() => {
          reject();
        });
    });
  }


  setKeycloakRootUrl(url: string) {
    environment.keycloak.RootUrl = url;
  }


  logout() {
    console.log('*** LOGOUT');
    KeycloakService.auth.loggedIn = false;
    KeycloakService.auth.authz = null;
  }






  getFullName(): string {
    return KeycloakService.auth.authz.tokenParsed.name;
  }

  getToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {

      /*
      if (KeycloakService.auth.authz === undefined) {
        console.log('Missing auth, attempting to retrieve from localStorage');
            KeycloakService.auth.authz = localStorage.getItem("keycloak.auth");
            console.log(localStorage.getItem("keycloak.auth"));
      }
      */

      if (KeycloakService.auth.authz.token) {
        KeycloakService.auth.authz
          .updateToken(5)
          .success(() => {
            resolve(<string>KeycloakService.auth.authz.token);
          })
          .error(() => {
            reject('Failed to refresh token');
          });
      } else {
        reject('Not logged in');
      }
    });
  }

  getCookie() {

    // This should also include a check for expired cookie, return undefined if it is.
    return this._cookieService.get('ccri-token');
  }

  getCookieEventEmitter () {
    return this.cookieEvent;
  }

  setCookie() {
    let jwt: any;
    if (this.getCookie() !== undefined) {
      jwt = this._cookieService.get('ccri-token');
    } else {
      if (KeycloakService.auth !== undefined && KeycloakService.auth.authz !== undefined) {
        jwt = KeycloakService.auth.authz.token;

        localStorage.setItem('ccri-jwt', jwt);

        this._cookieService.put('ccri-token', jwt, {
          domain: this.getCookieDomain(),
          path: '/',
          expires: new Date((new Date()).getTime() + 3 * 60000)
        });
      }
    }
    if (jwt !== undefined) {
      this.cookieEvent.emit(jwt);
    } else {
      console.log('jwt not recorded');
      // this.keycloakService.logout();
    }
  }


}
