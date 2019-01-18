import { Component, OnInit } from '@angular/core';

import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../service/auth.service";
import {KeycloakService} from "../../service/keycloak.service";
import {CookieService} from "ngx-cookie";
import {Oauth2Service} from "../../service/oauth2.service";
import {AppConfigService} from "../../service/app-config.service";
import {FhirService} from "../../service/fhir.service";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  logoutRedirect : string = "";

  constructor(
      private authService: AuthService,
      private fhirService: FhirService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private _cookieService: CookieService,
      private keycloak : KeycloakService,
      private oauth2 : Oauth2Service,
      private appConfig: AppConfigService
  ) { }

  ngOnInit(
  ) {
    this.logoutRedirect = this.activatedRoute.snapshot.queryParams['afterLogout'];

    // ensure config is loaded
    if (this.appConfig.getConfig() !== undefined) {
      this.logout();
    } else {
      this.appConfig.getInitEventEmitter().subscribe( ()=> {
        this.logout();
          }
      )
    }
  }

  logout(){
    if (this.logoutRedirect === undefined) {
      console.log(this.keycloak.getKeycloakServerUrl()+'/realms/'+ this.keycloak.getKeycloakRealm() +'/protocol/openid-connect/logout?redirect_uri='
          + document.baseURI);
      this.logoutRedirect = this.keycloak.getKeycloakServerUrl()+'/realms/'+ this.keycloak.getKeycloakRealm() +'/protocol/openid-connect/logout?redirect_uri='
          + document.baseURI;
    }
    this._cookieService.remove('ccri-token');
    this.oauth2.removeToken();
    this.keycloak.logout();
    this.authService.setLocalUser(undefined);
    if (this.logoutRedirect !== undefined) {
      window.location.href = this.logoutRedirect;
    }
  }

}
