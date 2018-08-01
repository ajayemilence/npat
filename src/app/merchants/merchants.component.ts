import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MerchantService } from './merchants.service';
import { PageChangedEvent } from 'ngx-bootstrap';
import { LocalStorageService } from '../shared/local-storage.service';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-merchants',
  templateUrl: './merchants.component.html',
  styleUrls: ['./merchants.component.css']
})
export class MerchantsComponent implements OnInit {
  merchants;
  isLoading = true;
  countArray = [];
  last_id = '';
  token = localStorage.getItem('token');
  params;
  pageDetail = [];
  current = {};


  // MatPaginator Inputs
  datasource: null;
  length = 0;
  pageSize = 6;
  // pageSizeOptions: number[] = [5, 10, 25];

  // MatPaginator Output
  pageEvent: PageEvent;

  constructor(private merchantService: MerchantService) { }

  ngOnInit() {
    const data = {
      token: this.token,
      last_id: '',
      // limit: 5
    };

    this.merchantService.getMerchants(data)
      .subscribe(
        (response) => {
          if (response.success === 200) {
            this.isLoading = false;
            this.merchants = response.data.rows;
            this.current = {
                pageIndex : 0,
                last_Id : this.merchants[this.merchants.length - 1 ].merchant_id
            };
            this.pageDetail.push(this.current);
            this.length = response.data.count;
          } else {
            // navigate to error page
            console.log(response);
          }
        },
        (error) => {
          console.log('error!!', error);
        });
  }


  info(merchant) {
    this.merchantService.setMerchant(merchant);
  }

  changePage(event) {
      if (event.pageIndex === 0) {
        // first page
        this.params = {
          token: this.token,
          last_id: '',
          // limit: event.pageSize
        };
      } else {
        const result = this.pageDetail.filter(val => val.pageIndex === event.pageIndex - 1);
        if (result.length === 0) {
            // getting data after current
            this.params = {
              token: this.token,
              last_id: this.current['last_Id'],
              // limit: event.pageSize
            };
        } else {
          this.params = {
            token: this.token,
            last_id: result[0].last_Id,
            // limit: event.pageSize
          };
        }
      }

      this.merchantService.getMerchants(this.params)
      .subscribe(
      (response) => {
        if (response.success === 200) {
          this.isLoading = false;
          this.merchants = response.data.rows;

          // updating current page
          this.current = {
            pageIndex : event.pageIndex,
            last_Id : this.merchants[this.merchants.length - 1 ].merchant_id
          };
        } else {
          // navigate to error page
          console.log(response);
        }
      },
      (error) => {
        console.log('error!!', error);
      });
      return event;
  }

}
