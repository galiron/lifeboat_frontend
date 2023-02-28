import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  config: any;

      constructor(private http: HttpClient) {}

      loadConfig() {
        this.http.get('./assets/config.json').subscribe((config: any) => {
            this.config = config;
          });
      }
}
