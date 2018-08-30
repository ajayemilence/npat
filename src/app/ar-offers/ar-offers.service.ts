import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { LocalStorageService } from '../shared/local-storage.service';
import { GlobalService } from '../shared/global.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ColdObservable } from 'rxjs/testing/ColdObservable';

@Injectable()
export class AROffersService {
    inventory = '0';
    loggedIn = false;
    merchantInfo;
    merchantID;
    userdata;

    // private messageSource = new BehaviorSubject('default message');
    // currentMessage = this.messageSource.asObservable();
    constructor(private http: Http,
                private localStorageService: LocalStorageService,
                private global: GlobalService) { }




    addProduct(data: any) {


        const token = localStorage.getItem('token');
        const headers = new Headers({
            'd_token':  JSON.parse(token)
         });
        if (data.form.inventory === true) {
                this.inventory = '1';
        }

        const body = new FormData();
        body.append('pricing_super_category', '21');
        body.append('pricing_sub_category_id', '');
        body.append('pricing_category', '');
        body.append('product_name', data.form.name);
        body.append('product_inventory', this.inventory);
        body.append('pricing_product_stock', data.form);
        body.append('product_pricing_price', data.form.price);
        body.append('product_description', data.form.discription);


        // product_image
        if (data.image === null) {

            body.append('product_image', '');
        } else {

            body.append('product_image', data.image, data.image.name );
        }



        return this.http.post(this.global.serverUrl + 'product/en/add_product',
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



    getoffers() {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user-data'));

        const headers = new Headers({
            'd_token':  JSON.parse(token),
            // 'Authorization': this.global.basicAuth
        });
        return this.http.get(this.global.serverUrl + '/merchant_offer/en/get_merchant_offer?merchant_id=' + user.merchant_id ,
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


    // Edit

    editSuperCategory(data: any) {

        const token = localStorage.getItem('token');
        const headers = new Headers({
            'd_token':  JSON.parse(token),
            // 'Authorization': this.global.basicAuth
         });

        const body = new FormData();
        body.append('super_category_name', data.form.name);
        body.append('super_category_description', data.form.discription);
        body.append('super_category_id', data.categoryID);
        // Super Category Image
        if (data.image === null) {
            body.append('super_category_image', data.form.categoryPic);
        } else {
            body.append('super_category_image', data.image, data.image.name );
        }

        return this.http.put(this.global.serverUrl + 'super_category/en/update_super_category',
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



}

