import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {environment} from "../../environments/environment";

@Injectable()
export class Oauth2Service {

  public scope : string;

  constructor(
  ) {

  }

  public getToken(): string {
    const access_token = localStorage.getItem('access_token_' + environment.oauth2.client_id);
    if (access_token === "" || access_token === null) return undefined;
    return access_token;
  }

  removeToken() {
    localStorage.removeItem('access_token_' + environment.oauth2.client_id);
  }

  setToken(access_token : string) {
    localStorage.setItem('access_token_' + environment.oauth2.client_id, access_token);
  }

  setScope(scope : string) {
    this.scope = scope;
    localStorage.setItem('scope_' + environment.oauth2.client_id, scope);
  }

  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    const helper = new JwtHelperService();
    // return a boolean reflecting
    // whether or not the token is expired

    return helper.isTokenExpired(token);
  }

  public getUser() : string {
    const token = this.getToken();
    const helper = new JwtHelperService();
    console.log('Token '+token);
    let retStr = helper.decodeToken(token)
    return retStr;
  }

}
