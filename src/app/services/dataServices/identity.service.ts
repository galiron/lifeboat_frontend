import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {

  name!: string;
  password?: string;

  constructor() {
  }

}
