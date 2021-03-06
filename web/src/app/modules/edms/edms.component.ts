import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {EprService} from '../../service/epr.service';
import {User} from '../../model/user';
import { TdLayoutManageListComponent, TdMediaService} from '@covalent/core';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-edms',
  templateUrl: './edms.component.html',
  styleUrls: ['./edms.component.css']
})
export class EdmsComponent implements AfterViewInit, OnInit {


  @ViewChild('manageList', { static : true}) manageList: TdLayoutManageListComponent;

  public miniNav = true;

  constructor(
    public media: TdMediaService,
    public dialog: MatDialog,
    private _changeDetectorRef: ChangeDetectorRef,
    public eprService: EprService,
    private router: Router
  ) {

  }

  routes = [
  ];

  btnRoutes = [{
    title: 'Select Patient',
    href: '/patient',
    icon: 'person',
  }, {
    title: 'Import Document',
    href: '/load',
    icon: 'note_add',
  }
  ];



  name = 'Clinical Document Viewer';


  patient: fhir.Patient;

  user: User;

  userName: string = undefined;
  email: string = undefined;

  subUser: any;

  subPatient: any;

  section = 'documents';

  ngOnInit() {



   // TODO Get UserDetails from Token console.log('token '+this.outh2Service.getUser());


    this.subPatient = this.eprService.getPatientChangeEmitter()
      .subscribe( patient => {
        if (patient !== undefined) {
          console.log('EDMS main patient change ' + patient.id);
        }
        this.patient = patient;


      });

  }

  ngAfterViewInit(): void {
    // broadcast to all listener observables when loading the page
    this.media.broadcast();
    this._changeDetectorRef.detectChanges();
  }

  /*
  toggleMiniNav(): void {
    this.miniNav = !this.miniNav;
    setTimeout(() => {
      this.manageList.sidenav._animationStarted.emit()
    });
  }
  */



  selectPatient(patient: fhir.Patient) {
    if (patient !== undefined) {
      this.eprService.set(patient);

    }
  }



  getLastName(patient: fhir.Patient): String {
    if (patient === undefined) {
      return '';
    }
    if (patient.name === undefined || patient.name.length === 0) {
      return '';
    }

    let name = '';
    if (patient.name[0].family !== undefined) {
      name += patient.name[0].family.toUpperCase();
    }
    return name;

  }
  getFirstName(patient: fhir.Patient): String {
    if (patient === undefined) {
      return '';
    }
    if (patient.name === undefined || patient.name.length === 0) {
      return '';
    }
    // Move to address
    let name = '';
    if (patient.name[0].given !== undefined && patient.name[0].given.length > 0) {
      name += ', ' + patient.name[0].given[0];
    }
    if (patient.name[0].prefix !== undefined && patient.name[0].prefix.length > 0) {
      name += ' (' + patient.name[0].prefix[0] + ')' ;
    }
    return name;

  }

  getNHSIdentifier(patient: fhir.Patient): String {
    if (patient === undefined) {
      return '';
    }
    if (patient.identifier === undefined || patient.identifier.length === 0) {
      return '';
    }
    // Move to address
    let NHSNumber: String = '';
    for (let f = 0; f < patient.identifier.length; f++) {
      if (patient.identifier[f].system.includes('nhs-number') ) {
        NHSNumber = patient.identifier[f].value;
      }
    }
    return NHSNumber;

  }

}
