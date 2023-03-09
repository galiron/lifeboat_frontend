import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SocketIoModule} from 'ngx-socket-io';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TransferRequestComponent} from './components/shared/popups/transfer-request/transfer-request.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import {LandingpageComponent} from './components/landingpage/landingpage.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatToolbarModule} from '@angular/material/toolbar';
import {SwiperModule} from 'swiper/angular';
import {HttpClientModule} from '@angular/common/http';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {ConfigLoadComponent} from './components/preload/config-loading/config-load.component';
import {ConfigService} from './services/dataServices/config.service';
import {LoadingpageComponent} from './components/preload/loadingpage/loadingpage.component';
import {NgxSliderModule} from '@angular-slider/ngx-slider';
import {MainWindowComponent} from './components/main-window/main-window.component';
import {SpeedControlComponent} from './components/main-window/speed-control/speed-control.component';
import {SteeringControlComponent} from './components/main-window/steering-control/steering-control.component';
import {StreamComponent} from './components/main-window/stream/stream.component';

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
    ConfigLoadComponent
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
export class AppModule {
}
