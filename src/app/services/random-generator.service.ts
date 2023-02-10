import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RandomGeneratorService {
  possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
  lengthOfCode = 40;
  constructor() { }

  makeRandom() : string{
    let text = "";
    for (let i = 0; i < this.lengthOfCode; i++) {
      text += this.possible.charAt(Math.floor(Math.random() * this.possible.length));
    }
      return text;
  }
}
