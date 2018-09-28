import { Injectable } from '@angular/core';
@Injectable()
export class InternetService {

    InternetConnection;
    constructor() {
    this.InternetConnection = window.navigator.onLine;
  }
}
