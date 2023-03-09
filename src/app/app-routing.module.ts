import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingpageComponent} from './components/landingpage/landingpage.component';
import {AuthGuardService} from './services/guardServices/auth-guard.service';
import {ConfigLoadComponent} from './components/preload/config-loading/config-load.component';
import {ConfigGuardService} from './services/guardServices/config-guard.service';
import {LoadingpageComponent} from './components/preload/loadingpage/loadingpage.component';
import {MainWindowComponent} from './components/main-window/main-window.component';

const routes: Routes = [
  {path: '', component: ConfigLoadComponent, pathMatch: 'full'},
  {path: 'loadingStreams', canActivate: [ConfigGuardService], component: LoadingpageComponent},
  {path: 'landing', canActivate: [ConfigGuardService], component: LandingpageComponent},
  {path: 'control', canActivate: [AuthGuardService], component: MainWindowComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
