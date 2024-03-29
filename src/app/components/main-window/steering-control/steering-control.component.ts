import {ChangeContext, LabelType, Options} from '@angular-slider/ngx-slider';
import {Component, OnInit} from '@angular/core';
import {ControlService} from 'src/app/services/websocketServices/control.service';

@Component({
  selector: 'app-steering-control',
  templateUrl: './steering-control.component.html',
  styleUrls: ['./steering-control.component.scss']
})
export class SteeringControlComponent implements OnInit {

  value: number = 0;
  options: Options = {
    floor: -100,
    ceil: 100,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        default:
          return value + "%";
      }
    }
  };

  constructor(private controlService: ControlService) {
  }

  ngOnInit(): void {
  }

  setSteering(changeContext: ChangeContext): void {
    this.controlService.sendSteering(changeContext);
  }

}
