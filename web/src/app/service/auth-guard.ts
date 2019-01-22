import {CanActivate, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {Injectable} from '@angular/core';
import {Oauth2Service} from './oauth2.service';
import {FhirService} from './fhir.service';


@Injectable()
export class AuthGuard  implements CanActivate {


  constructor(public authService: AuthService,
              public router: Router,
              private fhirService: FhirService,
              private oauth2: Oauth2Service) {

  }
  canActivate() {

    // If not SMART on FHIR or OAuth2 then quit
    if (this.oauth2.isAuthenticated()) {
      return true;
    }
    if (!this.fhirService.oauth2Required()) {
      // console.log('no auth required');
      return true;
    }

    if (this.authService.getCookie() !== undefined) {
      // no need to process keycloak, cookie present
      return true;
    }
    if (this.authService.getAccessToken() !== undefined) {
      return true;
    }

    console.log('Unable to activate route' );
    this.router.navigate(['login']);
    return false;
  }

}
