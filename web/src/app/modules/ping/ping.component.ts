import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../service/auth.service';
import { Router} from '@angular/router';
import {FhirService} from '../../service/fhir.service';
import {AppConfigService} from "../../service/app-config.service";



@Component({
  selector: 'app-ping',
  templateUrl: './ping.component.html',
  styleUrls: ['./ping.component.css']
})
export class PingComponent implements OnInit {


  constructor(private authService: AuthService,
              private router: Router,
              private fhirService: FhirService,
              private appConfig: AppConfigService
    ) {
  }


  ngOnInit() {
    // Perform a resource access to check access token.

    if (this.appConfig.getConfig() !== undefined) {
      this.fhirService.getEPRPatient('1').subscribe( data => {
        this.router.navigate(['edms']);
      });
    } else {
      this.appConfig.getInitEventEmitter().subscribe( () => {
        this.fhirService.getEPRPatient('1').subscribe( data => {
          this.router.navigate(['edms']);
        });
          }
      );
    }
  }






}
