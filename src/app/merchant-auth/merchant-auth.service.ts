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
export class MerchantAuthService {
    loggedIn = false;
    merchantInfo;
    // private messageSource = new BehaviorSubject('default message');
    // currentMessage = this.messageSource.asObservable();
    constructor(private http: Http,
                private localStorageService: LocalStorageService,
                private global: GlobalService) { }




    signup(data: any) {
        // const adminId = localStorage.getItem('user-data');
        // console.log(adminId, 'admin_id');

        console.log(data, 'data Merchant Auth');


        const body = new FormData();
        body.append('merchant_email', data.form.value.email);
        body.append('merchant_password', data.form.value.password);
        body.append('merchant_first_name', data.form.value.fname);
        body.append('merchant_last_name', data.form.value.lname);
        body.append('merchant_parent_admin', '14');
        body.append('merchant_description', data.form.value.url);
        body.append('merchant_address', data.form.value.address);
        body.append('merchant_phone_no', data.form.value.phoneNumber);
        body.append('merchant_lat', data.lat);
        body.append('merchant_long', data.lng);
        body.append('merchant_display_name' , data.form.value.address);


        return this.http.post(this.global.serverUrl + 'merchant/en/register',
        body,
        {headers: this.global.requestHeaders}  )
        .map(
            (response: Response) => {
                const output = response.json();
                console.log(output, 'output');
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


    signin(data: any) {
        const body = new URLSearchParams();
        body.append('merchant_email', data.email);
        body.append('merchant_password', data.password);
        console.log(data.email);
        console.log(data.password);
        return this.http.post(
            this.global.serverUrl + 'merchant/en/login',
            body.toString(),
            {headers: this.global.urlHeaders})
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

