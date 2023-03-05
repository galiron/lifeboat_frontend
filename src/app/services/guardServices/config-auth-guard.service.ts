import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {ConfigService} from '../dataServices/config.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigAuthGuardService {
  constructor(private configService: ConfigService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.configService.config$.getValue()) {
      return true;
    } else {
      const tree: UrlTree = this.router.createUrlTree([]);
      return tree;
    }
  }

}
