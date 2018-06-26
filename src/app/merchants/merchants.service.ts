import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { LocalStorageService } from '../shared/local-storage.service';
import { GlobalService } from '../shared/global.service';

@Injectable()
export class MerchantService {
    loggedIn = false;

    constructor(private http: Http,
                private localStorageService: LocalStorageService,
                private global: GlobalService) { }


    addMerchant(data: any) {
        const body = new FormData();
        body.append('merchant_email', data.value.email);
        body.append('merchant_password', data.value.password);
        body.append('merchant_first_name', data.value.fname);
        body.append('merchant_last_name', data.value.lname);
        body.append('merchant_parent_admin', data.value.parentAdmin);


        return this.http.post(this.global.serverUrl + 'merchant/en/register',
        body,
        {headers: this.global.requestHeaders}  )
        .map(
            (response: Response) => {
                const output = response.json();
                console.log(output, 'output');
                // if (output.success === 200) {
                //     this.localStorageService.set('token', output.data.token);
                //     this.localStorageService.set('merchant-data', output.data);

                // }
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

