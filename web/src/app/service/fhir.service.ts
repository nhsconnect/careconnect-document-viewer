import {EventEmitter, Injectable, Output} from '@angular/core';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Oauth2token} from '../model/oauth2token';

import {AuthService} from './auth.service';

import {Router} from '@angular/router';
import {PlatformLocation} from '@angular/common';
import {environment} from '../../environments/environment';
import {Oauth2Service} from './oauth2.service';
import {AppConfigService} from './app-config.service';

export enum Formats {
  JsonFormatted = 'jsonf',
  Json = 'json',
  Xml = 'xml',
  EprView = 'epr'
}

@Injectable()
export class FhirService {


  // TODO https://www.intertech.com/Blog/angular-4-tutorial-handling-refresh-token-with-new-httpinterceptor/
  //

  private baseUrl = undefined;

  private format: Formats = Formats.JsonFormatted;

  public path = '/Composition';

  public conformance: fhir.CapabilityStatement;

  conformanceChange: EventEmitter<any> = new EventEmitter();

  rootUrlChange: EventEmitter<any> = new EventEmitter();

  formatChange: EventEmitter<any> = new EventEmitter();


  constructor(  private http: HttpClient,
      private router: Router,
      private platformLocation: PlatformLocation,
      private appConfig: AppConfigService,
      private oauth2: Oauth2Service
  ) {}

  private rootUrl: string = undefined;

