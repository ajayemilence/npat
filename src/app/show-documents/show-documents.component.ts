import { Component, OnInit, TemplateRef } from '@angular/core';
import { MerchantService } from '../merchants/merchants.service';
import { MatSnackBar } from '@angular/material';
import { GlobalService } from '../shared/global.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';
import { ɵPRE_STYLE } from '@angular/animations';

@Component({
  selector: 'app-show-documents',
  templateUrl: './show-documents.component.html',
  styleUrls: ['./show-documents.component.css']
})
export class ShowDocumentsComponent implements OnInit {
merchantId;
isLoading = true;
documents;
PanNumber;
PanImage;
LicenceNumber;
LicenceImageOne;
LicenceImageTwo;
GstNumber;
GstImage;
AdditionalImage = [];
displayImage = 'assets/images/camera-icon.gif';
ImagePath;
showLicenceImage;
DocumentsStatus = true;
// zooming Image
ZoomImage;
ZoomImageAlt;
OpenOverlay = false;

modalRef: BsModalRef;
ModalHeader;
ModalInputFieldTitle;
ModalInputField;
ModalImages = [];
DeleteModalImages = [];
changedImage = [];

postSubmit = false;
error = '';
editing = 0; // 1 :Licence, 2 Pan, 3 GST, 4 Additional
newDoc = [];
deleteDoc = [];


// for Admin
EditEnable = false;
  constructor(private merchantService: MerchantService,
              private snackbar: MatSnackBar,
              private globalService: GlobalService,
              private router: Router,
              private modalService: BsModalService
            ) { }

  ngOnInit() {


    const user = JSON.parse(localStorage.getItem('user-data'));
    if (user.merchant_id !== undefined) {
        this.merchantId = user.merchant_id;
        this.reloading(this.merchantId);
    } else {
      this.EditEnable = true;
      const merchant_id = localStorage.getItem('merchant_id');
      if (merchant_id === null) {
        this.router.navigate(['/merchants']);
      } else {
        this.merchantId = merchant_id;
        this.reloading(this.merchantId);
        localStorage.removeItem('merchant_id');
      }
    }
  }

  changeImage(value) {
    this.isLoading = true;
    setInterval(() => {
      this.isLoading = false;
    }, 1000);
      if (value === 1) {
        this.showLicenceImage = this.LicenceImageOne;
      } else if (value === 2) {
        this.showLicenceImage = this.LicenceImageTwo;
      }
  }


  showImage(value, index) {
    this.OpenOverlay = true;
    if (value === 1) {
      this.ZoomImageAlt = 'Licence Proof Image';
      this.ZoomImage = this.showLicenceImage;
    } else if (value === 2) {
      this.ZoomImage = this.PanImage;
      this.ZoomImageAlt = 'Pan Proof Image';
    } else if (value === 3) {
      this.ZoomImage = this.GstImage;
      this.ZoomImageAlt = 'GST Proof Image';
    } else if (value === 4 && index !== undefined) {
      this.ZoomImage = this.ImagePath +  this.AdditionalImage[index];
      this.ZoomImageAlt = 'Additional Document Image';
    }
  }

  off() {
    this.OpenOverlay = false;
  }


