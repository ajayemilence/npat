import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
@Injectable()
export class GlobalService {
  serverUrl: string;
  requestHeaders: Headers;
  urlHeaders: Headers;
  username = 'basketball@emilence.com';
  password = 'Emilence@1';

  constructor() {
    this.serverUrl = 'http://18.188.80.129:4003/v1/',
    this.requestHeaders = new Headers({
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ZGVsaXZlcnlAZW1pbGVuY2UuY29tOkVtaWxlbmNlQDE='
     });
     this.urlHeaders = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ZGVsaXZlcnlAZW1pbGVuY2UuY29tOkVtaWxlbmNlQDE='
   });
  }
}
// 'Basic ' + btoa(this.username + ':' + this.password)
