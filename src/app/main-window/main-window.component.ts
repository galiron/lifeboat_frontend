import { AccessControlService } from './../services/access-control.service';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnInit, QueryList, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransferRequestComponent } from '../popups/transfer-request/transfer-request.component';
import { IdentityService } from '../services/identity.service';
import { WebsocketConnectorService } from '../services/websocketConnector.service';
import { ConnectionState } from '../enums/connectionstate';
import { WebsocketAPIService } from '../services/websocket-api.service';
import { BehaviorSubject } from 'rxjs';
import SwiperCore, {   Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller, Keyboard, Swiper } from 'swiper';
import { ViewChildren } from '@angular/core';

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
  @HostListener('window:resize', ['$event'])
    onResize() {
      console.log(this.speedControlContainer)
      console.log(this.toolbar)
      console.log(this.mainWindow)
      this.adjustSwiperSlides()
  }
  swiperHeight = 225;
  swiperWidth = 300;
  streamsToFitIntoDisplay : number = 1;
  prevDate: number = 0;
  idleTimer = 0;
  connectionState = "init"
  connectionType = ConnectionState
  private processing = false;
  slides$ = new BehaviorSubject<string[]>(['']);
  constructor(private ngZone: NgZone, private changeDetectorRef: ChangeDetectorRef, private renderer: Renderer2, private accessControlService: AccessControlService, public snackBar: MatSnackBar, private identityService: IdentityService, private websocketConnectorService: WebsocketConnectorService, private websocketAPIService: WebsocketAPIService) {
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
    this.websocketConnectorService.wSVigilanceFeedResponse$.subscribe((wSVigilanceFeedResponse) => {
      console.log("vigilresponse: ", wSVigilanceFeedResponse)
      if (wSVigilanceFeedResponse.success === true) {
        this.idleTimer = 30;
      }
    });
    this.websocketConnectorService.wsControlAssignment$.subscribe((assignment) => {
      console.log("setTimer")
      if(assignment.success) {
        if(this.idleTimer === 0){
          this.setIdleTimer(30);
        }
      }
    })
  }

  adjustSwiperSlides(){
    if(this.speedControlContainer && this.steeringControlContainer) {
      const windowHeight = document.body.offsetHeight;
      const windowWidth = document.body.offsetWidth;
      console.log("window.height", windowHeight)
      console.log("window.innerWidth", windowWidth)
      const mainComponentHeight = windowHeight - this.toolbar.nativeElement.offsetHeight;
      console.log("main: ", mainComponentHeight)
      this.renderer.setStyle(this.mainWindow.nativeElement, "height", `${mainComponentHeight}px`);
      const formatWidth = windowWidth - (this.speedControlContainer.nativeElement as HTMLElement).offsetWidth - 32; // small width buffer to prevent buggy resizes
      const formatHeight = mainComponentHeight - (this.steeringControlContainer.nativeElement as HTMLElement).offsetHeight - 32; // -32 ~ 2rem (if default font size of 16)
      const formatFits = 1.78/(formatWidth/formatHeight) // 16:9 format divided by width to height ration to estimate how many 16:9 streams could comfortably fit into the screen
      this.streamsToFitIntoDisplay = Math.floor(formatFits);
      if( this.streamsToFitIntoDisplay == 0){
        this.streamsToFitIntoDisplay = 1;
      }
      console.log("fits: ", formatFits - this.streamsToFitIntoDisplay)
      if( formatFits - this.streamsToFitIntoDisplay < 0.2){ // prevent 
        this.streamsToFitIntoDisplay -=1;
      }
      this.swiperHeight = formatHeight/this.streamsToFitIntoDisplay
      this.swiperWidth = formatWidth
      this.swipers.forEach((swiper: any) => {
        console.log(swiper)
        //this.renderer.setStyle(swiper, "max-height", `${formatHeight/this.streamsToFitIntoDisplay}px`);
        //this.renderer.setStyle(swiper, "max-width", `${formatWidth/this.streamsToFitIntoDisplay}px`);
        
      })
      this.changeDetectorRef.detectChanges();
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
}
