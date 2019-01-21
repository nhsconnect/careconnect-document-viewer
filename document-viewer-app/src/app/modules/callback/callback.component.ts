import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FhirService} from "../../service/fhir.service";
import {AuthService} from "../../service/auth.service";
import {AppConfigService} from "../../service/app-config.service";

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  private authCode :string ;

  subOAuth2 : any;

  subPermission : any;

  constructor(private activatedRoute: ActivatedRoute
    ,private  fhirService : FhirService
    ,private router: Router
    ,private appConfig: AppConfigService) { }

  ngOnInit() {
    this.authCode = this.activatedRoute.snapshot.queryParams['code'];

    if (this.authCode !==undefined) {

      this.subOAuth2 = this.fhirService.getOAuthChangeEmitter()
        .subscribe(item => {
          console.log('Callback Access Token callback ran');
          this.router.navigateByUrl('edms').then( ()=> {
            //console.log('Navigate by Url');
          });
          // Potentially a loop but need to record the access token

        });
      if (this.appConfig.getConfig() !== undefined) {
        this.fhirService.performGetAccessToken(this.authCode);
      } else {
        this.appConfig.getInitEventEmitter().subscribe( ()=> {
          this.fhirService.performGetAccessToken(this.authCode);
            }
        )
      }
      // this.fhirService.performGetAccessToken(this.authCode);
    }
  }



}
