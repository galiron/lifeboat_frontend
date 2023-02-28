import { AccessControlService } from './../services/access-control.service';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, NgZone, OnInit, QueryList, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransferRequestComponent } from '../popups/transfer-request/transfer-request.component';
import { IdentityService } from '../services/identity.service';
import { WebsocketConnectorService } from '../services/websocketConnector.service';
import { ConnectionState } from '../enums/connectionstate';
import { WebsocketAPIService } from '../services/websocket-api.service';
import { BehaviorSubject } from 'rxjs';
import SwiperCore, {   Navigation,
  Pagination,
  Virtual, Keyboard, Swiper } from 'swiper';
import { ViewChildren } from '@angular/core';
import { WSControlAssignment, WSVigilanceFeedResponse } from '../interfaces/wsInterfaces';
import { CameraWebsocketService } from '../services/camera-websocket.service';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

// install Swiper modules
SwiperCore.use([Keyboard, Pagination, Navigation,Virtual]);


@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainWindowComponent implements OnInit, AfterViewInit {
  @HostListener('document:mousemove', ['$event']) 
  onMouseMove(e: any) {
    const date = new Date().getTime();
    if(date - this.prevDate > 1000){
      if(this.connectionState == this.connectionType.CONNECTED_WITH_CONTROL){
        this.websocketAPIService.feedVigilanceControl();
      }
      this.prevDate = date;
      console.log(this.slides$);
    }
  }
  @ViewChild('toolbar', {read: ElementRef, static:false}) toolbar!: ElementRef;
  @ViewChild('speedControlContainer', {read: ElementRef, static:false}) speedControlContainer!: ElementRef;
  @ViewChild('steeringControlContainer', {read: ElementRef, static:false}) steeringControlContainer!: ElementRef;
  @ViewChildren('swipers') swipers!: QueryList<ElementRef>;
  @ViewChild('mainWindow') mainWindow!: ElementRef;
  @HostBinding('style.grid-template-rows') rows: SafeStyle = '';
  @HostBinding('style.grid-template-columns') cols: SafeStyle = '';
  @HostListener('window:resize', ['$event'])
    onResize() {
      this.adjustSwiperSlides()
  }
  streams: Array<MediaStream> = [];
  swiperHeight = 225;
  swiperWidth = 300;
  streamsToFitIntoDisplay : number = 1;
  prevDate: number = 0;
  idleTimer = 0;
  connectionState = "init"
  connectionType = ConnectionState
  gridCols : number = 0;
  gridRows : number = 0;
  private processing = false;
  slides$ = new BehaviorSubject<string[]>(['']);
  constructor(private deviceService: DeviceDetectorService, private sanitizer: DomSanitizer, private changeDetectorRef: ChangeDetectorRef, private renderer: Renderer2, private accessControlService: AccessControlService, public snackBar: MatSnackBar, private identityService: IdentityService, private websocketConnectorService: WebsocketConnectorService, private websocketAPIService: WebsocketAPIService, private cameraWebsocketService: CameraWebsocketService, private router: Router) {
    const swiper = new Swiper('.swiper', {
      speed: 400,
      spaceBetween: 100,
    });
    this.accessControlService.claimControl();
    this.accessControlService.controlRequest$.subscribe( (data) => {
      if (this.processing === false) {
        this.processing = true;
        this.processRequester()
      }
    });
    this.websocketConnectorService.wsConnectionState$.subscribe((connectionState: string) => {
      this.connectionState = connectionState;
      console.log("state is: ",this.connectionState)
      if((connectionState === this.connectionType.DISCONNECTED) || (connectionState === this.connectionType.CONNECTED_WITHOUT_CONTROL)) {
        this.idleTimer = 0
      }
      console.log("state: ", connectionState)
    });
    this.websocketConnectorService.wSVigilanceFeedResponse$.subscribe((wSVigilanceFeedResponse: WSVigilanceFeedResponse) => {
      console.log("vigilresponse: ", wSVigilanceFeedResponse)
      if (wSVigilanceFeedResponse.success === true) {
        this.idleTimer = 30;
      }
    });
    this.websocketConnectorService.wsControlAssignment$.subscribe((assignment: WSControlAssignment) => {
      console.log("setTimer")
      if(assignment.success) {
        if(this.idleTimer === 0){
          this.setIdleTimer(30);
        }
      }
    })
    this.cameraWebsocketService.videos$.subscribe((stream: MediaStream) => {
      this.streams.push(stream);
    })
  }

  adjustSwiperSlides(){
    console.log("ADJUSTING!!!")
    if(this.speedControlContainer && this.steeringControlContainer) {
      if (this.deviceService.isMobile()) {
        this.gridCols = 1;
        console.log("grid size is now: ", this.gridRows);
        const windowHeight = document.body.offsetHeight;
        const windowWidth = document.body.offsetWidth;
        const mainComponentHeight = windowHeight - this.toolbar.nativeElement.offsetHeight;
        this.renderer.setStyle(this.mainWindow.nativeElement, "height", `${mainComponentHeight}px`);
        const formatWidth = windowWidth - (this.speedControlContainer.nativeElement as HTMLElement).offsetWidth - 32; // small width buffer to prevent buggy resizes
        const formatHeight = mainComponentHeight - (this.steeringControlContainer.nativeElement as HTMLElement).offsetHeight - 32; // -32 ~ 2rem (if default font size of 16)
        const formatFits = 1.78/(formatWidth/formatHeight) // 16:9 format divided by width to height ration to estimate how many 16:9 streams could comfortably fit into the screen
        this.streamsToFitIntoDisplay = Math.floor(formatFits);
        if( this.streamsToFitIntoDisplay == 0){
          this.streamsToFitIntoDisplay = 1;
        }
        console.log("fits: ", formatFits - this.streamsToFitIntoDisplay)
        if( formatFits - this.streamsToFitIntoDisplay < 0.2 && this.streamsToFitIntoDisplay != 1){ // prevent 
          this.streamsToFitIntoDisplay -=1;
        }
        this.gridRows = this.streams.length >= 4 ? 4 : this.streamsToFitIntoDisplay;
        this.swiperHeight = formatHeight/this.streamsToFitIntoDisplay
        this.swiperWidth = formatWidth
        this.swipers.forEach((swiper: any) => {
          console.log(swiper)
          //this.renderer.setStyle(swiper, "max-height", `${formatHeight/this.streamsToFitIntoDisplay}px`);
          //this.renderer.setStyle(swiper, "max-width", `${formatWidth/this.streamsToFitIntoDisplay}px`);
          
        })
      } else {
        this.gridCols =  Math.floor(Math.sqrt(9));
        this.gridRows = this.gridCols;
      }
      this.changeDetectorRef.detectChanges();
      this.rows = this.sanitizer.bypassSecurityTrustStyle('repeat('+ this.gridRows +', minmax('+ this.swiperHeight +'px,'+ this.swiperHeight + 0 +'px))');
      this.cols = this.sanitizer.bypassSecurityTrustStyle('repeat('+ this.gridCols +', minmax('+ this.swiperWidth +'px,'+ this.swiperWidth + 0 +'px))');
    }
  }



  ngAfterViewInit(): void {
    if (this.mainWindow){
      setTimeout(() => {
        this.adjustSwiperSlides();
      }, 0);
    }
  }

  setIdleTimer(seconds: number){
    this.idleTimer = seconds
    if(this.idleTimer > 0) {
      this.idleTimer--;
      setTimeout(() => {
        this.setIdleTimer(this.idleTimer);
      }, 1000);
    }
  }

  ngOnInit(): void {
    this.slides$.next(
      Array.from({ length: 20 }).map((el, index) => `Slide ${index + 1}`)
    );
  }

  processRequester() : void {
    this.accessControlService.popNextRequester();
    console.log("next requester is: ", JSON.stringify(this.accessControlService.requesterInProgress))
    if(this.accessControlService.requesterInProgress != undefined) {
      const snackBar = this.snackBar.openFromComponent(TransferRequestComponent, {
        data: {preClose: () => {
          snackBar.dismiss()
        } }
      })
      snackBar.afterDismissed().subscribe( () => {
        this.processRequester();
      });
    } else {
      this.processing = false;
    }
  }

  releaseControl() : void {
    this.accessControlService.releaseControl();
  }
  requestControl() : void {
    this.accessControlService.requestControlTransfer(this.identityService.name);
  }

  backToLogin() : void {
    this.accessControlService.releaseControl();
    this.router.navigateByUrl('/');
  }
}
