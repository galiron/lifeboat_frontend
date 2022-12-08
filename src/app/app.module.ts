import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpeedControlComponent } from './speed-control/speed-control.component';
import { SteeringControlComponent } from './steering-control/steering-control.component';
import { MainWindowComponent } from './main-window/main-window.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'ws://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    SpeedControlComponent,
    SteeringControlComponent,
    MainWindowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxSliderModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
