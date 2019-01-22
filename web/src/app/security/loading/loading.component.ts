import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AppConfigService} from '../../service/app-config.service';
import {FhirService} from '../../service/fhir.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  constructor(private appConfig: AppConfigService,
              private fhirService: FhirService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
      console.log('INIT');

      this.appConfig.getInitEventEmitter().subscribe( result => {
          console.log(this.appConfig.getConfig());
        if (this.appConfig.getConfig() !== undefined) {
            this.fhirService.setRootUrl(this.appConfig.getConfig().fhirServer);
            this.fhirService.setMessagingUrl(this.appConfig.getConfig().messagingServer);
            this.getConformanace();
        }
      });
      this.appConfig.loadConfig();

  }


  getConformanace() {

    this.fhirService.getConformanceChange().subscribe( result => {
        console.log(this.fhirService.conformance);
      if (this.fhirService.conformance !== undefined) {
          this.redirectToEDMS();
      }
    });
    this.fhirService.getConformance();

}

  redirectToEDMS() {
    this.router.navigate(['edms']);
  }
}
