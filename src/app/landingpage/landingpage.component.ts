import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent {
  @ViewChild('formName')
  formName!: ElementRef;
  name!: string;

  constructor(private cd: ChangeDetectorRef){

  }

  ngAfterViewInit(){
    this.formName.nativeElement.value = 'whale!';
    this.name = this.formName.nativeElement.value;
    this.cd.detectChanges();
  }
}
