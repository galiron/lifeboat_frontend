import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityService } from '../../services/dataServices/identity.service';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements AfterViewInit{
  @ViewChild('formName')
  formName!: ElementRef;
  @ViewChild('formPassword')
  formPassword!: ElementRef;
  name!: string;
  cameraWebSocketConnected : boolean = false;

  constructor(private identityService: IdentityService, private router: Router, private changeDetectorRef: ChangeDetectorRef)  {

   }
  ngAfterViewInit(): void {
    if(this.identityService.password) {
      this.formName.nativeElement.value = this.identityService.name;
      this.changeDetectorRef.detectChanges();
    }
  }

  setNameAndContinue() : void {
    this.identityService.name = this.formName.nativeElement.value;
    this.identityService.password = this.formPassword.nativeElement.value;
    this.router.navigateByUrl('/control');
  }
}
