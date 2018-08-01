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
export class RequestService {
    private messageSource = new BehaviorSubject(1);
    currentMessage = this.messageSource.asObservable();

    constructor(private http: Http,
                private localStorageService: LocalStorageService,
                private global: GlobalService) { }



    setRequest(data: any) {
        this.messageSource.next(data);
    }

    getSuperCategoryRequest(data: any) {
        const user = this.localStorageService.get('user-data');
        const token = this.localStorageService.get('token');
        console.log(token, user);
        const headers = new Headers({
            'd_token':  token
         });

        return this.http.get(
            this.global.serverUrl + 'admin/en/get_requested_super_category?limit=6&last_id=' + data.last_id
            + '&super_category_admin=' + user.admin_id,
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


    getCategoryRequest(data: any) {
        const user = this.localStorageService.get('user-data');
        const token = this.localStorageService.get('token');
        const headers = new Headers({
            'd_token':  token
         });
        return this.http.get(
            this.global.serverUrl + 'admin/en/get_req_category_admin?limit=6&last_id=' + data.last_id
            + '&super_category_admin=' + user.admin_id,
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


    getSubCategoryRequest(data: any) {
        const user = this.localStorageService.get('user-data');
        const token = this.localStorageService.get('token');
        const headers = new Headers({
            'd_token':  token
         });

        return this.http.get(
            this.global.serverUrl + 'admin/en/get_req_sub_category_admin?limit=6&last_id=' + data.last_id
            + '&super_category_admin=' + user.admin_id,
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




    requestResponse(data: any) {
        const user = this.localStorageService.get('user-data');
        const token = this.localStorageService.get('token');

        const headers = new Headers({
            'd_token':  token,
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        const body = new URLSearchParams();
        body.append('category_type_id', data.category_type_id);
        body.append('category_type', data.category_type);
        body.append('status', data.status);

        return this.http.put(this.global.serverUrl + 'admin/en/accept_reject_categories',
        body.toString(),
        {headers: headers})
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


    // // Edit

    // editSuperCategory(data: any) {
    //     console.log('In Edit Super Category service');
    //     const token = localStorage.getItem('token');
    //     const user = JSON.parse(localStorage.getItem('user-data'));
    //     const headers = new Headers({
    //         'd_token':  JSON.parse(token),
    //         // 'Authorization': this.global.basicAuth
    //     });
    //     console.log(token, user.admin_id);
    //     const body = new FormData();
    //     body.append('super_category_name', data.form.name);
    //     body.append('super_category_description', data.form.discription);
    //     body.append('super_category_id', data.categoryID);
    //     // Super Category Image
    //     if (data.image === null) {
    //         body.append('super_category_image', data.form.categoryPic);
    //     } else {
    //         body.append('super_category_image', data.image, data.image.name );
    //     }
    //     body.append('merchant_id', '106');
    //     return this.http.put(this.global.serverUrl + 'super_category/en/update_super_category',
    //     body,
    //     {headers: headers}  )
    //     .map(
    //         (response: Response) => {
    //             const output = response.json();
    //             return output;
    //         }
    //     ).catch(
    //         (error: Response) => {
    //             console.log('error', error);
    //             const output = error.json();
    //             return Observable.throw('Something went wrong', output);
    //         }
    //     );
    // }
}

