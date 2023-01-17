import { AccessControlService } from './../services/access-control.service';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, NgZone, OnInit, QueryList, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
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
  Controller, Keyboard } from 'swiper';
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
      if(this.speedControlContainer && this.steeringControlContainer){
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const mainComponentHeight = windowHeight - this.toolbar.nativeElement.offsetHeight;
        this.renderer.setStyle(this.mainWindow.nativeElement, "height", `${mainComponentHeight}px`);
        const formatWidth = windowWidth - (this.speedControlContainer.nativeElement as HTMLElement).offsetWidth;
        const formatHeight = mainComponentHeight - (this.steeringControlContainer.nativeElement as HTMLElement).offsetHeight;
        const formatFits = 1.78/(formatWidth/formatHeight) // 16:9 format divided by width to height ration to estimate how many 16:9 streams could comfortably fit into the screen
        console.log("can fit: ", formatFits) 
        this.streamsToFitIntoDisplay = Math.floor(formatFits);
        console.log("swipers: ", this.swipers)
        this.swiperHeight = formatHeight/this.streamsToFitIntoDisplay
        this.swiperWidth = formatWidth/this.streamsToFitIntoDisplay
        this.swipers.forEach((swiper: any) => {
          console.log(swiper)
          //this.renderer.setStyle(swiper, "max-height", `${formatHeight/this.streamsToFitIntoDisplay}px`);
          //this.renderer.setStyle(swiper, "max-width", `${formatWidth/this.streamsToFitIntoDisplay}px`);
          
        })
      }

  }
  swiperHeight = 225;
  swiperWidth = 300;
  streamsToFitIntoDisplay : number = 1;
  prevDate: number = 0;
  idleTimer = 30;
  connectionState = "init"
  connectionType = ConnectionState
  private processing = false;
  slides$ = new BehaviorSubject<string[]>(['']);
  constructor(private ngZone: NgZone, private renderer: Renderer2, private accessControlService: AccessControlService, public snackBar: MatSnackBar, private identityService: IdentityService, private websocketConnectorService: WebsocketConnectorService, private websocketAPIService: WebsocketAPIService) {
    this.accessControlService.claimControl();
    this.accessControlService.controlRequest$.subscribe( (data) => {
      if (this.processing === false) {
        this.processing = true;
        this.processRequester()
      }
    });
    this.websocketConnectorService.wsConnectionState$.subscribe((connectionState: string) => {
      this.connectionState = connectionState;
      console.log("state: ", connectionState)
    });
    this.websocketConnectorService.wSVigilanceFeedResponse$.subscribe((wSVigilanceFeedResponse) => {
      console.log("vigresponse: ", wSVigilanceFeedResponse.success)
      if (wSVigilanceFeedResponse.success === true) {
        this.idleTimer = 30;
      }
    });
    this.websocketConnectorService.wsControlAssignment$.subscribe((assignment) => {
      console.log("setTimer")
      if(assignment.success) {
        this.setIdleTimer(30);
      }
    })
  }

  ngAfterViewInit(): void {
    if (this.mainWindow){
      const height = window.innerHeight - this.toolbar.nativeElement.offsetHeight;
      this.renderer.setStyle(this.mainWindow.nativeElement, "height", `${height}px`)
    }
  }

  setIdleTimer(seconds: number){
    this.idleTimer = seconds
    if(this.idleTimer > 0){
      this.idleTimer--;
      setTimeout(() => {
        this.setIdleTimer(this.idleTimer);
      }, 1000);
    } else {
    }
  }

  ngOnInit(): void {
    this.slides$.next(
      Array.from({ length: 20 }).map((el, index) => `Slide ${index + 1}`)
    );
  }

  processRequester(){
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

  releaseControl() {
    this.accessControlService.releaseControl();
  }
  requestControl() {
    this.accessControlService.requestControlTransfer(this.identityService.name);
  }
}
