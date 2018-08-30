import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { LocalStorageService } from '../shared/local-storage.service';
import { GlobalService } from '../shared/global.service';

@Injectable()
export class AuthService {
    loggedIn = false;

    constructor(private http: Http,
                private localStorageService: LocalStorageService,
                private global: GlobalService) { }


    signup(data: any) {
        // const body = JSON.stringify(data);
        const body = new FormData();
        body.append('admin_email', data.admin_email);
        body.append('admin_password', data.admin_password);
        body.append('admin_first_name', data.admin_first_name);
        body.append('admin_last_name', data.admin_last_name);
        body.append('admin_phone_no', data.admin_phone_no);
        // body.append('admin_product_type', '');
        // body.append('admin_account_type', '');

        if (data.image === null) {
            body.append('admin_profile_pic', '');
        } else {

            body.append('admin_profile_pic', data.image, data.image.name );
        }
        return this.http.post(this.global.serverUrl + 'admin/en/register',
        body,
        {headers: this.global.requestHeaders}  )
        .map(
            (response: Response) => {
                const output = response.json();
                if (output.success === 200) {
                    localStorage.clear();
                    this.localStorageService.set('token', output.data.token);
                    this.localStorageService.set('user-data', output.data);

                }
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
    body.append('admin_email', data.admin_email);
    body.append('admin_password', data.admin_password);

    return this.http.post(
        this.global.serverUrl + 'admin/en/login',
        body.toString(),
        {headers: this.global.urlHeaders} )
    .map(
        (response: Response) => {
           const output = response.json();
           return output;
        }
    ).catch(
        (error: Response) => {
            return Observable.throw('Something went wrong');
        }
    );
   }


//    signupMechant(data: any) {
//     const user = this.localStorageService.get('user-data');
//     // console.log(user.admin_id);


//     const body = new FormData();
//     body.append('merchant_email', data.form.email);
//     body.append('merchant_password', data.form.password);
//     body.append('merchant_first_name', data.form.fname);
//     body.append('merchant_last_name', data.form.lname);
//     // body.append('merchant_parent_admin', user.admin_id);
//     body.append('merchant_description', data.form.url);
//     body.append('merchant_address', data.place);
//     body.append('merchant_phone_no', data.form.phoneNumber);
//     // body.append('merchant_lat', data.lat);
//     // body.append('merchant_long', data.lng);


//     console.log(data, 'data');

//     return this.http.post(this.global.serverUrl + 'merchant/en/register',
//     body,
//     {headers: this.global.requestHeaders}  )
//     .map(
//         (response: Response) => {
//             const output = response.json();
//             console.log(output, 'output');
//             return output;
//         }
//     ).catch(
//         (error: Response) => {
//             console.log('error', error);
//             const output = error.json();
//             return Observable.throw('Something went wrong', output);
//         }
//     );
//    }
}

