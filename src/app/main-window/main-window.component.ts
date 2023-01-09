import { AccessControlService } from './../services/access-control.service';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransferRequestComponent } from '../popups/transfer-request/transfer-request.component';
import { IdentityService } from '../services/identity.service';
import { WebsocketConnectorService } from '../services/websocketConnector.service';
import { ConnectionState } from '../enums/connectionstate';
import { WebsocketAPIService } from '../services/websocket-api.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.scss']
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
      console.log(e);
    }
  }
  @ViewChild('toolbar', {read: ElementRef, static:false}) toolbar!: ElementRef;
  @ViewChild('mainWindow') mainWindow!: ElementRef;
  @HostListener('window:resize', ['$event'])
    onResize() {
      const height = window.innerHeight - this.toolbar.nativeElement.offsetHeight;
      console.log(height)
      this.renderer.setStyle(this.mainWindow.nativeElement, "height", `${height}px`)
      console.log(this.toolbar.nativeElement.offsetHeight)
  }
  prevDate: number = 0;
  idleTimer = 30;
  connectionState = "init"
  connectionType = ConnectionState
  private processing = false;
  slidesEx = ['first', 'second'];
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

 
  // onSlideChange(swiper: any) {
  //   if (swiper.isEnd) {
  //     // all swiper events are run outside of ngzone, so use ngzone.run or detectChanges to update the view.
  //     this.ngZone.run(() => {
  //       this.slidesEx = [...this.slidesEx, `added ${this.slidesEx.length - 1}`];
  //     });
  //     console.log(this.slidesEx);
  //   }
  // }

  ngAfterViewInit(): void {
    const height = window.innerHeight - this.toolbar.nativeElement.offsetHeight;
    this.renderer.setStyle(this.mainWindow.nativeElement, "height", `${height}px`)
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
    // this.slides$.next(
    //   Array.from({ length: 600 }).map((el, index) => `Slide ${index + 1}`)
    // );
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
