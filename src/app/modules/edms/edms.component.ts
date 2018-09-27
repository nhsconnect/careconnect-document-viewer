import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {EprService} from "../../service/epr.service";
import {User} from "../../model/user";
import { TdLayoutManageListComponent, TdMediaService, TdRotateAnimation} from "@covalent/core";
import {MatDialog} from "@angular/material";
import {KeycloakService} from "../../service/keycloak.service";

import {Router} from "@angular/router";

@Component({
  selector: 'app-edms',
  templateUrl: './edms.component.html',
  styleUrls: ['./edms.component.css'],
  animations: [
    TdRotateAnimation()
  ]
})
export class EdmsComponent implements AfterViewInit {


  @ViewChild('manageList') manageList: TdLayoutManageListComponent;

  public miniNav: boolean = true;

  constructor(
    public media: TdMediaService,
    public dialog: MatDialog,
    private _changeDetectorRef: ChangeDetectorRef,
    public authService: AuthService,

    public eprService : EprService,
    public keycloakService : KeycloakService,
    private router : Router
  ) {

  }

  routes = [ {
    title: 'Logout',
    route: '/logout',
    icon: 'exit_to_app',
  }
  ];

  btnRoutes = [{
    title: 'Select Patient',
    href: 'patient',
    icon: 'person',
  }, {
    title: 'Import Document',
    href: 'load',
    icon: 'note_add',
  }
  ];



  name="Clinical Document Viewer";


  patient : fhir.Patient;

  user: User;

  userName : string = undefined;
  email : string = undefined;

  subUser: any;

  subPatient : any;

  section = 'documents';

  ngOnInit() {



   // TODO Get UserDetails from Token console.log('token '+this.outh2Service.getUser());

    this.subUser = this.authService.getUserEventEmitter()
      .subscribe(item => {

        this.user = item;
        this.userName = this.user.userName;
        this.email = this.user.email;

      });
    this.subPatient = this.eprService.getPatientChangeEmitter()
      .subscribe( patient => {
        if (patient !== undefined) console.log('EDMS main patient change '+patient.id);
        this.patient = patient;


      });

    this.keycloakService.setCookie();
  }

  ngAfterViewInit(): void {
    // broadcast to all listener observables when loading the page
    this.media.broadcast();
    this._changeDetectorRef.detectChanges();
  }

  toggleMiniNav(): void {
    this.miniNav = !this.miniNav;
    setTimeout(() => {
      this.manageList.sidenav._animationStarted.emit()
    });
  }



  selectPatient(patient : fhir.Patient) {
    if (patient !=undefined) {
      this.eprService.set(patient);

    }
  }



  getLastName(patient :fhir.Patient) : String {
    if (patient == undefined) return "";
    if (patient.name == undefined || patient.name.length == 0)
      return "";

    let name = "";
    if (patient.name[0].family != undefined) name += patient.name[0].family.toUpperCase();
    return name;

  }
  getFirstName(patient :fhir.Patient) : String {
    if (patient == undefined) return "";
    if (patient.name == undefined || patient.name.length == 0)
      return "";
    // Move to address
    let name = "";
    if (patient.name[0].given != undefined && patient.name[0].given.length>0) name += ", "+ patient.name[0].given[0];

    if (patient.name[0].prefix != undefined && patient.name[0].prefix.length>0) name += " (" + patient.name[0].prefix[0] +")" ;
    return name;

  }

  getNHSIdentifier(patient : fhir.Patient) : String {
    if (patient == undefined) return "";
    if (patient.identifier == undefined || patient.identifier.length == 0)
      return "";
    // Move to address
    var NHSNumber :String = "";
    for (var f=0;f<patient.identifier.length;f++) {
      if (patient.identifier[f].system.includes("nhs-number") )
        NHSNumber = patient.identifier[f].value;
    }
    return NHSNumber;

  }

}
