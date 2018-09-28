import { Component, OnInit, Output, EventEmitter, TemplateRef, ViewEncapsulation } from '@angular/core';
import { PageChangedEvent, BsModalRef, BsModalService } from 'ngx-bootstrap';
import {PageEvent, MatSnackBar} from '@angular/material';
import { GLobalErrorService } from '../shared/global-error.service';
import { InternetService } from '../shared/internet-connection.service';
import { PlacesService } from './places.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PlaceComponent implements OnInit {
  // currentIndex = 0;
  loaderImage = 'assets/images/loader-new.gif';

  isLoading = true;
  isDeleting = false;
  countArray = [];
  last_id = '';
  token = localStorage.getItem('token');
  params;
  pageDetail = [];
  currentPage = 1;

  modalRef: BsModalRef;

  //=========idhar se npat ====
  words

  Word
  Name
  Language
  //==============

  // MatPaginator Inputs
  length = 0;
  pageSize = 6;

  fileName;
  // pageSizeOptions: number[] = [6, 25, 50];

  // MatPaginator Output
  pageEvent: PageEvent;
  deleteMerchnat;
  totalPages = [];
  firstPage = 1;
  totalNumPages;


  NoInternet = false;
  constructor(private placesService: PlacesService,
              private snackBar: MatSnackBar,
              private modalService: BsModalService,
              private globalErrorService: GLobalErrorService,
              private internetService: InternetService
            ) { }


  ngOnInit() {
    this.NoInternet = (this.internetService.InternetConnection === true) ? false : true;

    localStorage.removeItem('merchant-data');
    const data = {
      token: this.token,
      last_id: '',
      pre_id : '',
      page_no: ''
    };

    if (this.NoInternet === false) {

    this.placesService.getPlaces(data)
      .subscribe(
        (response) => {
          if (response.success === 1) {
            this.isLoading = false;
            this.words = response.data;

            this.totalNumPages = response.numPages;
            if (this.totalNumPages < 5) {
              for (this.length = 0; this.length < this.totalNumPages; this.length ++) {
                this.totalPages.push(this.length);
              }
            } else {
              for (this.length = 0; this.length < 5; this.length ++) {
                this.totalPages.push(this.length);
              }
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
      } else {
        this.isLoading = false;
      }
  }

  openModal(template: TemplateRef<any>, name) {
    this.modalRef = this.modalService.show(template);
    this.deleteMerchnat = name;
    // console.log(this.deleteMerchnat);
  }

  addPlace(form : NgForm) {
    console.log(form);
    const body = {
      "language" : form.value.language ,
      "word" :  form.value.word,
      "name" :  form.value.name
    }
    this.placesService.addPlace(body).subscribe(
      (response) =>{
        console.log(response);
        const data = {
          page_no: ''
        };
    
        this.modalRef.hide();
        this.getwords(data);
      },
      (error) =>{
        console.log(error , "error aya hai");

      }
    );
  }

  getwords(data) {    
    this.placesService.getPlaces(data)
      .subscribe(
        (response) => {
          if (response.success === 1) {
            this.isLoading = false;
            this.words = response.data;
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


  onFileChange(file: FileList) {
    this.fileName = file.item(0);
    const reader = new FileReader();
    console.log(this.fileName , "afasfsf");

}

    //adding csv file

    addCsvFilefn(form : NgForm){
      console.log(form);
      const data = {
        form: form.value,
        file: this.fileName,
      };
      this.placesService.addCsvPlace(data).subscribe(
        (response) =>{
          if (response.success === 1) {
            this.isLoading = false;
            const data = {
              page_no: ''
            };
        
            this.modalRef.hide();
            this.getwords(data);
  
          } else {
            // navigate to error page
            this.isLoading = false;
            console.log(response);
            this.globalErrorService.errorOccured(response);
          }
  
        },
        (error) =>{
          console.log(error , "error aya hai");
  
        }
      );
    }
  
   
  
  
    deleteWord(id) {
  
      console.log("this.deleteMerchnat");
      console.log(id);
      //this.NoInternet = (this.internetService.InternetConnection === true) ? false : true;
      // console.log(this.NoInternet , 'no internet');
      if (this.NoInternet === false) {
  
  
        this.placesService.deleteWord(id).subscribe(
          (response) =>{
            if (response.success === 1) {
              this.isLoading = false;
              const data = {
                page_no: this.currentPage
              };
          
              this.modalRef.hide();
              this.getwords(data);
    
            } else {
              // navigate to error page
              this.isLoading = false;
              console.log(response);
              this.globalErrorService.errorOccured(response);
            }
    
          },
          (error) =>{
            console.log(error , "error aya hai");
    
          }
        );
      }
  
    }



    // next prev current page

    next(currentPage) {
      this.NoInternet = (window.navigator.onLine === true) ? false : true;
      if (this.NoInternet === false) {
        console.log("afsdfgsddgsdg", this.totalNumPages);
        console.log(this.totalPages);
        console.log("eeeeeeeeeeeeeeeeessss");
        console.log(this.currentPage);
          if (this.currentPage - 1 === this.totalPages[4]) {
              this.totalPages.push(this.totalPages[4] + 1);
              this.totalPages.push(this.totalPages[4] + 2);
              this.totalPages.splice(0, 2);
              console.log("dddddddddddd");
              console.log(this.totalPages);
  
              const data = {
                  page_no : this.currentPage
              };
               this.getwords(data);
          
          }
          else {
            if (this.currentPage < this.totalNumPages ) {
              console.log("else if part hai");
              this.currentPage = this.currentPage + 1;
              console.log("hfdusfadfajsvffvflg")
              console.log(this.currentPage);
              const data = {
                page_no : this.currentPage
            };
              this.isLoading = true;
              this.getwords(data);
            }
          }
     }
  
  
  
    }
  
    prev(currentPage) {
      this.NoInternet = (window.navigator.onLine === true) ? false : true;
      if (this.NoInternet === false) {
        if (this.currentPage - 1 === this.totalPages[0]) {
          this.totalPages.splice(3, 2);
          this.totalPages.splice(0, 0, this.totalPages[0] - 2);
          this.totalPages.splice(1, 0, this.totalPages[0] + 1);
  
  
  
            if (this.currentPage > 1) {
              this.currentPage = this.currentPage - 1;
              const data = {
                  page_no : this.currentPage
              };
              this.isLoading = true;
              this.getwords(data);
          }
        } else {
          if (this.currentPage > 1) {
            this.currentPage = this.currentPage - 1;
            const data = {
                page_no : this.currentPage
            };
            this.isLoading = true;
            this.getwords(data);
          }
        }
      }
    }
  
    changePage(page_no) {
      this.NoInternet = (window.navigator.onLine === true) ? false : true;
      if (this.NoInternet === false) {
        this.currentPage = page_no;
        const data = {
            page_no : this.currentPage
        };
        this.isLoading = true;
        this.getwords(data);
      }
    }


}