  openModal(template: TemplateRef<any>, value) {
    // value 1 : Edit Licence Image, 2 Pan, 3 GST, 4 Additional
    this.ModalImages = [];
    this.changedImage = [];
    this.DeleteModalImages = [];
    this.postSubmit = false;

    if (value === 1) {
      this.editing = 1;
      this.ModalHeader = 'Edit Licence Documents';
      this.ModalInputFieldTitle = 'Licence Number:';
      if (this.LicenceImageOne === undefined) {
        this.ModalImages.push(this.displayImage);
      } else {
        this.ModalImages.push(this.LicenceImageOne);
      }
      this.ModalInputField = this.LicenceNumber;


      if (this.LicenceImageTwo === undefined) {
        this.ModalImages.push(this.displayImage);
      } else {
        this.ModalImages.push(this.LicenceImageTwo);
      }
    } else if (value === 2) {
      this.editing = 2;
      this.ModalHeader = 'Edit Pan Card Detail';
      this.ModalInputFieldTitle = 'Pan Number:';
      this.ModalInputField = this.PanNumber;


      if (this.PanImage === undefined) {
        this.ModalImages.push(this.displayImage);
      } else {
        this.ModalImages.push(this.PanImage);
      }
    } else if (value === 3) {
      this.editing = 3;
      this.ModalHeader = 'Edit GST Document';
      this.ModalInputFieldTitle = 'GST Number:';
      this.ModalInputField = this.GstNumber;

      if (this.GstImage === undefined) {
        this.ModalImages.push(this.displayImage);
      } else {
        this.ModalImages.push(this.GstImage);
      }
    } else if (value === 4) {
      this.editing = 4;
      this.ModalHeader = 'Edit Additional Documents';
      this.ModalInputFieldTitle = '';
      this.ModalInputField = '';
      if (this.AdditionalImage.length === 0) {
        this.ModalImages.push(this.displayImage, this.displayImage, this.displayImage, this.displayImage);
      } else {
        this.AdditionalImage.forEach(img => {
          this.ModalImages.push(this.ImagePath + img);
        });

          if (this.ModalImages.length < 4) {
              if (this.ModalImages.length === 1) {
                this.ModalImages.push(this.displayImage, this.displayImage, this.displayImage);
              } else if (this.ModalImages.length === 2) {
                this.ModalImages.push(this.displayImage, this.displayImage);
              } else if (this.ModalImages.length === 3) {
                this.ModalImages.push(this.displayImage);
              }
          }
        }


    }
    this.modalRef = this.modalService.show(template);
  }