  public oauth2Required(): boolean {

    if (this.conformance !== undefined) {
      for (const rest of this.conformance.rest) {
        if (rest.security !== undefined && rest.security.service !== undefined) {
          for (const service of rest.security.service) {
            if (service.coding !== undefined && service.coding.length > 0) {
              if (service.coding[0].system === 'SMART-on-FHIR') {

                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }

  public getRootUrlChange() {
    return this.rootUrlChange;
  }

  public getConformanceChange() {
    return this.conformanceChange;
  }

  storeBaseUrl(baseUrl: string) {
    console.log('called storeBaseUrl');
    localStorage.setItem('baseUrl', baseUrl);
  }

  getStoredBaseUrl(): string {
    return localStorage.getItem('baseUrl');
  }

  public getBaseUrl(): string {

    if (this.getStoredBaseUrl() !== undefined && this.getStoredBaseUrl() !== null) {
      this.baseUrl = this.getStoredBaseUrl();
      console.log('Stored baseUrl = ' + this.baseUrl);
      return this.baseUrl;
    }
    let retStr = this.baseUrl;
    console.log('baseUrl = ' + retStr);
    // this should be resolved by app-config.ts but to stop start up errors

    if (retStr === undefined) {
      if (this.appConfig.getConfig() !== undefined) {
        retStr = this.appConfig.getConfig().fhirServer;
      } else {
        if (document.baseURI.includes('localhost')) {
          if (environment.oauth2.eprUrl !== undefined) {
            retStr = environment.oauth2.eprUrl;
          } else {
            retStr = 'http://127.0.0.1:8183/ccri-fhir/STU3';
          }
          this.baseUrl = retStr;
        }
        if (document.baseURI.includes('data.developer-test.nhs.uk')) {
          retStr = 'https://data.developer-test.nhs.uk/ccri-fhir/STU3';
          this.baseUrl = retStr;
        }
        if (document.baseURI.includes('data.developer.nhs.uk')) {
          retStr = 'https://data.developer.nhs.uk/ccri-fhir/STU3';
          this.baseUrl = retStr;
        }
      }
    }
    /*
    if (retStr !== undefined) {
      if (this.oauth2.isAuthenticated() || this.oauth2.isAuthenticating()) {

        if (retStr.includes('8183/ccri-fhir')) {
          retStr = 'https://data.developer-test.nhs.uk/ccri-smartonfhir/STU3';
          console.log('swapping to smartonfhir instance: ' + retStr);
          this.baseUrl = retStr;
        } else {
          if (retStr.includes('ccri-fhir')) {
            retStr = retStr.replace('ccri-fhir', 'ccri-smartonfhir');
            console.log('swapping to smartonfhir instance: ' + retStr);
            this.baseUrl = retStr;
          }
        }
      } else {

        if (retStr.includes('ccri-smartonfhir')) {
          retStr = retStr.replace('ccri-smartonfhir', 'ccri-fhir');
          console.log('swapping to unsec fhir instance: ' + retStr);
          this.baseUrl = retStr;

        }
      }
    }
    */
    this.storeBaseUrl(retStr);
    return retStr;
  }

  public setRootUrl(rootUrl: string) {
    console.log('called setRootUrl');
    this.storeBaseUrl(rootUrl);
    this.rootUrl = rootUrl;
    this.baseUrl = rootUrl;
    this.rootUrlChange.emit(rootUrl);
  }

  /*
  public getBaseUrl(): string {

    let eprUrl = 'FHIR_SERVER_URL';
    if (eprUrl.indexOf('FHIR_SERVER') !== -1 && this.appConfig.getConfig() !== undefined) {
      eprUrl = this.appConfig.getConfig().fhirServer;
    } else if (eprUrl.indexOf('FHIR_SERVER') !== -1) {
      eprUrl = environment.oauth2.eprUrl;
    }
      return eprUrl;
  }
*/
  public getConformance() {
//  console.log('called CapabilityStatement');
    this.http.get<any>(this.getBaseUrl() + '/metadata', { 'headers' : this.getHeaders(true)}).subscribe(capabilityStatement => {
      this.conformance = capabilityStatement;

      this.conformanceChange.emit(capabilityStatement);
    }, () => {
      this.conformance = undefined;
      this.conformanceChange.emit(undefined);
    });
  }

  public getMessagingUrl(): string {

    let eprUrl = 'FHIR_MESSAGING_URL';
    if (eprUrl.indexOf('FHIR_MESSAGING_URL') !== -1 && this.appConfig.getConfig() !== undefined) {
      eprUrl = this.appConfig.getConfig().messagingServer;
    } else if (eprUrl.indexOf('FHIR_MESSAGING_URL') !== -1) {
      eprUrl = environment.messagingUrl;
    }
      return eprUrl;
  }

  getCatClientSecret() {
    // This is a marker for entryPoint.sh to replace
    let secret = 'SMART_OAUTH2_CLIENT_SECRET';
    if (secret.indexOf('SECRET') !== -1 && this.appConfig.getConfig() !== undefined) {
      secret = this.appConfig.getConfig().oauth2client_secret;
    } else if (secret.indexOf('SECRET') !== -1 ) {
      secret = environment.oauth2.client_secret;
    }
    console.log('oauth2 client secret = ' + secret);
    return secret;
  }

  getCatClientId() {
    // This is a marker for entryPoint.sh to replace
    let secret = 'SMART_OAUTH2_CLIENT_ID';
    if (secret.indexOf('CLIENT_ID') !== -1 && this.appConfig.getConfig() !== undefined) {
      secret = this.appConfig.getConfig().oauth2client_id;
    } else if (secret.indexOf('CLIENT_ID') !== -1) {
      secret = environment.oauth2.client_id;
    }
    console.log('oauth2 client id = ' + secret);
    return secret;
  }



  getHeaders(contentType: boolean = true ): HttpHeaders {

    let headers = new HttpHeaders(
      );
    if (contentType) {
      headers = headers.append( 'Content-Type',  'application/fhir+json' );
      headers = headers.append('Accept', 'application/fhir+json');
    }
    return headers;
  }

  getEPRHeaders(contentType: boolean = true ): HttpHeaders {

    const headers = this.getHeaders(contentType);

    return headers;
  }

  getSearchCompositions(patientId: string): Observable<fhir.Bundle> {

    const url = this.getBaseUrl() + this.path + '?patient=' + patientId;

    return this.http.get<fhir.Bundle>(url, { 'headers' : this.getHeaders()});

  }


  getBinary(url: string): Observable<fhir.Binary> {

    // const url = this.getBaseUrl() + `/Binary/${id}`;

    return this.http.get<fhir.Binary>(url, { 'headers' : this.getEPRHeaders(true)});

  }
  getBinaryRaw(url: string): Observable<any> {

    // const url = this.getBaseUrl() + `/Binary/${id}`;

    return this.http.get(url, { 'headers' : this.getEPRHeaders(false) , responseType : 'blob' });

  }


  getCompositionDocumentHTML(url: string): Observable<any> {

    // const url = this.getBaseUrl() + `/Binary/${id}`;

    let headers = this.getEPRHeaders(false);
    headers = headers.append('Content-Type', 'text/html' );

    return this.http
      .get(url, {  headers , responseType : 'text' as 'text'});
  }

  getCompositionDocumentPDF(url: string): Observable<any> {

    // const url = this.getBaseUrl() + `/Binary/${id}`;

    let headers = this.getEPRHeaders(false);
    headers = headers.append(
       'Content-Type', 'application/pdf' );

    return this.http
      .get(url, { headers, responseType : 'blob' as 'blob'} );
  }

  public postAny(url: string, body: string, httpHeaders: HttpHeaders) {
    return this.http.post<any>(url, body, { headers : httpHeaders});
  }

  postBundle(document: any, contentType: string): Observable<fhir.Bundle> {

    const headers: HttpHeaders = this.getEPRHeaders(false);
    headers.append('Content-Type', contentType);
    headers.append('Prefer', 'return=representation');
    const url = this.getMessagingUrl() + '/Bundle';

    return this.http.post<fhir.Bundle>(url, document, { 'headers': headers});
  }


  putBundle(document: any, contentType: string): Observable<fhir.Bundle> {

    const headers: HttpHeaders = this.getEPRHeaders(false);
    headers.append('Content-Type', contentType);
    headers.append('Prefer', 'return=representation');

    // TODO Get real id from XML Bundle
    const url = this.getMessagingUrl() + '/Bundle';
    let params = new HttpParams();
    params = params.append('identifier', 'https://tools.ietf.org/html/rfc4122|1ff370b6-fc5b-40a1-9721-2a942e301f65');
    return this.http.put<fhir.Bundle>(url, document, { 'params': params, 'headers': headers});
  }




  getResource(reference: string ): Observable<fhir.Resource> {
    const url = this.getBaseUrl()  + '/' + reference;

    return this.http.get<fhir.Resource>(url, { 'headers' : this.getEPRHeaders()});
  }


  public get(search: string): Observable<fhir.Bundle> {

    const url: string = this.getBaseUrl() + search;
    let headers = new HttpHeaders(
    );

    if (this.format === 'xml') {
      headers = headers.append( 'Content-Type',  'application/fhir+xml' );
      headers = headers.append('Accept', 'application/fhir+xml');
      return this.http.get(url, { headers, responseType : 'blob' as 'blob'});
    } else {
      return this.http.get<any>(url, {'headers': headers});
    }
  }



  getEPRMedication(medicationId: string): Observable<fhir.Medication> {

    const url = this.getBaseUrl()  + `/Medication/${medicationId}`;

    return this.http.get<fhir.Medication>(url, { 'headers' : this.getEPRHeaders()});

  }





    getEPRObservationsByCode(patientId: number, code: string, date: string): Observable<fhir.Bundle> {

    let url = this.getBaseUrl()  + '/Observation?patient=' + patientId + '&code=' + code + '&_count=20';
    if (date !== undefined) {
      url = url + '&date=ge' + date;
    }

    return this.http.get<fhir.Bundle>(url, { 'headers' : this.getEPRHeaders()});

  }

  getEPRPatient(patientId: string): Observable<fhir.Patient> {

    const url = this.getBaseUrl()  + '/Patient/' + patientId;

    return this.http.get<fhir.Patient>(url, { 'headers' : this.getEPRHeaders()});

  }


  getValueSet(valueSet: string ): Observable<fhir.ValueSet> {
    const url = 'https://vonk.fire.ly/ValueSet/' + valueSet;
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/fhir+json');

    return this.http.get<fhir.ValueSet>(url, { 'headers' : headers });
  }




  /* GET patients whose name contains search term */
  searchPatients(term: string): Observable<fhir.Bundle> {
    let url =  this.getBaseUrl();
    if (!isNaN(parseInt(term))) {
      console.log('Number ' + term);
      url =  this.getBaseUrl();
      return this.http.get<fhir.Bundle>(url + `/Patient?identifier=${term}`, { 'headers' : this.getEPRHeaders() });
    } else {

        url = this.getBaseUrl();
        return this.http.get<fhir.Bundle>(url + `/Patient?name=${term}`, {'headers': this.getEPRHeaders()});

    }

  }

  searchOrganisations(term: string): Observable<fhir.Bundle> {
    let url =  this.getBaseUrl();

    url = this.getBaseUrl();
    return this.http.get<fhir.Bundle>(url + `/Organization?name=${term}`, {'headers': this.getEPRHeaders()});


  }

  searchPractitionerRoleByPractitioner(practitioner: string): Observable<fhir.Bundle> {
    let url =  this.getBaseUrl();

      url =  this.getBaseUrl();
      return this.http.get<fhir.Bundle>(url + `/PractitionerRole?practitioner=${practitioner}`, { 'headers' : this.getEPRHeaders() });

  }

  searchPractitioners(term: string): Observable<fhir.Bundle> {
    let url =  this.getBaseUrl();
    if (!isNaN(parseInt(term))) {
      console.log('Number ' + term);
      url =  this.getBaseUrl();
      return this.http.get<fhir.Bundle>(url + `/Practitioner?identifier=${term}`, { 'headers' : this.getEPRHeaders() });
    } else {

        url = this.getBaseUrl();
        return this.http.get<fhir.Bundle>(url + `/Practitioner?address-postalcode=${term}`, {'headers': this.getEPRHeaders()});

    }

  }

}
