import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private appConfig;

  constructor(private http: HttpClient) { }

    private initEvent: EventEmitter<any> = new EventEmitter();

  public getInitEventEmitter () {
        return this.initEvent;
  }
  loadConfig() {

      // console.log('calling config endpoint: ' + document.baseURI + 'camel/config/http');
      this.http.get<any>(document.baseURI + 'camel/config/http').subscribe(result => {
            // console.log('app config fhirServer retrieved.');
            // console.log(result);
            this.appConfig = result;
            this.initEvent.emit(result);
          },
          error => {
            console.log(error);
            console.log('No configuration endpoint detected');
            const result = {
                fhirServer: environment.oauth2.eprUrl,
                messagingServer: environment.messagingUrl
            };
            this.appConfig = result;
            this.initEvent.emit(result);
          });

  }

  getConfig() {
    return this.appConfig;
  }
}
