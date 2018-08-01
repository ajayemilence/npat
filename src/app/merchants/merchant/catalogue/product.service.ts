import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { LocalStorageService } from '../../../shared/local-storage.service';
import { GlobalService } from '../../../shared/global.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ColdObservable } from 'rxjs/testing/ColdObservable';

@Injectable()
export class ProductService {
    productData ;
    inventory = '0';
    loggedIn = false;
    merchantInfo;
    attribute = {};
    // private messageSource = new BehaviorSubject('default message');
    // currentMessage = this.messageSource.asObservable();
    constructor(private http: Http,
                private localStorageService: LocalStorageService,
                private global: GlobalService) { }



    getAttribute(data: any) {
        const token = localStorage.getItem('token');
        const headers = new Headers({
            'd_token':  JSON.parse(token)
         });

        return this.http.get(this.global.serverUrl + 'product_attributes/en/search_product_spec_types?product_spec_name=' + data,
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


    addProduct(data: any) {
        console.log('================================================');
        const user = JSON.parse(localStorage.getItem('user-data'));
        console.log((user.admin_id !== undefined) ? user.admin_id : user.merchant_id, 'admin_id');
        const merchant = JSON.parse(localStorage.getItem('merchant-data'));

        const token = localStorage.getItem('token');
        const headers = new Headers({
            'd_token':  JSON.parse(token)
         });
        if (data.form.value.inventory === true) {
                this.inventory = '1';
        }
        if (data.attribute.length === 0) {
            this.attribute = '';
        } else {
            this.attribute = {
                'data': data.attribute
            };
        }
        console.log(this.attribute, '000000000000');
            const body = new FormData();

            // body.append('product_id', '');

            if (data.sub !== '') {
                // add product in sub category
                console.log('add in sub');
                body.append('product_super_category',  '' );
                body.append('product_sub_category_id', data.sub);
                body.append('product_category', '' );

            } else if (data.sub === '' && data.cat !== '') {
                // add product in category
                console.log('add in cat');
                body.append('product_super_category', '' );
                body.append('product_sub_category_id', '');
                body.append('product_category', data.cat);
            } else if (data.sub === '' && data.cat === '' && data.super !== '') {
                // add product in super category
                console.log('add in super');
                body.append('product_super_category', data.super );
                body.append('product_sub_category_id', '');
                body.append('product_category', '');
            }
            body.append('product_tax', data.form.value.tax);
            body.append('product_name', data.form.value.name);
            body.append('product_inventory', this.inventory);
            body.append('pricing_product_inventory', (data.form.value.avail === undefined) ? '' : data.form.value.avail);
            body.append('pricing_product_stock', (data.form.value.avail === undefined) ? '' : data.form.value.avail);
            body.append('product_pricing_price', data.form.value.mrp);
            // data.form.value.sellingPrice
            body.append('product_pricing_discount', '0');
            body.append('product_description', data.form.value.desc);
            // body.append('product_created_by', (user.admin_id !== undefined) ? user.admin_id : user.merchant_id);
            body.append('product_sku', data.form.value.sku);
            body.append('product_type', data.form.value.productType.toUpperCase());
            body.append('product_commision', '0');
            body.append('attr_values', (data.attribute.length === 0) ? '' : JSON.stringify(data.attribute) );
            body.append('merchant_id', merchant.merchant_id);
             // product_image
            if (data.images.length === 0) {
                console.log('image null');
                body.append('product_image', '');
            } else {
                console.log('image not null');
                console.log(data.images);
                data.images.forEach(image => {
                    body.append('product_image', image, image.name );
                });
            }

        return this.http.post(this.global.serverUrl + 'product/en/add_product',
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

    addQuantity(data: any) {
        const token = localStorage.getItem('token');
        const headers = new Headers({
            'd_token':  JSON.parse(token),
            'Content-Type': 'application/x-www-form-urlencoded'
        });


        const dataVal = {
            'data': data
        };
        const body = new URLSearchParams();
        body.append('inventory_json', JSON.stringify(dataVal));

        console.log(JSON.stringify(dataVal));


        return this.http.post(this.global.serverUrl + 'product_attributes/en/add_product_inventory',
        body.toString(),
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

    setProduct(product) {
        this.productData = product;
    }

    getProduct() {
        return this.productData;
    }
}

