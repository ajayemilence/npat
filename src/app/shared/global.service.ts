import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
@Injectable()
export class GlobalService {
  serverUrl: string;
  requestHeaders: Headers;
  urlHeaders: Headers;
  username = 'basketball@emilence.com';
  password = 'Emilence@1';
  basicAuth: string;
  ImagePath;
  constructor() {
    this.serverUrl = 'http://18.188.80.129:4003/v1/',
    this.ImagePath = 'https://s3.us-east-2.amazonaws.com/swift-spar-local/delivery_app/';


    // this.serverUrl = 'http://13.233.9.247:4003/v1/',
    // this.ImagePath = 'https://s3.ap-south-1.amazonaws.com/nearr-prod/delivery_app/';
    this.basicAuth = 'Basic ZGVsaXZlcnlAZW1pbGVuY2UuY29tOkVtaWxlbmNlQDE=';
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
