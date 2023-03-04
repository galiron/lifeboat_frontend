import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-loading-config-page',
  templateUrl: './loading-config-page.component.html',
  styleUrls: ['./loading-config-page.component.scss']
})
export class LoadingConfigPageComponent {

  constructor(private configService: ConfigService, private router: Router) {
    configService.config$.subscribe( (configLoaded) => {
      if (configLoaded) {
        console.log("LOADED CONFIG: ", JSON.stringify(configService.config))
        this.router.navigateByUrl('/loadingStreams');
      }
    })
  }
}
