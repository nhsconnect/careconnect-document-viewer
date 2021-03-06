import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {EprService} from '../../../service/epr.service';
import {FhirService} from '../../../service/fhir.service';
import {IAlertConfig, TdDialogService} from '@covalent/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-binary',
  templateUrl: './binary.component.html',
  styleUrls: ['./binary.component.css']
})
export class BinaryComponent implements OnInit {

  private bundle: fhir.Bundle;
  private document: fhir.DocumentReference;

  public docType: string;

  public binaryId: string;

  private documentReferenceId: string;


  constructor(public patientEprService: EprService,
              private fhirService: FhirService,
              private _dialogService: TdDialogService,
              private _viewContainerRef: ViewContainerRef,
              private route: ActivatedRoute) { }

  ngOnInit() {

     this.documentReferenceId = this.route.snapshot.paramMap.get('docid');

     if (this.documentReferenceId !== undefined) {
         this.fhirService.getResource('DocumentReference/?_id=' + this.documentReferenceId).subscribe(resource => {
             this.bundle = <fhir.Bundle> resource;
             this.document = <fhir.DocumentReference> this.bundle.entry[0].resource

             this.processDocument();

             if ((this.patientEprService.patient === undefined) || (this.document.subject !== undefined
                 && ('Patient/' + this.patientEprService.patient.id) !== this.document.subject.reference)) {
                 this.fhirService.getResource(this.document.subject.reference).subscribe( patient => {
                     this.patientEprService.set(<fhir.Patient> patient);
                 });
             }
         },
             () => {
                 const alertConfig: IAlertConfig = { message : 'Unable to locate document.'};
                 alertConfig.disableClose =  false; // defaults to false
                 alertConfig.viewContainerRef = this._viewContainerRef;
                 alertConfig.title = 'Alert'; // OPTIONAL, hides if not provided
                 alertConfig.closeButton = 'Close'; // OPTIONAL, defaults to 'CLOSE'
                 alertConfig.width = '400px'; // OPTIONAL, defaults to 400px
                 this._dialogService.openAlert(alertConfig);
             });
     }

  }

  processDocument() {
      // TODO KGM Need to move to actual URL
      // const array: string[] = this.document.content[0].attachment.url.split('/');
      // KGM 21 Jan 2019 Use given url rather than using binary Id
      console.log("this.document", this.document);
      this.binaryId = this.document.content[0].attachment.url;

      if (this.binaryId !== undefined) {
          if (this.document.content[0].attachment.contentType === 'application/fhir+xml') {
              this.docType = 'fhir';
          } else if (this.document.content[0].attachment.contentType === 'application/pdf') {
              this.docType = 'pdf';
          } else if (this.document.content[0].attachment.contentType.indexOf('image') !== -1) {
              this.docType = 'img';
          }
      }

      // console.log('DocumentRef Id = ' + this.binaryId);
  }
}
