import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-immunisation-detail',
  templateUrl: './immunisation-detail.component.html',
  styleUrls: ['./immunisation-detail.component.css']
})
export class ImmunisationDetailComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<ImmunisationDetailComponent>,

               @Inject(MAT_DIALOG_DATA) data) {
    this.immunisation = data.immunisation;
  }

    @Input()
    immunisation : fhir.Immunization;

  ngOnInit() {
  }

}
