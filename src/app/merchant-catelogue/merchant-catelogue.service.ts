import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { LocalStorageService } from '../shared/local-storage.service';
import { GlobalService } from '../shared/global.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class MerchantCatelogueService {
    loggedIn = false;
    merchantInfo;
    // private messageSource = new BehaviorSubject('default message');
    // currentMessage = this.messageSource.asObservable();
    constructor(private http: Http,
                private localStorageService: LocalStorageService,
                private global: GlobalService) { }




    getSuperCategory() {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user-data'));

        const headers = new Headers({
            'd_token':  JSON.parse(token),
            // 'Authorization': this.global.basicAuth
        });
        if (user !== null) {

            // Merchant catalogue
            console.log('merchant Catalogue API');
            return this.http.get(this.global.serverUrl + 'merchant/en/get_all_category_merchant',
            {headers: headers}  )
            .map(
                (response: Response) => {
                    const output = response.json();
                    return output;
                }
            ).catch(
                (error: Response) => {
                    console.log('error', error);
                    const output = error.json();
                    return Observable.throw('Something went wrong', output);
                }
            );

        }
    }
}
