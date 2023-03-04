import { MainWindowComponent } from './main-window/main-window.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { AuthGuardService } from './authentication/auth-guard.service';
import { LoadingpageComponent } from './loadingpage/loadingpage.component';
import { LoadingConfigPageComponent } from './loading-config-page/loading-config-page.component';
import { ConfigAuthGuardService } from './config-auth-guard.service';

const routes: Routes = [
  { path: '', component: LoadingConfigPageComponent, pathMatch: 'full'},
  { path: 'loadingStreams', canActivate: [ConfigAuthGuardService], component: LoadingpageComponent},
  { path: 'landing', canActivate: [ConfigAuthGuardService], component: LandingpageComponent},
  { path: 'control', canActivate: [AuthGuardService], component: MainWindowComponent}
  // { path: '', component: MainWindowComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