  onFileChange(file: FileList, index) {
    const obj = {
      type: this.editing,
      index : index,
      file : file.item(0)
    };
    const getIndex = this.changedImage.findIndex(val => val.index === index );

    if (getIndex < 0) {
      this.changedImage.push(obj);
    } else if (getIndex > -1) {
      this.changedImage[index] = obj;
    }

    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.ModalImages[index] = event.target.result;
    };
    reader.readAsDataURL( file.item(0));

  }

  // deleteImage(index) {
  //   if (this.ModalImages[index].includes('https://s3.us-east-2.amazonaws.com/swift-spar-local/delivery_app/')) {
  //     this.DeleteModalImages.push(this.ModalImages[index]);
  //   }
  //   this.ModalImages[index] = this.displayImage;
  // }
  save(form: NgForm) {

    if (form.valid === false) {
      // invalid input
      this.postSubmit = true;
      this.error = 'Mandatory Field Missing!';
    } else {
      // valid  form
      // if (this.documents.length > 0) {

        this.newDoc = [];
        this.deleteDoc = [];

        if (this.editing === 4) {

          if (this.changedImage.length === 0) {
            this.newDoc = [];
            this.deleteDoc = [];
          } else {

            this.changedImage.forEach(image => {
                const imageArray = JSON.parse(this.documents.additional_image);
                this.newDoc.push(image.file);
                const imageDeleted = imageArray[image.index];
                this.deleteDoc.push(imageDeleted);
            });
          }
        }

        if (this.editing === 1) {
          if (this.changedImage.length === 0) {
            this.newDoc = [];
            this.deleteDoc = [];
          } else {
            this.changedImage.forEach(image => {
                if (this.documents.merchant_licence_image !== '') {
                    const imageArray = JSON.parse(this.documents.merchant_licence_image);
                    this.newDoc.push(image.file);
                    const imageDeleted = imageArray[image.index];
                    this.deleteDoc.push(imageDeleted);
                }

            });
          }
        }


        const data = {
          docId: this.documents.merchant_docment_id,
          panId: (this.editing === 2) ? this.ModalInputField : '',
          gstId: (this.editing === 3) ? this.ModalInputField : '',
          licenceId: (this.editing === 1) ? this.ModalInputField : '',
          imgPan: (this.editing === 2) ? ((this.changedImage.length === 0) ? '' : this.changedImage[0]).file : '',
          gstImage: (this.editing === 3) ? ((this.changedImage.length === 0) ? '' : this.changedImage[0]).file : '',
          imgLicence: (this.editing === 1) ? ((this.newDoc.length === 0) ? undefined : this.newDoc) : undefined,
          deleteLicenceImage: (this.editing === 1) ? (this.deleteDoc.length === 0) ? '' : this.deleteDoc : '',
          doc: (this.editing === 4) ? ((this.newDoc.length === 0) ? undefined : this.newDoc) : undefined,
          deleteDoc: (this.editing === 4) ? (this.deleteDoc.length === 0) ? '' : this.deleteDoc : ''
        };


        this.merchantService.EditMerchantDocument(data).subscribe(
          (response) => {
            console.log(response);
            if (response.success === 200) {
                this.modalRef.hide();
                form.reset();
                this.ModalHeader = '';
                this.ModalInputFieldTitle = '';
                this.ModalInputField = '';
                this.ModalImages = [];
                this.changedImage = [];
                this.postSubmit = false;
                this.editing = 0; // 1 :Licence, 2 Pan, 3 GST, 4 Additional
                this.newDoc = [];
                this.deleteDoc = [];
                this.reloading(this.merchantId);
                this.isLoading = true;
            } else {
              console.log(response.output.payload.message);
              this.snackbar.open('Somethimg went wrong, please try again later', 'Dismiss', {duration: 5000});
            }
          }, (error) => {
            console.log(error);
            this.snackbar.open('Somethimg went wrong, please try again later', 'Dismiss', {duration: 5000});
          }
        );

        // ---------------------------------------------------
      // } else if (this.documents.length === 0) {
      //   console.log('in else part');
      //   this.newDoc = [];

      //   if (this.editing === 4) {

      //     if (this.changedImage.length === 0) {
      //       this.newDoc = [];
      //     } else {

      //       this.changedImage.forEach(image => {
      //           this.newDoc.push(image.file);
      //       });
      //     }
      //   }

      //   if (this.editing === 1) {
      //     if (this.changedImage.length === 0) {
      //       this.newDoc = [];
      //     } else {
      //       this.changedImage.forEach(image => {
      //         this.newDoc.push(image.file);
      //       });
      //     }
      //   }
      //   const data = {
      //     panId: (this.editing === 2) ? this.ModalInputField : '',
      //     gstId: (this.editing === 3) ? this.ModalInputField : '',
      //     licenceId: (this.editing === 1) ? this.ModalInputField : '',
      //     imgPan: (this.editing === 2) ? ((this.changedImage.length === 0) ? '' : this.changedImage[0]).file : '',
      //     gstImage: (this.editing === 3) ? ((this.changedImage.length === 0) ? '' : this.changedImage[0]).file : '',
      //     imgLicence: (this.editing === 1) ? this.newDoc : undefined,
      //     doc: (this.editing === 4) ? this.newDoc : undefined,
      //   };

      //   console.log('------------------------', data);
      // }
    }
  }


  reloading(mercantId) {
    this.merchantService.getMerchantDocuments(mercantId).subscribe(
      (response) => {
          if (response.success === 200) {
             this.documents = response.data;
             console.log(this.documents);
             if (this.documents.length < 1) {
                this.DocumentsStatus = false;
                this.isLoading = false;
             } else {
                setInterval(() => {
                  this.isLoading = false;
                }, 1500);
                this.DocumentsStatus = true;
                this.ImagePath = this.globalService.ImagePath;
                this.LicenceNumber = this.documents.merchant_licence_id.toUpperCase();
                this.PanNumber = this.documents.merchant_pan_id.toUpperCase();
                this.GstNumber = this.documents.merchant_gst_id.toUpperCase();
                const images = JSON.parse(this.documents.merchant_licence_image);
                this.LicenceImageOne = this.ImagePath + images[0];
                this.showLicenceImage = this.LicenceImageOne;
                this.LicenceImageTwo = (images[1] === undefined) ? undefined : this.ImagePath + images[1];

                this.PanImage = this.ImagePath + this.documents.merchant_pan_image;
                if (this.GstNumber !== '') {
                 this.GstImage = this.ImagePath + this.documents.merchant_gst_image;
                }
                if (this.documents.additional_image !== '') {
                 this.AdditionalImage = JSON.parse(this.documents.additional_image);
                }
             }

          } else {
            console.log(response);
            this.snackbar.open('Something went wrong, please try again later!', 'Dismiss', {
              duration: 5000
            });
          }
      }, (error) => {
          console.log(error);
          this.snackbar.open('Something went wrong, please try again later!', 'Dismiss', {
              duration: 5000
          });
      }
    );
  }

  uploadDocuments(value, template) {
    this.openModal(template, value);
  }

  // deleteDocuments(index) {
  //   console.log(this.documents);
  //   console.log(index);
  // }
}
