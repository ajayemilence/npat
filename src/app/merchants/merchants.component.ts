import { Component, OnInit, Output, EventEmitter, TemplateRef } from '@angular/core';
import { MerchantService } from './merchants.service';
import { PageChangedEvent, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { LocalStorageService } from '../shared/local-storage.service';
import {PageEvent, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-merchants',
  templateUrl: './merchants.component.html',
  styleUrls: ['./merchants.component.css']
})
export class MerchantsComponent implements OnInit {
  currentIndex = 0;
  merchants;
  isLoading = true;
  countArray = [];
  last_id = '';
  token = localStorage.getItem('token');
  params;
  pageDetail = [];
  current = {};
  modalRef: BsModalRef;

  // MatPaginator Inputs
  datasource: null;
  length = 0;
  pageSize = 6;
  pageSizeOptions: number[] = [6, 25, 50];

  // MatPaginator Output
  pageEvent: PageEvent;
  deleteMerchnat;

  constructor(private merchantService: MerchantService,
              private snackBar: MatSnackBar,
              private modalService: BsModalService
            ) { }

  ngOnInit() {
    localStorage.removeItem('merchant-data');
    const data = {
      token: this.token,
      last_id: '',
      pre_id : '',
      page_no: ''
    };

    this.merchantService.getMerchants(data)
      .subscribe(
        (response) => {
          if (response.success === 200) {
            this.isLoading = false;
            this.merchants = response.data.rows;
            // this.current = {
            //     pageIndex : 0,
            //     last_Id : this.merchants[this.merchants.length - 1 ].merchant_id
            // };
            // this.pageDetail.push(this.current);
            this.length = response.data.count;
          } else {
            // navigate to error page
            this.isLoading = false;
            console.log(response);
            this.snackBar.open('Something went wrong, please try again later', 'Dismiss', {
                duration: 4000
            });
          }
        },
        (error) => {
          console.log('error!!', error);
          this.isLoading = false;
            this.snackBar.open('Something went wrong, please try again later', 'Dismiss', {
                duration: 4000
            });
        });
  }


  info(merchant) {
    this.merchantService.setMerchant(merchant);
  }

  changePage(event) {

    // if (event.pageIndex > this.currentIndex) {
    //   this.currentIndex = event.pageIndex;
    //   // console.log(this.currentIndex);
    //   this.params = {
    //       token: this.token,
    //       last_id: this.merchants[this.merchants.length - 1].merchant_id,
    //       pre_id : ''
    //       // limit: event.pageSize
    //   };
    // } else  {
      // console.log(this.currentIndex);
      // this.currentIndex = event.pageIndex;
      this.params = {
        token: this.token,
        last_id: '',
        pre_id : '',
        page_no : event.pageIndex + 1
        // limit: event.pageSize
    };
    // }
      // if (event.pageIndex === 0) {
      //   // first page
      //   this.params = {
      //     token: this.token,
      //     last_id: '',
      //     // limit: event.pageSize
      //   };
      // } else {
      //   const result = this.pageDetail.filter(val => val.pageIndex === event.pageIndex - 1);
      //   if (result.length === 0) {
      //       // getting data after current
      //       this.params = {
      //         token: this.token,
      //         last_id: this.current['last_Id'],
      //         // limit: event.pageSize
      //       };
      //   } else {
      //     this.params = {
      //       token: this.token,
      //       last_id: result[0].last_Id,
      //       // limit: event.pageSize
      //     };
      //   }
      // }

      this.merchantService.getMerchants(this.params)
      .subscribe(
      (response) => {
        if (response.success === 200) {
          this.isLoading = false;
          this.merchants = response.data.rows;

          // updating current page
          // this.current = {
          //   pageIndex : event.pageIndex,
          //   last_Id : this.merchants[this.merchants.length - 1 ].merchant_id
          // };
        } else {
          // navigate to error page
          this.isLoading = false;
          console.log(response);
          this.snackBar.open('Something went wrong, please try again later!', 'Dismiss', {
            duration: 5000,
          });
        }
      },
      (error) => {
        console.log('error!!', error);
        this.isLoading = false;
        this.snackBar.open('Something went wrong, please try again later!', 'Dismiss', {
          duration: 5000,
        });
      });
      return event;
  }

  openModal(template: TemplateRef<any>, name) {
    this.modalRef = this.modalService.show(template);
    this.deleteMerchnat = name;
  }

  deleteMerchant(id) {

    this.merchantService.deleteMerchant(id).subscribe(
      (response) => {
            if (response.success === 200) {
              const data = {
                token: this.token,
                last_id: '',
                pre_id : '',
                page_no: ''
              };

              this.merchantService.getMerchants(data)
                .subscribe(
                  (responseData) => {
                    this.modalRef.hide();
                    this.deleteMerchnat = '';
                    if (responseData.success === 200) {
                      this.isLoading = false;
                      this.merchants = responseData.data.rows;
                      this.length = responseData.data.count;
                    } else {
                      this.isLoading = false;
                      this.snackBar.open('Something went wrong, please try again later', 'Dismiss', {
                          duration: 4000
                      });
                    }
                  },
                  (error) => {
                    console.log('error!!', error);
                    this.isLoading = false;
                      this.snackBar.open('Something went wrong, please try again later', 'Dismiss', {
                          duration: 4000
                      });
                  });
            } else {
              console.log(response.output.payload.message);
              this.snackBar.open('Something went wrong, please try again later!', 'Dismiss', {
                duration: 5000,
              });
            }
      }, (error) => {
          console.log('error!!', error);
          this.isLoading = false;
          this.snackBar.open('Something went wrong, please try again later!', 'Dismiss', {
            duration: 5000,
          });
      }
    );
  }

}
