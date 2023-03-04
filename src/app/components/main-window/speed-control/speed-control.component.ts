import { ChangeContext, LabelType, Options } from '@angular-slider/ngx-slider';
import { Component, OnInit } from '@angular/core';
import { ControlService } from 'src/app/services/websocketServices/control.service';

@Component({
  selector: 'app-speed-control',
  templateUrl: './speed-control.component.html',
  styleUrls: ['./speed-control.component.scss']
})
export class SpeedControlComponent implements OnInit {

  value: number = 0;
  options: Options = {
    floor: -100,
    ceil: 100,
    vertical: true,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        default:
          return value + "%";
      }
    }
  };

  constructor(private controlService: ControlService) { }

  ngOnInit(): void {
  }

  setThrottle(changeContext: ChangeContext): void {
    this.controlService.sendThrottle(changeContext);
  }
}
