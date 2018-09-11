import { Component, OnInit, Output, EventEmitter, TemplateRef, ViewEncapsulation } from '@angular/core';
import { MerchantService } from './merchants.service';
import { PageChangedEvent, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { LocalStorageService } from '../shared/local-storage.service';
import {PageEvent, MatSnackBar} from '@angular/material';
import { GLobalErrorService } from '../shared/global-error.service';

@Component({
  selector: 'app-merchants',
  templateUrl: './merchants.component.html',
  styleUrls: ['./merchants.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MerchantsComponent implements OnInit {
  // currentIndex = 0;
  loaderImage = 'assets/images/loader-new.gif';
  merchants;
  isLoading = true;
  isDeleting = false;
  countArray = [];
  last_id = '';
  token = localStorage.getItem('token');
  params;
  pageDetail = [];
  currentPage = 1;
  modalRef: BsModalRef;

  // MatPaginator Inputs
  length = 0;
  pageSize = 6;
  // pageSizeOptions: number[] = [6, 25, 50];

  // MatPaginator Output
  pageEvent: PageEvent;
  deleteMerchnat;
  totalPages = [];
  constructor(private merchantService: MerchantService,
              private snackBar: MatSnackBar,
              private modalService: BsModalService,
              private globalErrorService: GLobalErrorService
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
            // this.length = response.data.count;
            for (this.length = 0; this.length < response.data.numPages; this.length ++) {
              this.totalPages.push(this.length);
            }

          } else {
            // navigate to error page
            this.isLoading = false;
            console.log(response);
            this.globalErrorService.errorOccured(response);
          }
        },
        (error) => {
          console.log('error!!', error);
          this.isLoading = false;
          this.globalErrorService.errorOccured(error);
        });
  }


  info(merchant) {
    this.merchantService.setMerchant(merchant);
  }

  // changePage(event) {

  //   // if (event.pageIndex > this.currentIndex) {
  //   //   this.currentIndex = event.pageIndex;
  //   //   // console.log(this.currentIndex);
  //   //   this.params = {
  //   //       token: this.token,
  //   //       last_id: this.merchants[this.merchants.length - 1].merchant_id,
  //   //       pre_id : ''
  //   //       // limit: event.pageSize
  //   //   };
  //   // } else  {
  //     // console.log(this.currentIndex);
  //     // this.currentIndex = event.pageIndex;
  //     this.params = {
  //       token: this.token,
  //       last_id: '',
  //       pre_id : '',
  //       page_no : event.pageIndex + 1
  //       // limit: event.pageSize
  //   };
  //   // }
  //     // if (event.pageIndex === 0) {
  //     //   // first page
  //     //   this.params = {
  //     //     token: this.token,
  //     //     last_id: '',
  //     //     // limit: event.pageSize
  //     //   };
  //     // } else {
  //     //   const result = this.pageDetail.filter(val => val.pageIndex === event.pageIndex - 1);
  //     //   if (result.length === 0) {
  //     //       // getting data after current
  //     //       this.params = {
  //     //         token: this.token,
  //     //         last_id: this.current['last_Id'],
  //     //         // limit: event.pageSize
  //     //       };
  //     //   } else {
  //     //     this.params = {
  //     //       token: this.token,
  //     //       last_id: result[0].last_Id,
  //     //       // limit: event.pageSize
  //     //     };
  //     //   }
  //     // }

  //     this.merchantService.getMerchants(this.params)
  //     .subscribe(
  //     (response) => {
  //       if (response.success === 200) {
  //         this.isLoading = false;
  //         this.merchants = response.data.rows;

  //         // updating current page
  //         // this.current = {
  //         //   pageIndex : event.pageIndex,
  //         //   last_Id : this.merchants[this.merchants.length - 1 ].merchant_id
  //         // };
  //       } else {
  //         // navigate to error page
  //         this.isLoading = false;
  //         console.log(response);
  //         this.snackBar.open('Something went wrong, please try again later!', 'Dismiss', {
  //           duration: 5000,
  //         });
  //       }
  //     },
  //     (error) => {
  //       console.log('error!!', error);
  //       this.isLoading = false;
  //       this.snackBar.open('Something went wrong, please try again later!', 'Dismiss', {
  //         duration: 5000,
  //       });
  //     });
  //     return event;
  // }

  openModal(template: TemplateRef<any>, name) {
    this.modalRef = this.modalService.show(template);
    this.deleteMerchnat = name;
  }

  deleteMerchant(id) {
    this.isDeleting = true;
    this.merchantService.deleteMerchant(id).subscribe(
      (response) => {
        this.isDeleting = false;
        this.modalRef.hide();
        this.isLoading = true;
            if (response.success === 200) {
              const data = {
                token: this.token,
                last_id: '',
                pre_id : '',
                page_no: this.currentPage
              };

              this.merchantService.getMerchants(data)
                .subscribe(
                  (responseData) => {
                    this.deleteMerchnat = '';

                    if (responseData.success === 200) {
                      this.isLoading = false;
                      this.merchants = responseData.data.rows;
                      this.length = responseData.data.count;
                    } else {
                      this.isLoading = false;
                      this.globalErrorService.errorOccured(response);
                    }
                  },
                  (error) => {
                    console.log('error!!', error);
                    this.isLoading = false;
                    this.globalErrorService.errorOccured(error);
                  });
            } else {
              console.log(response.output.payload.message);
              this.globalErrorService.errorOccured(response);
            }
      }, (error) => {
          console.log('error!!', error);
          this.isLoading = false;
          this.globalErrorService.errorOccured(error);
      }
    );
  }
  // next prev current page

  next() {
    if (this.currentPage < this.totalPages.length ) {
      this.currentPage = this.currentPage + 1;
      const data = {
          token: this.token,
          last_id: '',
          pre_id : '',
          page_no : this.currentPage
      };
      this.isLoading = true;
      this.getAllMerchants(data);
    }


  }

  prev() {
    if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        const data = {
            token: this.token,
            last_id: '',
            pre_id : '',
            page_no : this.currentPage
        };
        this.isLoading = true;
        this.getAllMerchants(data);
    }

  }

  changePage(page_no) {
    this.currentPage = page_no;
    const data = {
        token: this.token,
        last_id: '',
        pre_id : '',
        page_no : this.currentPage
    };
    this.isLoading = true;
    this.getAllMerchants(data);
  }
  getAllMerchants(data) {

    this.merchantService.getMerchants(data)
        .subscribe(
          (responseData) => {
            this.isLoading = false;
            if (responseData.success === 200) {
              this.isLoading = false;
              this.merchants = responseData.data.rows;
              this.length = responseData.data.count;
            } else {
              this.isLoading = false;
              this.globalErrorService.errorOccured(responseData);
            }
          },
          (error) => {
            console.log('error!!', error);
            this.isLoading = false;
            this.globalErrorService.errorOccured(error);
          });
    }
}
