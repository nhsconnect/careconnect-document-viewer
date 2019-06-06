import {EventEmitter, Injectable, Output} from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

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

  private messagingUrl = undefined;

  private format: Formats = Formats.JsonFormatted;

  public path = '/Composition';

  public conformance: fhir.CapabilityStatement;

  conformanceChange: EventEmitter<any> = new EventEmitter();

  rootUrlChange: EventEmitter<any> = new EventEmitter();

  formatChange: EventEmitter<any> = new EventEmitter();


  constructor(  private http: HttpClient,
      private router: Router,
      private platformLocation: PlatformLocation,
      private appConfig: AppConfigService
  ) {

    localStorage.removeItem('baseUrl');
    this.appConfig.getInitEventEmitter().subscribe( result => {
      console.log('FHIR Service config change detected');
      if (this.getBaseUrl() !== this.baseUrl) {
        this.conformance = undefined;
        this.getConformance();
      }
    });
  }

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
    localStorage.setItem('baseUrl', baseUrl);
    if (this.baseUrl !== baseUrl) {
      this.baseUrl = baseUrl;
      this.conformance = undefined;
      this.getConformance();
    }
  }

  getStoredBaseUrl(): string {
    return localStorage.getItem('baseUrl');
  }

  public getBaseUrl(): string {

    if (this.getStoredBaseUrl() !== undefined && this.getStoredBaseUrl() !== null) {
      this.baseUrl = this.getStoredBaseUrl();
      return this.baseUrl;
    }
    let retStr = this.baseUrl;

    // this should be resolved by app-config.ts but to stop start up errors

    if (retStr === undefined) {
      console.log(this.appConfig);
      if (this.appConfig.getConfig() !== undefined) {
        retStr = this.appConfig.getConfig().fhirServer;
        this.storeBaseUrl(retStr);
      }
    }
    return retStr;
  }

  public setRootUrl(rootUrl: string) {
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
    if (this.conformance !== undefined) {
      return this.conformance;
    }

    if (this.baseUrl !== undefined) {
      this.http.get<any>(this.getBaseUrl() + '/metadata', {'headers': this.getHeaders(true)}).subscribe(capabilityStatement => {
        this.conformance = capabilityStatement;

        this.conformanceChange.emit(capabilityStatement);
      }, () => {
        this.conformance = undefined;
        this.conformanceChange.emit(undefined);
      });
    }
  }

  public getMessagingUrl(): string {
    if (this.messagingUrl !== undefined) {
      return this.messagingUrl;
    }
    let eprUrl = 'FHIR_MESSAGING_URL';
    if (eprUrl.indexOf('FHIR_MESSAGING_URL') !== -1 && this.appConfig.getConfig() !== undefined) {
      eprUrl = this.appConfig.getConfig().messagingServer;
    } else if (eprUrl.indexOf('FHIR_MESSAGING_URL') !== -1) {
      eprUrl = environment.messagingUrl;
    }
      return eprUrl;
  }

  public setMessagingUrl(messagingUrl: string): string {
    this.messagingUrl = messagingUrl;
    return messagingUrl;
  }

  getCatClientSecret() {
    // This is a marker for entryPoint.sh to replace
    let secret = 'SMART_OAUTH2_CLIENT_SECRET';
    if (secret.indexOf('SECRET') !== -1 && this.appConfig.getConfig() !== undefined) {
      secret = this.appConfig.getConfig().oauth2client_secret;
    } else if (secret.indexOf('SECRET') !== -1 ) {
      secret = environment.oauth2.client_secret;
    }
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


  getBinary(id: string): Observable<fhir.Binary> {

    return this.http.get<fhir.Binary>(id, { 'headers' : this.getEPRHeaders(true)});

  }
  getBinaryRaw(id: string): Observable<any> {

    return this.http.get(id, { 'headers' : this.getEPRHeaders(false) , responseType : 'blob' });

  }


  getCompositionDocumentHTML(url: string): Observable<any> {

    let headers = this.getEPRHeaders(false);
    headers = headers.append('Accept', 'text/html' );

    return this.http
      .get(url, {  headers , responseType : 'text' as 'text'});
  }

  getCompositionDocumentPDF(url: string): Observable<any> {

    // const url = this.getBaseUrl() + `/Binary/${id}`;

    let headers = this.getEPRHeaders(false);
    headers = headers.append(
       'Accept', 'application/pdf' );

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
      url =  this.getBaseUrl();
      return this.http.get<fhir.Bundle>(url + '/Patient?identifier=https://fhir.nhs.uk/Id/nhs-number%7C' + term,
          { 'headers' : this.getEPRHeaders() });
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
      url =  this.getBaseUrl();
      return this.http.get<fhir.Bundle>(url + `/Practitioner?identifier=${term}`, { 'headers' : this.getEPRHeaders() });
    } else {

        url = this.getBaseUrl();
        return this.http.get<fhir.Bundle>(url + `/Practitioner?address-postalcode=${term}`, {'headers': this.getEPRHeaders()});

    }

  }

}
