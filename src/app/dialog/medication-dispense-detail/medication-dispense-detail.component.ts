import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-medication-dispense-detail',
  templateUrl: './medication-dispense-detail.component.html',
  styleUrls: ['./medication-dispense-detail.component.css']
})
export class MedicationDispenseDetailComponent implements OnInit {

    constructor( public dialogRef: MatDialogRef<MedicationDispenseDetailComponent>,

                 @Inject(MAT_DIALOG_DATA) data) {
        this.medicationDispense = data.medicationDispense;
    }

    @Input()
    medicationDispense : fhir.MedicationDispense;

  ngOnInit() {
  }

}
