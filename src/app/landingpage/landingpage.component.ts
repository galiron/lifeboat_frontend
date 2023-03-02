import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CameraWebsocketService } from '../services/camera-websocket.service';
import { IdentityService } from '../services/identity.service';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent {
  @ViewChild('formName')
  formName!: ElementRef;
  @ViewChild('formPassword')
  formPassword!: ElementRef;
  name!: string;
  cameraWebSocketConnected : boolean = false;

  constructor(private identityService: IdentityService, private router: Router) { 
/*     this.cameraWebsocketService.isReady$.subscribe( (ready: boolean) => {
      if (ready) {
        this.cameraWebSocketConnected = ready
      }
    }); */
  }

  setNameAndContinue() : void {
    this.identityService.name = this.formName.nativeElement.value;
    this.identityService.password = this.formPassword.nativeElement.value;
    this.router.navigateByUrl('/control');
  }
}
