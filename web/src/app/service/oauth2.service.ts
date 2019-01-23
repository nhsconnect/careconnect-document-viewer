import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {AppConfigService} from './app-config.service';


@Injectable()
export class Oauth2Service {

  public scope: string;

  constructor(private appConfig: AppConfigService) {

  }

  public getToken(): string {
    const access_token = localStorage.getItem('access_token_' + this.getCatClientId());
    if (access_token === '' || access_token === null) {
      return undefined;
    }
    return access_token;
  }

  removeToken() {
    localStorage.removeItem('access_token_' + this.getCatClientId());
  }

  setToken(access_token: string) {
    localStorage.setItem('access_token_' + this.getCatClientId(), access_token);
  }

  setScope(scope: string) {
    this.scope = scope;
    localStorage.setItem('scope_' + this.getCatClientId(), scope);
  }

  public isAuthenticating(): boolean {
    // ccri-token indicates logging on not the jwt.
    const token = localStorage.getItem('ccri-token');

    if (token === undefined || token === null) {
      return false;
    }
    return true;
  }

  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    if (token === undefined) {
      return false;
    }
    const helper = new JwtHelperService();
    // return a boolean reflecting
    // whether or not the token is expired

    return helper.isTokenExpired(token);
  }



  public getUser(): string {
    const token = this.getToken();
    const helper = new JwtHelperService();
    console.log('Token ' + token);
    return helper.decodeToken(token);
  }

  getCatClientId() {
    // This is a marker for entryPoint.sh to replace
    const secret = 'SMART_OAUTH2_CLIENT_ID';
    if (secret.indexOf('CLIENT_ID') !== -1 && this.appConfig.getConfig() !== undefined) {
      return this.appConfig.getConfig().oauth2client_id;
    }
    return secret;
  }

}