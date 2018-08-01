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
export class MerchantService {
    loggedIn = false;
    merchantInfo;
    // private messageSource = new BehaviorSubject('default message');
    // currentMessage = this.messageSource.asObservable();
    constructor(private http: Http,
                private localStorageService: LocalStorageService,
                private global: GlobalService) { }




    addMerchant(data: any) {
        // const adminId = localStorage.getItem('user-data');
        // console.log(adminId, 'admin_id');

        const user = this.localStorageService.get('user-data');
        console.log(user.admin_id);


        const body = new FormData();
        body.append('merchant_email', data.form.email);
        body.append('merchant_password', data.form.password);
        body.append('merchant_first_name', data.form.fname);
        body.append('merchant_last_name', data.form.lname);
        body.append('merchant_parent_admin', user.admin_id);
        body.append('merchant_description', data.form.url);
        body.append('merchant_address', data.place);
        body.append('merchant_display_name', data.form.displayName);
        body.append('merchant_phone_no', data.form.phoneNumber);
        body.append('merchant_lat', data.lat);
        body.append('merchant_long', data.lng);


        if (data.image === null) {
            console.log('image null');
            body.append('merchant_profile_pic', '');
        } else {
            console.log('image not null', data.image);
            body.append('merchant_profile_pic', data.image, data.image.name );
        }

        console.log(data, 'data');

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

    editMerchant(data: any) {

        const user = this.localStorageService.get('user-data');

        const headers = new Headers({
            'd_token':  JSON.parse(localStorage.getItem('token'))
         });


         const body = new FormData();
        body.append('merchant_display_name', data.form.displayName);
        body.append('merchant_first_name', data.form.fname);
        body.append('merchant_last_name', data.form.lname);
        body.append('merchant_description', data.form.url);
        body.append('merchant_address', data.place);
        body.append('merchant_phone_no', data.form.phoneNumber);
        body.append('merchant_lat', data.lat);
        body.append('merchant_long', data.lng);
        body.append('merchant_id', data.merchantID);
        body.append('merchant_parent_admin', (user.merchant_id === undefined) ? user.admin_id : '' );

        if (data.image === null) {
            console.log('image null');
            body.append('merchant_profile_pic', '');
        } else {
            console.log('image not null', data.image);
            body.append('merchant_profile_pic', data.image, data.image.name );
        }
        console.log(data, 'data');

        return this.http.put(this.global.serverUrl + 'merchant/en/update_merchant',
        body,
        {headers: headers}  )
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


    getMerchants(data: any) {
        const headers = new Headers({
            'd_token':  JSON.parse(data.token)
         });

        return this.http.get(
            this.global.serverUrl + 'merchant/en/get_all_merchant?limit=6&last_id=' + data.last_id,
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

    setMerchant(data: any) {
        console.log('in set Service part', this.merchantInfo);
        this.merchantInfo = data;
        // this.messageSource.next(data);
    }

    getMerchant() {
        console.log('in get Service part', this.merchantInfo);
        return this.merchantInfo;
    }
}

