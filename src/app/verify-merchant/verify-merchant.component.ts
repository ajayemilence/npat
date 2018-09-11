import { Component, OnInit, TemplateRef } from '@angular/core';
import { VerifyMerchantService } from './verify-merchant.service';
import { MatSnackBar } from '@angular/material';
import { GlobalService } from '../shared/global.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import * as _ from 'lodash';
import { GLobalErrorService } from '../shared/global-error.service';
@Component({
  selector: 'app-verify-merchant',
  templateUrl: './verify-merchant.component.html',
  styleUrls: ['./verify-merchant.component.css']
})
export class VerifyMerchantComponent implements OnInit {
merchants;
selectedMerchant;
displayImage = 'assets/images/upload.png';
licenceImageOne ;
licenceImageTwo ;
PanImage;
enlargeImageName ;
modalRef: BsModalRef;
gstExist = false;
GSTImage ;
addOne;
addTwo;
addThree;
addFour;
showviewmore = false;

DocumentsProvided = false;
  constructor(private verifyMerchantService: VerifyMerchantService,
              private snackBar: MatSnackBar,
              private globalService: GlobalService,
              private modalService: BsModalService,
              private globalErrorService: GLobalErrorService
            ) { }

  ngOnInit() {
      // this.merchants
      const data = '';
      this.getMerchantsToVerify(data, 0);
  }


  getMerchantDetail(index) {
    this.selectedMerchant = this.merchants[index];

    const documents = this.merchants[index].Documents;

    if (_.isEmpty(documents) === false) {

      this.DocumentsProvided = true;



      if (this.merchants[index].Documents.merchant_licence_image !== '') {
        const licenceImages = JSON.parse(this.merchants[index].Documents.merchant_licence_image);
        this.licenceImageOne = (licenceImages[0] === '' || licenceImages[0] === undefined)
                               ? this.displayImage : this.globalService.ImagePath + licenceImages[0];
        this.licenceImageTwo = (licenceImages[1] === ''  || licenceImages[1] === undefined)
                               ? this.displayImage : this.globalService.ImagePath + licenceImages[1];

      } else {
        this.licenceImageTwo = this.displayImage;
        this.licenceImageOne = this.displayImage;
        this.DocumentsProvided = false;
      }

      this.PanImage = (documents.merchant_pan_image === '') ?
                      this.displayImage :  this.globalService.ImagePath + documents.merchant_pan_image;

      this.GSTImage = (documents.merchant_gst_image === '') ? this.displayImage :
                      this.globalService.ImagePath + documents.merchant_gst_image;


      if (this.selectedMerchant.Documents.additional_image === '') {
        this.addOne = this.displayImage;
        this.addTwo = this.displayImage;
        this.addThree = this.displayImage;
        this.addFour = this.displayImage;
      } else {
        const docImages = JSON.parse(this.selectedMerchant.Documents.additional_image);
        this.addOne = (docImages[0] === undefined) ? this.displayImage : this.globalService.ImagePath + docImages[0];
        this.addTwo = (docImages[1] === undefined) ? this.displayImage : this.globalService.ImagePath + docImages[1];
        this.addThree = (docImages[2] === undefined) ? this.displayImage : this.globalService.ImagePath + docImages[2];
        this.addFour = (docImages[3] === undefined) ? this.displayImage : this.globalService.ImagePath + docImages[3];
      }
    } else {
      this.DocumentsProvided = false;

      this.licenceImageOne = this.displayImage;
      this.licenceImageTwo = this.displayImage;
      this.PanImage = this.displayImage;
      this.GSTImage = this.displayImage;
      this.addOne = this.displayImage;
      this.addTwo = this.displayImage;
      this.addThree = this.displayImage;
      this.addFour = this.displayImage;
    }


  }

  getMerchantsToVerify(data, status) { // status 1: reloading, 0: no reloading
    this.verifyMerchantService.getMerchants(data).subscribe(
      (response) => {
          if (response.success === 200) {

            if (response.data.length < 15 || response.data === undefined) {

              this.showviewmore = false;
            } else {
              this.showviewmore = true;
            }
            if (status === 1) {
              this.merchants = response.data;
            } else {
              if (this.merchants === undefined) {
                this.merchants = response.data;
              } else {
                this.merchants  = [...this.merchants, ...response.data];
              }
            }


          } else {
            console.log(response);
            this.globalErrorService.errorOccured(response);
          }
      }, (error) => {
        console.log(error);
        this.globalErrorService.errorOccured(error);
      }
    );
  }

  enlargeImage(imageName, Header, modal: TemplateRef<any>) {
    if (imageName !== this.displayImage) {
      this.modalRef = this.modalService.show(modal);
      this.enlargeImageName = imageName;

    }
  }


  viewmore() {
    const index = this.merchants[this.merchants.length - 1].merchant_id;
    this.getMerchantsToVerify(index, 0);
  }


  verifyMerchant(merchant) {
    this.verifyMerchantService.verifyMerchant(merchant.merchant_id).subscribe(
      (response) => {
        if (response.success === 200) {
          this.licenceImageOne = this.displayImage;
          this.licenceImageTwo = this.displayImage;
          this.PanImage = this.displayImage;
          this.GSTImage = this.displayImage;
          this.addOne = this.displayImage;
          this.addTwo = this.displayImage;
          this.addThree = this.displayImage;
          this.addFour = this.displayImage;

          const data = '';
          this.getMerchantsToVerify(data, 1);
          this.selectedMerchant = undefined;
          // this.snackBar.open('Merchant Approved Successfully!', 'Dismiss', {
          //   duration: 5000,
          // });
          this.globalErrorService.showSnackBar('Merchant Approved Successfully!');
        } else {
          console.log(response);
          this.globalErrorService.errorOccured(response);
        }
      }, (error) => {
        console.log(error);
        this.globalErrorService.errorOccured(error);
      }
    );
  }
}
