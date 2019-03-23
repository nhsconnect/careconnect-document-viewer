import {FhirService} from '../../service/fhir.service';
import {CookieService} from 'ngx-cookie';
import {AuthService} from '../../service/auth.service';
import {Component, OnInit} from '@angular/core';
import {KeycloakService} from '../../service/keycloak.service';
import {AppConfigService} from '../../service/app-config.service';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    logonRedirect: string = undefined;

    constructor(
      private _cookieService: CookieService,
      private activatedRoute: ActivatedRoute,
      private fhirService: FhirService,
      private authService: AuthService,
      public keycloakService: KeycloakService,
      private appConfig: AppConfigService
    ) {
  }

  // https://symbiotics.co.za/integrating-keycloak-with-an-angular-4-web-application/


  ngOnInit() {
      this.logonRedirect = this.activatedRoute.snapshot.queryParams['afterAuth'];

      if (this.appConfig.getConfig() !== undefined) {
          this.keycloakInit();
      } else {
          this.appConfig.getInitEventEmitter().subscribe(() => {
                  this.keycloakInit();
              }
          );
      }
      /*
      This is the new version and should be reactivated once cc-logon is accessible

        let jwt: any;
      // jwt = this._cookieService.get('ccri-token');
      if (jwt === undefined) {
          window.location.href = this.authService.getLogonServer() + '/login?afterAuth=' + document.baseURI + 'login';
      } else {

          localStorage.setItem('ccri-jwt', this._cookieService.get('ccri-token'));
          console.log('logged in');

          this.authService.authoriseOAuth2();
      }
*/


  }

    keycloakInit() {
        this.keycloakService.init()
            .then(() => {

                this.onKeyCloakComplete();
            })
            .catch(e => console.log('rejected'));


    }

    onKeyCloakComplete() {
        // Check logged in or login
        this.keycloakService.getToken().then(() => {

                // Set up a redirect for completion of OAuth2 login
                // This should only be called if OAuth2 has not been performed


                /*
                          this.subscription = this.fhirService.getOAuthChangeEmitter()
                            .subscribe(item => {
                              console.log('The Call back ran');
                              this.router.navigate(['ping']);
                            });
                  */
                this.performLogins();

            }
        );
    }


    performLogins(): void {

        // console.log('Perform logins');

        // Set a call back for the CookieService
        this.keycloakService.getCookieEventEmitter()
            .subscribe(item => {
                    // console.log('Cookie event '+this.logonRedirect);
                    if (this.logonRedirect !== undefined) {
                        window.location.href = this.logonRedirect;
                    } else {
                        // Should always be a logon redirect  this.fhirService.authoriseOAuth2();
                    }
                }
            );

        this.keycloakService.setCookie();

    }





}
