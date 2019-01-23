import { Component, OnInit} from '@angular/core';
import {AppConfigService} from '../../service/app-config.service';
import {FhirService} from '../../service/fhir.service';
import {Router} from '@angular/router';
import {TdLoadingService} from "@covalent/core";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

    overlayStarSyntax = false;

    overlayDemo: any = {
        name: '',
        description: '',
    };
  constructor(private appConfig: AppConfigService,
              private fhirService: FhirService,
              private router: Router,
              private _loadingService: TdLoadingService) { }

  ngOnInit() {
      console.log('INIT');

      this._loadingService.register('overlayStarSyntax');

      this.appConfig.getInitEventEmitter().subscribe( result => {
         // console.log(this.appConfig.getConfig());
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

    toggleOverlayStarSyntax(): void {
        if (this.overlayStarSyntax) {
            this._loadingService.register('overlayStarSyntax');
        } else {
            this._loadingService.resolve('overlayStarSyntax');
        }
        this.overlayStarSyntax = !this.overlayStarSyntax;
    }
}
