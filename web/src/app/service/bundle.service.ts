import { Injectable } from '@angular/core';
import {FhirService} from './fhir.service';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class BundleService {

  private bundle: fhir.Bundle;

  constructor(private fhirService: FhirService) { }

  public setBundle(bundle: fhir.Bundle) {
    //console.log(bundle);
    for (const entry of bundle.entry) {
      entry.resource.id = entry.fullUrl.replace('urn:uuid:','');
    }
    console.log(bundle);
    this.bundle = bundle;
  }

  public getBundle(): fhir.Bundle {
    return this.bundle;
  }

  public getRolesForPractitioner(reference: string): Observable<fhir.PractitionerRole[]> {


    const roles: fhir.PractitionerRole[]  = [];
    const _roles: BehaviorSubject<fhir.PractitionerRole[]> = <BehaviorSubject<fhir.PractitionerRole[]>>new BehaviorSubject([]);


    console.log('BundleService.getRolesForPractitioner Search ref='+reference);

    if (this.bundle !== undefined && reference.indexOf('/') === -1) {

      for (const entry of this.bundle.entry) {
        if (entry.resource.resourceType === 'PractitionerRole') {


          const role: fhir.PractitionerRole = <fhir.PractitionerRole> entry.resource;
          // console.log('Item Reference '+ role.practitioner.reference);
          if (role.practitioner !== undefined && role.practitioner.reference.indexOf(reference) !== -1) {
            //  console.log('Found - ' +entry.resource.resourceType);
            roles.push(<fhir.PractitionerRole> entry.resource);
          }
        }
      }
      _roles.next(roles);
      return _roles;
    } else {
      this.fhirService.searchPractitionerRoleByPractitioner(reference).subscribe(bundle => {
        for (const entry of bundle.entry) {
          console.log(entry.resource.id);
          const role: fhir.PractitionerRole = <fhir.PractitionerRole> entry.resource;
          roles.push(<fhir.PractitionerRole> entry.resource);
        }
        _roles.next(roles);
        return _roles;
      });
    }
  }

  public getResource(reference: string): Observable<fhir.Resource> {
    // console.log("Bundle Get Reference = " +reference);

    let resource: fhir.Resource;
    const _resource: BehaviorSubject<fhir.Resource> = <BehaviorSubject<fhir.Resource>>new BehaviorSubject([]);
    if (this.bundle !== undefined && reference.indexOf('/') === -1) {
      for (const entry of this.bundle.entry) {
        if (entry.fullUrl === reference || entry.resource.id === reference) {
          // console.log(entry.resource.resourceType);
          resource = entry.resource;
          _resource.next(resource);
        }
      }
    } else {
      return this.fhirService.getResource(reference);
    }
    return _resource;
  }
}
