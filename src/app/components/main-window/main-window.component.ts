import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {ConnectionState} from 'src/app/enums/connectionstate';
import {WSControlAssignment, WSVigilanceFeedResponse} from 'src/app/interfaces/wsInterfaces';
import {IdentityService} from 'src/app/services/dataServices/identity.service';
import {AccessControlService} from 'src/app/services/logicServices/access-control.service';
import {ResponsiveService} from 'src/app/services/logicServices/responsive.service';
import {CameraRequestService} from 'src/app/services/websocketServices/camera-request.service';
import {CameraWebsocketService} from 'src/app/services/websocketServices/camera-websocket.service';
import {BackendAPIService} from 'src/app/services/websocketServices/backend-api.service';
import {BackendConnectorService} from 'src/app/services/websocketServices/backend-connector.service';
import {TransferRequestComponent} from '../shared/popups/transfer-request/transfer-request.component';


@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  host: {
    class: 'maxSize'
  },
  styleUrls: ['./main-window.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainWindowComponent implements AfterViewInit {
  @ViewChild('toolbar', {read: ElementRef, static: false}) toolbar!: ElementRef;
  @ViewChild('steeringControlContainer', {read: ElementRef, static: false}) steeringControlContainer!: ElementRef;
  @ViewChild('speedControlContainer', {read: ElementRef, static: false}) speedControlContainer!: ElementRef;
  @ViewChild('grid', {read: ElementRef, static: false}) grid!: ElementRef;
  @ViewChild('mainWindow') mainWindow!: ElementRef;
  @HostBinding('style.grid-template-rows') rows: SafeStyle = '';
  @HostBinding('style.grid-template-columns') cols: SafeStyle = '';
  gridSize: number[] = [1, 2, 3];
  gridSizeValue: number = 2;
  streams: Array<MediaStream> = [];
  cellWidth!: number;
  cellHeight!: number;
  streamsToFitIntoDisplay: number = 1;
  prevDate: number = 0;
  idleTimer = 0;
  connectionState = "init";
  connectionType = ConnectionState;
  gridCols: number = 0;
  gridRows: number = 0;
  isMobile: boolean = true;
  cameraWebSocketConnected: boolean = false;
  loggedIn: boolean = false;
  private processing = false;

  constructor(private sanitizer: DomSanitizer, private cameraService: CameraRequestService, private responsiveService: ResponsiveService, private changeDetectorRef: ChangeDetectorRef, private accessControlService: AccessControlService, public snackBar: MatSnackBar, private identityService: IdentityService, private websocketConnectorService: BackendConnectorService, private websocketAPIService: BackendAPIService, private cameraWebsocketService: CameraWebsocketService, private router: Router) {
    this.accessControlService.claimControl();
    this.accessControlService.controlRequest$.subscribe((data) => {
      if (this.processing === false) {
        this.processing = true;
        this.processRequester();
      }
    });
    this.websocketConnectorService.wsConnectionState$.subscribe((connectionState: string) => {
      this.connectionState = connectionState;

      if ((connectionState === this.connectionType.DISCONNECTED) || (connectionState === this.connectionType.CONNECTED_WITHOUT_CONTROL)) {
        this.idleTimer = 0;
      }

    });
    this.websocketConnectorService.wSVigilanceFeedResponse$.subscribe((wSVigilanceFeedResponse: WSVigilanceFeedResponse) => {

      if (wSVigilanceFeedResponse.success === true) {
        this.idleTimer = 30;
      }
    });
    this.websocketConnectorService.wsControlAssignment$.subscribe((assignment: WSControlAssignment) => {

      if (assignment.success) {
        if (this.idleTimer === 0) {
          this.setIdleTimer(30);
          this.loggedIn = true;
        }
      }

    });
    this.cameraWebsocketService.videos$.subscribe((stream: MediaStream) => {
      this.streams.push(stream);
    });
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
    this.responsiveService.checkWidth();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: any) {
    const date = new Date().getTime();
    if (date - this.prevDate > 1000) {
      if (this.connectionState == this.connectionType.CONNECTED_WITH_CONTROL) {
        this.websocketAPIService.feedVigilanceControl();
      }
      this.prevDate = date;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkDeviceSize();
    this.adjustSwiperSlides();
  }

  changeGridSize(event: any) {
    setTimeout(() => {
      this.adjustSwiperSlides();
    }, 5);
  }

  checkDeviceSize() {
    this.responsiveService.checkWidth();
  }

  adjustSwiperSlides() {

    if (this.speedControlContainer && this.steeringControlContainer) {
      if (this.isMobile) {
        this.gridCols = 1;
        this.gridRows = 4;
      } else {
        this.gridCols = this.gridSizeValue;
        this.gridRows = this.gridSizeValue;
      }
      const windowHeight = document.body.offsetHeight;
      const windowWidth = document.body.offsetWidth;
      const mainComponentHeight = windowHeight - this.toolbar.nativeElement.offsetHeight;
      const formatWidth = windowWidth - (this.speedControlContainer.nativeElement as HTMLElement).offsetWidth;
      const formatHeight = mainComponentHeight - (this.steeringControlContainer.nativeElement as HTMLElement).offsetHeight - 32; // -32 ~ 2rem for top margin (if default font size of 16)
      this.cellWidth = ((formatWidth) / this.gridCols) - (this.gridCols - 1) * 16;
      this.cellHeight = ((formatHeight) / this.gridRows) - (this.gridRows - 1) * 16;
      this.rows = this.sanitizer.bypassSecurityTrustStyle('repeat(' + this.gridRows + ', minmax(' + this.cellHeight + 'px, auto))');
      this.cols = this.sanitizer.bypassSecurityTrustStyle('repeat(' + this.gridCols + ', minmax(' + this.cellWidth + 'px, auto))');
    }
    this.changeDetectorRef.detectChanges();
  }


  ngAfterViewInit(): void {
    if (this.mainWindow) {
      this.adjustSwiperSlides();
    }
  }

  setIdleTimer(seconds: number) {
    this.idleTimer = seconds;
    if (this.idleTimer > 0) {
      this.idleTimer--;
      setTimeout(() => {
        this.setIdleTimer(this.idleTimer);
      }, 1000);
    }
  }

  processRequester(): void {
    const couldPopRequester = this.accessControlService.popNextRequester();
    if (couldPopRequester == true) {
      const snackBar = this.snackBar.openFromComponent(TransferRequestComponent, {
        data: {
          preClose: () => {
            snackBar.dismiss();
          }
        }
      });
      snackBar.afterDismissed().subscribe(() => {
        this.processRequester();
      });
    } else {
      this.processing = false;
    }
  }

  releaseControl(): void {
    this.accessControlService.releaseControl();
  }

  requestControl(): void {
    this.accessControlService.requestControlTransfer(this.identityService.name);
  }

  backToLogin(): void {
    this.accessControlService.releaseControl();
    this.router.navigateByUrl('/');
  }
}
