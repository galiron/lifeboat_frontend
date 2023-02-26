import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private identityService: IdentityService, private router: Router) { 

  }

  setNameAndContinue() : void {
    this.identityService.name = this.formName.nativeElement.value;
    this.identityService.password = this.formPassword.nativeElement.value;
    this.router.navigateByUrl('/control');
  }
}
