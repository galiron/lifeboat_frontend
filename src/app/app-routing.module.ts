import { MainWindowComponent } from './main-window/main-window.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { AuthGuardService } from './authentication/auth-guard.service';

const routes: Routes = [
  { path: '', component: LandingpageComponent, pathMatch: 'full'},
  { path: 'control', canActivate: [AuthGuardService], component: MainWindowComponent}
//  { path: '', component: MainWindowComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
