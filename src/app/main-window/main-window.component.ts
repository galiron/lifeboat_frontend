import { AccessControlService } from './../services/access-control.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransferRequestComponent } from '../popups/transfer-request/transfer-request.component';

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.scss']
})
export class MainWindowComponent implements OnInit {
  private processing = false;
  constructor(private accessControlService: AccessControlService, public snackBar: MatSnackBar) {
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
    this.accessControlService.requestControlTransfer();
  }
}
