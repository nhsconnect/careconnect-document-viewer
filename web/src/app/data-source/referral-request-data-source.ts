import {DataSource} from "@angular/cdk/table";
import {FhirService} from "../service/fhir.service";
import {BehaviorSubject, Observable} from "rxjs";

export class ReferralRequestDataSource extends DataSource<any> {
  constructor(public fhirService : FhirService,
              public patientId : string,
              public referralRequests : fhir.ReferralRequest[]
  ) {
    super();
  }

  private dataStore: {
    referralRequests: fhir.ReferralRequest[]
  };

  connect(): Observable<fhir.ReferralRequest[]> {

    console.log('referrals DataSource connect '+this.patientId);

    let _referralRequests : BehaviorSubject<fhir.ReferralRequest[]> =<BehaviorSubject<fhir.ReferralRequest[]>>new BehaviorSubject([]);

    this.dataStore = { referralRequests: [] };

    if (this.patientId != undefined) {
      this.fhirService.get('/ReferralRequest?patient='+this.patientId).subscribe((bundle => {
        if (bundle != undefined && bundle.entry != undefined) {
          for (let entry of bundle.entry) {
            console.log(entry.resource._resourceType);
            this.dataStore.referralRequests.push(<fhir.ReferralRequest> entry.resource);

          }
        }
        _referralRequests.next(Object.assign({}, this.dataStore).referralRequests);
      }));
    } else
    if (this.referralRequests != []) {
      for (let referralRequest of this.referralRequests) {
        this.dataStore.referralRequests.push(<fhir.ReferralRequest> referralRequest);
      }
      _referralRequests.next(Object.assign({}, this.dataStore).referralRequests);
    }
   return _referralRequests.asObservable();
  }

  disconnect() {}
}
