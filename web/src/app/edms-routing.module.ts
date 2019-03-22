import {RouterModule, Routes} from '@angular/router';
import {LoadDocumentComponent} from './modules/document-load/load-document.component';
import {NgModule} from '@angular/core';
import {AuthGuard} from './service/auth-guard';
import {EdmsComponent} from './modules/edms/edms.component';
import {EdmsRecordComponent} from './modules/edms-record/edms-record.component';
import {BinaryComponent} from './component/binary/binary/binary.component';
import {PatientFindComponent} from './modules/patient-find/patient-find.component';


const edmsRoutes: Routes = [
    {
        path: 'edms', canActivate: [AuthGuard], component: EdmsComponent,
        children: [
            {
                path: '',
                canActivate: [AuthGuard],
                component: LoadDocumentComponent
            },
            {
                path: 'load',
                canActivate: [AuthGuard],
                component: LoadDocumentComponent
            },
            {
                path: 'binary/:docid',
                canActivate: [AuthGuard],
                component: BinaryComponent
            },
            {
                path: 'documents',
                canActivate: [AuthGuard],
                component: EdmsRecordComponent
            },
            {
                path: 'patient',
                canActivate: [AuthGuard],
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
