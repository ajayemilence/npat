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
import { HttpRequestService } from '../../../shared/http-requests.service';

@Injectable()
export class CatalogueService {
    inventory = '0';
    loggedIn = false;
    merchantInfo;
    merchantID;
    userdata;
    // private messageSource = new BehaviorSubject('default message');
    // currentMessage = this.messageSource.asObservable();
    constructor(private http: Http,
                private localStorageService: LocalStorageService,
                private global: GlobalService,
                private httpRequests: HttpRequestService
            ) { }




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



        return this.http.post(
            // this.global.serverUrl + 'product/en/add_product',
        this.global.serverUrl + this.httpRequests.productAdd,
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

    addSuperCategory(data: any) {
        const token = localStorage.getItem('token');
        const headers = new Headers({
            'd_token':  JSON.parse(token),
            // 'Authorization': this.global.basicAuth
         });

        const admin = JSON.parse(localStorage.getItem('user-data'));
        const adminID = (admin.admin_id === undefined) ? admin.merchant_parent_admin : admin.admin_id;
        const merchantID = (admin.admin_id !== undefined) ?  data.merchantID : admin.merchant_id;

        const body = new FormData();
        body.append('super_category_name', data.form.name);
        body.append('super_category_description', data.form.discription);
        body.append('admin_id', adminID);
        body.append('merchant_id' , merchantID);

        // Super Category Image
        if (data.image === null) {
            body.append('super_category_image', '');
        } else {
            body.append('super_category_image', data.image, data.image.name );
        }

        return this.http.post(
        // this.global.serverUrl + 'super_category/en/add_super_category',
        this.global.serverUrl + this.httpRequests.superCatAdd,
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

    addCategory(data: any) {
        const token = localStorage.getItem('token');
        const headers = new Headers({
            'd_token':  JSON.parse(token),
            // 'Authorization': this.global.basicAuth
         });
        const user = JSON.parse(localStorage.getItem('user-data'));
        const body = new FormData();
        body.append('category_name', data.form.name);
        body.append('category_parent_super', data.superID);
        body.append('category_description', data.form.discription);

        // Super Category Image
        if (data.image === null) {
            body.append('category_image', '');
        } else {
            body.append('category_image', data.image, data.image.name );
        }

        body.append('merchant_id', (user.merchant_id !== undefined) ? user.merchant_id : data.merchantID);

        return this.http.post(
        // this.global.serverUrl + 'category/en/add_category',
        this.global.serverUrl + this.httpRequests.catAdd,
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

    addSubCategory(data: any) {
        const token = localStorage.getItem('token');
        const headers = new Headers({
            'd_token':  JSON.parse(token),
            // 'Authorization': this.global.basicAuth
         });

        const user = JSON.parse(localStorage.getItem('user-data'));
        const body = new FormData();

        body.append('sub_category_name', data.form.name);
        body.append('sub_category_parent', data.catID);
        body.append('sub_category_description', data.form.discription);

        // Super Category Image
        if (data.image === null) {
            body.append('sub_category_image', '');
        } else {
            body.append('sub_category_image', data.image, data.image.name );
        }
        body.append('merchant_id', (user.merchant_id !== undefined) ? user.merchant_id : data.merchantID);


        return this.http.post(
        // this.global.serverUrl + 'sub_category/en/add_sub_category',
        this.global.serverUrl + this.httpRequests.subCatAdd,
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

    getSuperCategory() {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user-data'));

        const headers = new Headers({
            'd_token':  JSON.parse(token),
            // 'Authorization': this.global.basicAuth
        });
        if (user !== null) {
            if (user.merchant_id !== undefined) {
            // Merchant catalogue

                return this.http.get(
                // this.global.serverUrl + 'merchant/en/get_all_category_merchant?merchant_id=' + user.merchant_id ,
                this.global.serverUrl + this.httpRequests.merchantGetAllCat +
                '?merchant_id=' + user.merchant_id ,
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
            } else if (user.admin_id !== undefined) {

                const merchant = JSON.parse(localStorage.getItem('merchant-data'));
                const requestMerchant = JSON.parse(localStorage.getItem('request-merchant'));
                if (merchant !== null || requestMerchant !== null) {
                    const merchantID = (merchant !== null) ? merchant.merchant_id : requestMerchant.merchant_id;
                    // merchantGetAllCat
                    return this.http.get(
                    // this.global.serverUrl + 'merchant/en/get_all_category_merchant?merchant_id='
                    this.global.serverUrl + this.httpRequests.merchantGetAllCat +
                    '?merchant_id=' + merchantID ,
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


                } else {
                // Admin catalogue

                // return this.http.get(this.global.serverUrl + 'admin/en/get_all_category_admin',
                return this.http.get(this.global.serverUrl + this.httpRequests.adminGetAllCategory,
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

        return this.http.put(
        // this.global.serverUrl + 'super_category/en/update_super_category',
        this.global.serverUrl + this.httpRequests.superCatUpdate,
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


    editCategory(data: any) {

        const token = localStorage.getItem('token');
        const headers = new Headers({
            'd_token':  JSON.parse(token)
         });

        const body = new FormData();
        body.append('category_name', data.form.name);
        body.append('category_description', data.form.discription);
        body.append('category_id', data.categoryID);
        body.append('category_parent_super', data.superID);
        // Super Category Image
        if (data.image === null) {
            body.append('category_image', data.form.categoryPic);
        } else {
            body.append('category_image', data.image, data.image.name );
        }

        return this.http.put(
        // this.global.serverUrl + 'category/en/update_category',
        this.global.serverUrl + this.httpRequests.catUpdate,
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


    editSubCategory(data: any) {

        const token = localStorage.getItem('token');
        const headers = new Headers({
            'd_token':  JSON.parse(token)
         });

        const body = new FormData();
        body.append('sub_category_name', data.form.name);
        body.append('sub_category_description', data.form.discription);
        body.append('sub_category_id', data.categoryID);
        body.append('sub_category_parent', data.superID);
        // Super Category Image
        if (data.image === null) {
            body.append('sub_category_image', data.form.categoryPic);
        } else {
            body.append('sub_category_image', data.image, data.image.name );
        }

        return this.http.put(
        // this.global.serverUrl + 'sub_category/en/update_sub_category',
        this.global.serverUrl + this.httpRequests.subCatUpdate,
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



    // get Product
    getSuperCategoryProduct(data: any) {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user-data'));

        const headers = new Headers({
            'd_token':  JSON.parse(token)
        });

        const last_id = (data.last !== undefined) ? data.last : '';
        if (user !== null) {
            // super category
            if (user.merchant_id !== undefined) {
                this.merchantID = user.merchant_id;
             } else if (user.admin_id !== undefined) {
                 this.merchantID = (data.merchantID === '') ? user.admin_id : data.merchantID;
             }
             const role = (user.admin_id !== undefined && data.merchantID === '') ? 1 : '';
            return this.http.get(
            // this.global.serverUrl + 'product/en/get_products_by_category'
            this.global.serverUrl + this.httpRequests.productGetByCat
            + '?product_super_category=' + data.ID +
            '&static_user_id=' + this.merchantID  +
            '&static_role=' + role +
            '&last_id=' + last_id,
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


    getCategoryProduct(data: any) {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user-data'));

        const headers = new Headers({
            'd_token':  JSON.parse(token)
        });
        const last_id = (data.last !== undefined) ? data.last : '';
        if (user !== null) {
            // super category
            if (user.merchant_id !== undefined) {
               this.merchantID = user.merchant_id;
            } else if (user.admin_id !== undefined) {
                this.merchantID = (data.merchantID === '') ? user.admin_id : data.merchantID;
            }
            const role = (user.admin_id !== undefined && data.merchantID === '') ? 1 : '';
            return this.http.get(
            // this.global.serverUrl + 'product/en/get_products_by_category'
            this.global.serverUrl + this.httpRequests.productGetByCat +
            '?product_category=' + data.ID +
            '&static_user_id=' + this.merchantID  +
            '&static_role=' + role +
            '&last_id=' + last_id,
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


    getSubCategoryProduct(data: any) {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user-data'));

        const headers = new Headers({
            'd_token':  JSON.parse(token)
        });
        const last_id = (data.last !== undefined) ? data.last : '';
        if (user !== null) {
            // super category
            if (user.merchant_id !== undefined) {
               this.merchantID = user.merchant_id;
            } else if (user.admin_id !== undefined) {
                this.merchantID = (data.merchantID === '') ? user.admin_id : data.merchantID;
            }
            const role = (user.admin_id !== undefined && data.merchantID === '') ? 1 : '';
            return this.http.get(
            // this.global.serverUrl + 'product/en/get_products_by_category?product_sub_category_id=' + data.ID +
            this.global.serverUrl + this.httpRequests.productGetByCat +
            '?product_sub_category_id=' + data.ID +
            '&static_user_id=' + this.merchantID  +
            '&static_role=' + role +
            '&last_id=' + last_id,
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
        // const token = localStorage.getItem('token');
        // const user = JSON.parse(localStorage.getItem('user-data'));

        // const headers = new Headers({
        //     'd_token':  JSON.parse(localStorage.getItem('token'))
        // });
        // console.log(JSON.parse(token), 'token');
        // const last_id = (data.last !== undefined) ? data.last : '';
        // if (user !== null) {
        //     // super category
        //     if (user.merchant_id !== undefined) {
        //         this.merchantID = user.merchant_id;
        //     } else if (user.admin_id !== undefined) {
        //          this.merchantID = (data.merchantID === '') ? user.admin_id : data.merchantID;
        //     }
        //     const role = (user.admin_id !== undefined && data.merchantID === '') ? 1 : 4;
        //     console.log(role, 'role');
        //     console.log(this.merchantID, 'this.merchantID');
        //     console.log('cat ID', data.ID);
        //     return this.http.get(this.global.serverUrl + 'product/en/get_products_by_category?product_sub_category_id=' + data.ID +
        //     '&static_user_id=' + this.merchantID  +
        //     '&last_id=' + last_id,
        //     '&static_role=' + role,
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


    // list super Categories for marchant

    listSuperCategories(data: any) {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user-data'));

        const headers = new Headers({
            'd_token':  JSON.parse(token),
            // 'Authorization': this.global.basicAuth
        });
        // Merchant catalogue

        const merchantID = (user.merchant_id === undefined) ? data : user.merchant_id;
        const adminID = (user.merchant_id === undefined) ? user.admin_id : user.merchant_parent_admin;
        return this.http.get(
        // this.global.serverUrl + '/super_category/en/get_all_super_category' +
        this.global.serverUrl + this.httpRequests.superCatGet +
        '?super_category_admin=' + adminID +
        '&merchant_id=' + merchantID +
        '&last_id=' + '&limit='
        ,
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

    // select super category
    addSelectedSuperCategories(data: any) {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user-data'));

        const headers = new Headers({
            'd_token':  JSON.parse(token),
            'Content-Type': 'application/x-www-form-urlencoded'
        });



        const merchantID = (user.merchant_id === undefined) ? data.merchantID : user.merchant_id;

        const body = new URLSearchParams();
        body.append('super_category_ids', data.superCategories);
        body.append('merchant_id' , merchantID);

        return this.http.post(
        // this.global.serverUrl + 'merchant/en/select_super_category?merchant_id=' + merchantID,
        this.global.serverUrl + this.httpRequests.merchantSelectSuperCat
        + '?merchant_id=' + merchantID,
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

    getAllCategoriesMerchant(data: any) {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user-data'));

        const headers = new Headers({
            'd_token':  JSON.parse(token)
        });
        const merchantID = (user.merchant_id !== undefined) ? user.merchant_id : data;
        return this.http.get(
        // this.global.serverUrl + 'merchant/en/get_all_category_merchant?merchant_id=' + merchantID,
        this.global.serverUrl + this.httpRequests.merchantGetAllCat
        + '?merchant_id=' + merchantID,
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


    setUser(data) {
        this.userdata = data;
    }
    getUser() {
        return this.userdata;
    }


    addAttributeToCategory(data: any) {
        const headers = new Headers({
            'd_token':  JSON.parse(localStorage.getItem('token')),
            'Content-Type': 'application/x-www-form-urlencoded'
         });

        const body = new URLSearchParams();
        body.append('product_spec_type_values', data.values);
        body.append('product_spec_name', data.name);
        body.append('super_category_id', data.super);
        body.append('sub_category_id', data.sub);
        body.append('category_id', data.cat);


        return this.http.post(
        this.global.serverUrl + this.httpRequests.addAttributeCat,
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

    getAttributeOfCategory(data: any) {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user-data'));

        const headers = new Headers({
            'd_token':  JSON.parse(token)
        });


            return this.http.get(
            // this.global.serverUrl + 'product/en/get_products_by_category'
            this.global.serverUrl + this.httpRequests.getAttributeCat
            +  '?category_id=' + data,
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


    // edit attribute
    editAttributeToCategory(data: any) {
        const headers = new Headers({
            'd_token':  JSON.parse(localStorage.getItem('token')),
            'Content-Type': 'application/x-www-form-urlencoded'
         });

        const body = new URLSearchParams();
        body.append('product_spec_type_values', data.values);
        body.append('product_spec_name', data.name);
        body.append('product_spec_id', data.id);


        return this.http.put(
        this.global.serverUrl + this.httpRequests.editAttributeCat,
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

