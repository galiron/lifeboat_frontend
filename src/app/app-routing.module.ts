import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingpageComponent } from './components/landingpage/landingpage.component';
import { AuthGuardService } from './services/guardServices/auth-guard.service';
import { LoadingConfigPageComponent } from './components/preload/loading-config-page/loading-config-page.component';
import { ConfigAuthGuardService } from './services/guardServices/config-auth-guard.service';
import { LoadingpageComponent } from './components/preload/loadingpage/loadingpage.component';
import { MainWindowComponent } from './components/main-window/main-window.component';

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
