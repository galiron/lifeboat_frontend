import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpeedControlComponent } from './speed-control/speed-control.component';
import { SteeringControlComponent } from './steering-control/steering-control.component';
import { MainWindowComponent } from './main-window/main-window.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TransferRequestComponent } from './popups/transfer-request/transfer-request.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatToolbarModule } from '@angular/material/toolbar';

const config: SocketIoConfig = { url: 'ws://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    SpeedControlComponent,
    SteeringControlComponent,
    MainWindowComponent,
    TransferRequestComponent,
    LandingpageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxSliderModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    MatButtonModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
