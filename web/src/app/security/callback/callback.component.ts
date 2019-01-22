import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {FhirService} from '../../service/fhir.service';
import {AppConfigService} from '../../service/app-config.service';
import {Oauth2Service} from '../../service/oauth2.service';


@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  private authCode: string ;

  subOAuth2: any;



  constructor(private activatedRoute: ActivatedRoute,
    private fhirService: FhirService,
    private auth: AuthService,
    private router: Router,
    private appConfig: AppConfigService) { }

  ngOnInit() {
    this.authCode = this.activatedRoute.snapshot.queryParams['code'];

    if (this.authCode !== undefined) {

      this.subOAuth2 = this.auth.getOAuthChangeEmitter()
          .subscribe(item => {
            console.log('Callback Access Token callback ran');
            this.router.navigateByUrl('edms').then( () => {
              // console.log('Navigate by Url');
            });
            // Potentially a loop but need to record the access token

          });
        this.appConfig.getInitEventEmitter().subscribe( () => {
              this.auth.performGetAccessToken(this.authCode);
            }
        );
        this.appConfig.loadConfig();
      // this.fhirService.performGetAccessToken(this.authCode);

    }
  }

}
