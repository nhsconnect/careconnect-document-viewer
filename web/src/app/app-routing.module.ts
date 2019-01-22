import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './service/auth-guard';
import {LogoutComponent} from './security/logout/logout.component';
import {PingComponent} from './security/ping/ping.component';
import {LoginComponent} from './security/login/login.component';
import {CallbackComponent} from './security/callback/callback.component';
import {EdmsComponent} from './modules/edms/edms.component';
import {LoadingComponent} from './loading/loading.component';



const routes: Routes = [
  { path: '', component: LoadingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'ping', canActivate: [AuthGuard], component: PingComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'callback', component: CallbackComponent }

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [
    RouterModule
  ]
})



export class AppRoutingModule {



}
