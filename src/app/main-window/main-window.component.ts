import { AccessControlService } from './../services/access-control.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransferRequestComponent } from '../popups/transfer-request/transfer-request.component';
import { IdentityService } from '../services/identity.service';

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.scss']
})
export class MainWindowComponent implements OnInit {
  prevDate: number = 0;
  @HostListener('document:mousemove', ['$event']) 
  onMouseMove(e: any) {
    const date = new Date().getTime();
    if(date - this.prevDate > 1000){
    // your code goes here
    this.prevDate = date;
    console.log(e);
    }
  }

  private processing = false;
  constructor(private accessControlService: AccessControlService, public snackBar: MatSnackBar, private identityService: IdentityService) {
    this.accessControlService.claimControl();
    this.accessControlService.controlRequest$.subscribe( (data) => {
      if (this.processing === false) {
        this.processing = true;
        this.processRequester()
      }
    });
  }

  ngOnInit(): void {
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
