import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { LocalStorageService } from '../shared/local-storage.service';
import { GlobalService } from '../shared/global.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpRequestService } from '../shared/http-requests.service';

@Injectable()
export class VerifyMerchantService {

    constructor(private http: Http,
                private httpRequests: HttpRequestService,
                private localStorageService: LocalStorageService,
                private global: GlobalService) { }



    getMerchants(data: any) {
        const user = this.localStorageService.get('user-data');
        const token = this.localStorageService.get('token');
        const headers = new Headers({
            'd_token':  token
         });

        return this.http.get(
            // this.global.serverUrl + 'merchant/en/get_unverified_merchant?last_id=' + data,
            this.global.serverUrl + this.httpRequests.merchantAllUnverified +
            '?last_id=' + data,
            {headers: headers})
        .map(
            (response: Response) => {
                const output = response.json();
                return output;
            }
        ).catch(
            (error: Response) => {
                const output = error.json();
                return Observable.throw('Something went wrong', output);
            }
        );
    }




    verifyMerchant(data: any) {
        const headers = new Headers({
            'd_token':  JSON.parse(localStorage.getItem('token')),
            'Content-Type': 'application/x-www-form-urlencoded'
         });

         const body = new URLSearchParams();
        body.append('merchant_verification_status', 'Verified');
        body.append('merchant_id', data);

        return this.http.put(
            // this.global.serverUrl + 'merchant/en/update_merchant_verification_status',
            this.global.serverUrl + this.httpRequests.merchantVerify,
            body.toString(),
            {headers: headers})
        .map(
            (response: Response) => {
                const output = response.json();
                return output;
            }
        ).catch(
            (error: Response) => {
                const output = error.json();
                return Observable.throw('Something went wrong', output);
            }
        );
    }

}
