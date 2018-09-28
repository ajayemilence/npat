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
export class PlacesService {
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

    addPlace(data: any) {
        // const headers = new Headers({
        //     'Content-Type':  "application/json"
        //  });

        const body = data.toString();

        return this.http.post(
        this.global.gameUrl + this.httpRequests.addPlace,
        data,
        // {headers: headers} 
     )
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


// getting the places

    getPlaces(data) {

        return this.http.get(
            // this.global.serverUrl + 'merchant/en/get_all_merchant'
            this.global.gameUrl + this.httpRequests.getAllPlaces
            + '?pageNumber=' + data.page_no)
        .map(
            (response: Response) => {
                console.log(response);
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




//=======================
deleteWord(data) {
    return this.http.delete(
        // this.global.serverUrl + 'merchant/en/delete_multiple_merchant',
        this.global.gameUrl + this.httpRequests.deletePlace+"/"+data )
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


addCsvPlace(data: any) {

    const body = new FormData();

    if (data.image === null) {
        body.append('merchant_profile_pic', '');
    } else {
        body.append('csvFile', data.file, data.file.name );
    }

    return this.http.post(
    this.global.gameUrl + this.httpRequests.addCsvPlaces,
    body,
 )
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

