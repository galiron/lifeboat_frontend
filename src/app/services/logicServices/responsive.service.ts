import {Injectable} from '@angular/core';
import {Subject, Observable, defer, fromEvent, startWith} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {

  constructor() {
  }

  observeMediaQuery(mediaQuery: string): Observable<MediaQueryListEvent> {
    return defer(() => {
      const mediaQueryList: MediaQueryList = matchMedia(mediaQuery);
      return fromEvent<MediaQueryListEvent>(mediaQueryList, 'change').pipe<MediaQueryListEvent>(startWith<any>(mediaQueryList));
    });
  }
}
