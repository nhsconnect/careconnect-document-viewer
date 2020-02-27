import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material";
import {ReferralRequestDataSource} from "../../data-source/referral-request-data-source";
import {BundleService} from "../../service/bundle.service";
import {FhirService} from "../../service/fhir.service";
import {OrganisationDialogComponent} from "../../dialog/organisation-dialog/organisation-dialog.component";
import {PractitionerDialogComponent} from "../../dialog/practitioner-dialog/practitioner-dialog.component";
import {ResourceDialogComponent} from "../../dialog/resource-dialog/resource-dialog.component";
import {LinksService} from "../../service/links.service";

@Component({
  selector: 'app-referral-request',
  templateUrl: './referral-request.component.html',
  styleUrls: ['./referral-request.component.css']
})
export class ReferralRequestComponent implements OnInit {

  @Input() referralRequests : fhir.ReferralRequest[];

  locations : fhir.Location[];

  @Input() showDetail : boolean = false;

  @Input() patient : fhir.Patient;

  @Output() referralRequest = new EventEmitter<any>();

  selectedReferralRequest : fhir.ReferralRequest;

  @Input() patientId : string;

  @Input() useBundle :boolean = false;

  dataSource : ReferralRequestDataSource;

  displayedColumns = ['status', 'intent', 'priority', 'type','typelink','requester','requesterLink','recipient','recipientLink', 'resource'];

  constructor(private linksService : LinksService,
              public bundleService : BundleService,
              public dialog: MatDialog,
              public fhirService : FhirService) { }

  ngOnInit() {
    if (this.patientId != undefined) {
      this.dataSource = new ReferralRequestDataSource(this.fhirService, this.patientId, []);
    } else {
      this.dataSource = new ReferralRequestDataSource(this.fhirService, undefined, this.referralRequests);
    }
  }
  getCodeSystem(system : string) : string {
    return this.linksService.getCodeSystem(system);
  }

  isSNOMED(system: string) : boolean {
    return this.linksService.isSNOMED(system);
  }


  getSNOMEDLink(code : fhir.Coding) {
    if (this.linksService.isSNOMED(code.system)) {
      window.open(this.linksService.getSNOMEDLink(code), "_blank");
    }
  }


  showRequestor(referralRequest : fhir.ReferralRequest) {

    if (referralRequest.requester != undefined) {
      this.bundleService.getResource(referralRequest.requester.agent.reference).subscribe((organisation) => {

        this.showResource(organisation);
      });
    }
  }

  showRecipient(referralRequest :fhir.ReferralRequest) {


    for (let practitionerReference of referralRequest.recipient) {
      this.bundleService.getResource(practitionerReference.reference).subscribe((practitioner) => {
            this.showResource(practitioner);
          }
      );
    }
  }

  showResource(resource : fhir.DomainResource) {
    let practitioners = [];
    let organisations = [];

    if (resource != undefined && resource.resourceType === "Practitioner") {
      practitioners.push(<fhir.Practitioner> resource);

      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      // dialogConfig.width="800px";
      dialogConfig.data = {
        id: 1,
        practitioners: practitioners,
        useBundle : this.useBundle
      };
      let resourceDialog: MatDialogRef<PractitionerDialogComponent> = this.dialog.open(PractitionerDialogComponent, dialogConfig);
    }

    if (resource != undefined && resource.resourceType === "Organization") {

      organisations.push(<fhir.Organization> resource);

      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      // dialogConfig.width="800px";
      dialogConfig.data = {
        id: 1,
        organisations: organisations
      };
      let resourceDialog: MatDialogRef<OrganisationDialogComponent> = this.dialog.open(OrganisationDialogComponent, dialogConfig);

    }
  }
  select(resource) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      resource: resource
    };
    let resourceDialog : MatDialogRef<ResourceDialogComponent> = this.dialog.open( ResourceDialogComponent, dialogConfig);
  }

}
