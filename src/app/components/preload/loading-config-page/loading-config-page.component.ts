import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {ConfigService} from '../../../services/dataServices/config.service';

@Component({
  selector: 'app-loading-config-page',
  templateUrl: './loading-config-page.component.html',
  styleUrls: ['./loading-config-page.component.scss']
})
export class LoadingConfigPageComponent {

  constructor(private configService: ConfigService, private router: Router) {
    configService.config$.subscribe((configLoaded) => {
      if (configLoaded) {
        this.router.navigateByUrl('/loadingStreams');
      }
    })
  }
}
