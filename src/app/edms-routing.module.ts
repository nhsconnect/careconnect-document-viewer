import {RouterModule, Routes} from "@angular/router";
import {LoadDocumentComponent} from "./modules/document-load/load-document.component";
import {NgModule} from "@angular/core";
import {AuthGuard} from "./service/auth-guard";
import {EdmsComponent} from "./modules/edms/edms.component";
import {EdmsRecordComponent} from "./modules/edms-record/edms-record.component";
import {BinaryComponent} from "./component/binary/binary/binary.component";
import {PatientFindComponent} from "./modules/patient-find/patient-find.component";


const edmsRoutes: Routes = [
    {
        path: 'edms', canActivate: [AuthGuard], component: EdmsComponent,
        children: [
            {
                path: '',
                component: LoadDocumentComponent
            },
            {
                path: 'load',
                component: LoadDocumentComponent
            },
            {
                path: 'binary/:docid',
                component: BinaryComponent
            },
            {
                path: 'documents',
                component: EdmsRecordComponent
            },
            {
                path: 'patient',
                component: PatientFindComponent,
            }]
    },
];
@NgModule({
    imports: [
        RouterModule.forChild(edmsRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class EdmsRoutingModule {
}
