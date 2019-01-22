import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AppConfigService} from '../service/app-config.service';
import {FhirService} from '../service/fhir.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  constructor(private appConfig: AppConfigService,
              private fhirService: FhirService,
              private router: Router) { }

  ngOnInit() {

    if (this.appConfig.getConfig() === undefined) {
      this.appConfig.getInitEventEmitter().subscribe( result => {
        this.getConformanace();
      });
    } else {
      this.getConformanace();
    }
  }


  getConformanace() {
     if (this.fhirService.conformance === undefined) {
        this.fhirService.getConformanceChange().subscribe( result => {
          this.redirectToEDMS();
        });
        this.fhirService.getConformance();
     } else {
       this.redirectToEDMS();
     }
  }

  redirectToEDMS() {
    console.log('Navigate to edms');
    this.router.navigate(['edms']);
  }
}
