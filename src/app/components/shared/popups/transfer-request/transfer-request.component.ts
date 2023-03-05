import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';
import {Queue} from 'queue-typescript';
import {WSControlTransfer} from 'src/app/interfaces/wsInterfaces';
import {AccessControlService} from 'src/app/services/logicServices/access-control.service';

@Component({
  selector: 'app-transfer-request',
  templateUrl: './transfer-request.component.html',
  styleUrls: ['./transfer-request.component.scss']
})
export class TransferRequestComponent {
  requestName: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, private accessControlService: AccessControlService) {
    this.requestName = accessControlService.requesterInProgress!.username;
  }

  dismiss(): void {
    this.accessControlService.declineControl();
    this.data.preClose(true);
  }

  grantAccess(): void {
    this.accessControlService.transferControl();
    this.accessControlService.controlRequester = new Queue<WSControlTransfer>();
    this.data.preClose(true);
  }
}
