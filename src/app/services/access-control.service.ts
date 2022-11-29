import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccessControlService {

  constructor(private http: HttpClient) { }

  jwt = '';
  possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
  lengthOfCode = 40;

  makeRandom(lengthOfCode: number, possible: string) {
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
      return text;
  }
  

  claimControl(){
    let secretKey = this.makeRandom(this.lengthOfCode, this.possible);
    return {
      "secretKey": secretKey
    }
    // this.http.post('http://localhost:3000/takeControl', postData).subscribe(res => {
    //   console.log(res);
    //   this.jwt = res.toString();
    // });
  }

  releaseControl() {
    return {
      "jwt": this.jwt
    }
    // this.http.post('http://localhost:3000/releaseControl', postData).subscribe(res => {
    //   console.log(res);
    // });
  }

  feedWatchdog() {
    return {
      "jwt": this.jwt
    }
  }
}
