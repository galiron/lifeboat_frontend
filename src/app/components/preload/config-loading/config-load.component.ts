import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {ConfigService} from '../../../services/dataServices/config.service';

@Component({
  selector: 'app-config-loading',
  templateUrl: './config-load.component.html',
  styleUrls: ['./config-load.component.scss']
})
export class ConfigLoadComponent {

  constructor(private configService: ConfigService, private router: Router) {
    configService.config$.subscribe((configLoaded) => {
      if (configLoaded) {
        this.router.navigateByUrl('/loadingStreams');
      }
    });
  }
}
