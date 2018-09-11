import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { LocalStorageService } from '../shared/local-storage.service';
import { GlobalService } from '../shared/global.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpRequestService } from '../shared/http-requests.service';

@Injectable()
export class MerchantService {
    loggedIn = false;
    merchantInfo;
    // private messageSource = new BehaviorSubject(0);
    // currentMessage = this.messageSource.asObservable();
    constructor(private http: Http,
                private localStorageService: LocalStorageService,
                private global: GlobalService,
                private httpRequests: HttpRequestService
            ) { }




    addMerchant(data: any) {

        const user = this.localStorageService.get('user-data');


        const body = new FormData();
        body.append('merchant_email', data.form.email);
        body.append('merchant_password', data.form.password);
        body.append('merchant_first_name', data.form.lname);
        body.append('merchant_last_name', '');
        body.append('merchant_parent_admin', user.admin_id);
        body.append('merchant_description', data.form.url);
        body.append('merchant_address', data.place);
        body.append('merchant_display_name', data.form.fname);
        body.append('merchant_phone_no', data.form.phoneNumber);
        body.append('merchant_lat', data.lat);
        body.append('merchant_long', data.lng);
        body.append('merchant_altitude', data.altitude);


        if (data.image === null) {
            body.append('merchant_profile_pic', '');
        } else {
            body.append('merchant_profile_pic', data.image, data.image.name );
        }

        return this.http.post(
        // this.global.serverUrl + 'merchant/en/register',
        this.global.serverUrl + this.httpRequests.merchantRegister,
        body,
        {headers: this.global.requestHeaders}  )
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

    editMerchant(data: any) {

        const user = this.localStorageService.get('user-data');

        const headers = new Headers({
            'd_token':  JSON.parse(localStorage.getItem('token'))
         });


         const body = new FormData();
        body.append('merchant_display_name', data.form.fname);
        body.append('merchant_first_name', data.form.lname);
        body.append('merchant_last_name', '');
        body.append('merchant_description', data.form.url);
        body.append('merchant_address', data.place);
        // body.append('merchant_phone_no', data.form.phoneNumber);
        body.append('merchant_lat', data.lat);
        body.append('merchant_long', data.lng);
        body.append('merchant_id', data.merchantID);
        body.append('merchant_altitude', data.altitude);
        // body.append('merchant_parent_admin', (user.merchant_id === undefined) ? user.admin_id : '' );

        if (data.image === null || data.image === undefined) {

            body.append('merchant_profile_pic', '');
        } else {
            body.append('merchant_profile_pic', data.image, data.image.name );
        }

        // return this.http.put(this.global.serverUrl + 'merchant/en/update_merchant',
        return this.http.put(this.global.serverUrl + this.httpRequests.merchantUpdate,
        body,
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


    getMerchants(data: any) {
        const headers = new Headers({
            'd_token':  JSON.parse(data.token)
         });

        return this.http.get(
            // this.global.serverUrl + 'merchant/en/get_all_merchant'
            this.global.serverUrl + this.httpRequests.getAllMerchant
            + '?limit=6&last_id=' + data.last_id
            + '&pre_id=' + data.pre_id +
            '&page_no=' + data.page_no,
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
        this.merchantInfo = data;
        // this.messageSource.next(data);
    }

    getMerchant() {
        return this.merchantInfo;
    }


    uploadDocuments(data: any) {
        // merchant/en/add_merchant_doc
        const user = this.localStorageService.get('user-data');



        const body = new FormData();
        body.append('merchant_id', user.merchant_id);
        body.append('merchant_licence_id', data.form.license);
        body.append('merchant_pan_id', data.form.pan);

        data.imgLicence.forEach(image => {
            if (image !== undefined) {
                body.append('merchant_licence_image', image, image.name);
            }
        });
        body.append('merchant_pan_image', data.imgPan, data.imgPan.name);

        if (data.form.gst !== '') {

            body.append('merchant_gst_id', data.form.gst);
            body.append('merchant_gst_image', data.gstImage, data.gstImage.name);
        }



        if (data.doc === undefined) {
            body.append('additional_image', '');
        } else {
            data.doc.forEach(image => {
                body.append('additional_image', image, image.name );
            });

        }



        return this.http.post(
        // this.global.serverUrl + 'merchant/en/add_merchant_doc',
        this.global.serverUrl + this.httpRequests.merchnatAddDoc,
        body,
        {headers: this.global.requestHeaders}  )
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

    editMerchantPlans(data: any) {

        const user = this.localStorageService.get('user-data');

        const headers = new Headers({
            'd_token':  JSON.parse(localStorage.getItem('token'))
         });


         const body = new FormData();
        body.append('merchant_subscription', data);
        body.append('merchant_id', user.merchant_id);


        return this.http.put(
        // this.global.serverUrl + 'merchant/en/update_merchant',
        this.global.serverUrl + this.httpRequests.merchantUpdate,
        body,
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


    verifyMerchant() {
        const headers = new Headers({
            'd_token':  JSON.parse(localStorage.getItem('token'))
         });
         const merchant_id = JSON.parse(localStorage.getItem('user-data')).merchant_id;

        return this.http.get(
            // this.global.serverUrl + 'merchant/en/get_single_merchant'
            this.global.serverUrl + this.httpRequests.merchantGetSingle
            + '?merchant_id=' + merchant_id,
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

    // get merchant doc's

    getMerchantDocuments(data: any) {
        const headers = new Headers({
            'd_token':  JSON.parse(localStorage.getItem('token'))
         });
        //  const merchant_id = JSON.parse(localStorage.getItem('user-data')).merchant_id;

        return this.http.get(
            // this.global.serverUrl + 'merchant/en/get_merchant_doc'
            this.global.serverUrl + this.httpRequests.merchantGetDoc
            + '?merchant_id=' + data,
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

    EditMerchantDocument(data: any) {
        const headers = new Headers({
            'd_token':  JSON.parse(localStorage.getItem('token'))
         });

        const body = new FormData();
        body.append('merchant_docment_id', data.docId);
        body.append('merchant_pan_id', data.panId);
        body.append('merchant_licence_id', data.licenceId);
        body.append('merchant_gst_id', data.gstId);
        if (data.gstImage === '') {
            body.append('merchant_gst_image', '');
        } else {
            body.append('merchant_gst_image', data.gstImage, data.gstImage.name);
        }

        if (data.imgPan === '') {
            body.append('merchant_pan_image', '');
        } else {
            body.append('merchant_pan_image', data.imgPan, data.imgPan.name);
        }

        if (data.imgLicence === undefined) {
            body.append('merchant_licence_image', '');
        } else {
            data.imgLicence.forEach(image => {
                body.append('merchant_licence_image', image, image.name);
            });
        }


        if (data.doc === undefined) {
            body.append('additional_image', '');
        } else {
            data.doc.forEach(image => {
                body.append('additional_image', image, image.name );
            });

        }


        body.append('delete_merchant_licence_image', data.deleteLicenceImage);
        body.append('delete_additional_image', data.deleteDoc);


        return this.http.put(
        // this.global.serverUrl + 'merchant/en/update_merchant_doc',
        this.global.serverUrl + this.httpRequests.merchantUpdateDoc,
        body,
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

    deleteMerchant(data: any) {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user-data'));

        const headers = new Headers({
            'd_token':  JSON.parse(token),
            'Content-Type': 'application/x-www-form-urlencoded'
        });



        const body = new URLSearchParams();
        body.append('merchant_ids', data);

        const options = new RequestOptions({
            headers: headers,
            body : body.toString()
          });
        return this.http.delete(
            // this.global.serverUrl + 'merchant/en/delete_multiple_merchant',
            this.global.serverUrl + this.httpRequests.merchantDelete,
            options )
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


    merchantChangePassword(data: any) {
        const headers = new Headers({
            'd_token':  JSON.parse(localStorage.getItem('token')),
            'Content-Type': 'application/x-www-form-urlencoded'
         });

        const body = new URLSearchParams();
        body.append('merchant_password', data.newPassword);
        body.append('confirm_merchant_password', data.confirmPassword);
        body.append('merchant_old_password', data.currentPwd);


        return this.http.put(
        this.global.serverUrl + this.httpRequests.merchantChangePwd,
        body.toString(),
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

