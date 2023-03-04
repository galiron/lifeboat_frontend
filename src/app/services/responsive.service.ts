import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {

  private isMobile = new Subject();
  private isSmallScreen = new Subject();
  private isDesktop = new Subject();
  public screenWidth!: string;


  constructor() {
    this.checkWidth();
  }

  onMobileChange(status: boolean) {
    this.isMobile.next(status);
  }

  onSmallScreenChange(status: boolean) {
    this.isSmallScreen.next(status);
  }

  onDesktopChange(status: boolean) {
    this.isDesktop.next(status);
  }

  getMobileStatus(): Observable<any> {
    return this.isMobile.asObservable();
  }

  getSmallScreenStatus(): Observable<any> {
    return this.isSmallScreen.asObservable();
  }

  getDesktopStatus(): Observable<any> {
    return this.isDesktop.asObservable();
  }

  public checkWidth() {
    const width = window.innerWidth;
    if (width <= 414) {
    this.screenWidth = 'xs';
    this.onMobileChange(true);
    this.onSmallScreenChange(true);
    this.onDesktopChange(false);
    } else if (width <= 768) {
    this.screenWidth = 'sm';
    this.onMobileChange(true);
    this.onSmallScreenChange(false);
    this.onDesktopChange(false);
    } else if (width > 768 && width <= 992) {
    this.screenWidth = 'md';
    this.onMobileChange(false);
    this.onSmallScreenChange(false);
    this.onDesktopChange(false);
    } else {
    this.screenWidth = 'lg';
    this.onMobileChange(false);
    this.onSmallScreenChange(false);
    this.onDesktopChange(true);
    }
  }
}
