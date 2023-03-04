import { APP_INITIALIZER, NgModule } from '@angular/core';
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
import { SwiperModule } from 'swiper/angular';
import { StreamComponent } from './main-window/stream/stream.component';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from './services/config.service';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { LoadingpageComponent } from './loadingpage/loadingpage.component';
import { LoadingConfigPageComponent } from './loading-config-page/loading-config-page.component';

//const config: SocketIoConfig = { url: 'ws://localhost:3000', options: {} };
export const configFactory = (configService: ConfigService) => {
  return () => configService.loadConfig();
};

@NgModule({
  declarations: [
    AppComponent,
    SpeedControlComponent,
    SteeringControlComponent,
    MainWindowComponent,
    TransferRequestComponent,
    LandingpageComponent,
    StreamComponent,
    LoadingpageComponent,
    LoadingConfigPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxSliderModule,
    SocketIoModule, //.forRoot(config),
    BrowserAnimationsModule,
    MatButtonModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatSelectModule,
    SwiperModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: configFactory,
    deps: [ConfigService],
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
