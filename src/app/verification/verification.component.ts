import { Component, OnInit, ViewChild, ElementRef, NgZone, Inject, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MerchantAuthService } from '../merchant-auth/merchant-auth.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { LocalStorageService } from '../shared/local-storage.service';
import { MapsAPILoader } from '@agm/core';
import { MerchantService } from '../merchants/merchants.service';
import * as _ from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {
  isLoading = false;
  modalRef: BsModalRef;
  stepperTwo = true;
  stepperThree = false;
  stepperFour = false;
  stepperFive = false;
  // stepperFive = false;
  showErrorMsg = false;
  postSubmit = false;
  error = '';
  ErrorMsg = '';
  displayImageLicence = 'assets/images/upload.png';
  displayImagePan = 'assets/images/upload.png';
  displayImageGst = 'assets/images/upload.png';
  displayImage = 'assets/images/upload.png';
  displayImageMerchant = 'assets/images/profile-pic.png';

  // images
  imgLicence;
  imgLicenceArray = [];
  imgPan;
  imgGst;
  imgDoc;
  imgDocArray = [];
  imgMerchant;

  // location
  @ViewChild('search') public searchElement: ElementRef;
  lat;
  lng;
  place;
  altitude;
  DataPlan;
  constructor(
    public snackBar: MatSnackBar,
    private merchantAuthService: MerchantAuthService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private merchantsService: MerchantService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user-data'));
    const newUser = JSON.parse(localStorage.getItem('new-merchant'));
    const doc = JSON.parse(localStorage.getItem('doc'));

    if (newUser !== null || user !== null) {
      if (user !== null) {

        if (user.merchant_display_name === '') {

          this.stepperTwo = false;
          this.stepperThree = true;
          this.stepperFour = false;
          // location
          this.mapsAPILoader.load().then(
            () => {

              const autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {});
              autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                  const place: google.maps.places.PlaceResult = autocomplete.getPlace();
                  if (place.geometry === undefined || place.geometry === null) {
                    return;
                  }
                  this.lat = JSON.stringify(place.geometry.location.lat());
                  this.lng = JSON.stringify(place.geometry.location.lng());
                  this.place = place.formatted_address;

                  const location = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};

                  const elevator = new google.maps.ElevationService;
                   this.displayLocationElevation(location, elevator).then(alt => {
                     this.altitude =  alt;
                   });
                });
              });
            }
          );
        // } else if (doc !== null) {
          // console.log('here3');
          // this.router.navigate(['/']);
        } else if (user.documents === 0 || user.documents === undefined) {

          this.stepperTwo = false;
          this.stepperThree = false;
          this.stepperFour = false;
          this.stepperFive = true;
        }


      } else {

        this.stepperTwo = true;
        this.stepperThree = false;
        this.stepperFive = false;
        this.stepperFour = false;
      }
    } else {
      this.router.navigate(['/merchant/auth']);
    }


    // this.merchantAuthService.currentView.subscribe(
    //   (response) => {
    //       if (response === 0 ) {
    //         this.stepperTwo = true;
    //         this.stepperThree = false;
    //         this.stepperFour = false;
    //       } else if (response === 1) {
    //         this.stepperTwo = false;
    //         this.stepperThree = false;
    //         this.stepperFour = true;
    //       }
    //   }, (error) => {
    //     console.log(error);
    //     this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
    //       duration: 5000,
    //     });
    //   }
    // );

  }

  onMerchantFileChange(file: FileList) {
    if (file.length === 0) {
      this.displayImageMerchant = 'assets/images/profile-pic.png';
    } else {
      this.imgMerchant = file.item(0);
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.displayImageMerchant = event.target.result;
      };
      reader.readAsDataURL(this.imgMerchant);
    }
  }


  onFileChange(file: FileList, index) {
    if (index === 1) {
      if (file.length === 0) {
        this.displayImageLicence = 'assets/images/upload.png';
      } else {
        this.imgLicenceArray = [];
        this.imgLicence = file.item(0);
        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.displayImageLicence = event.target.result;
        };

        const filesIndex = _.range(file.length);

        // if (this.imgLicenceArray.length < 2) {

          _.each(filesIndex, (idx) => {
            if (idx < 2) {
            this.imgLicenceArray.push(file[idx]);
            }
          }
          );
        // }

        reader.readAsDataURL(this.imgLicence);
      }

    } else if (index === 3) {
      if (file.length === 0) {
        this.displayImageGst = 'assets/images/upload.png';
      } else {
        this.imgGst = file.item(0);
        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.displayImageGst = event.target.result;
        };
        reader.readAsDataURL(this.imgGst);
      }

    } else if (index === 2) {
      if (file.length === 0) {
        this.displayImagePan = 'assets/images/upload.png';
      } else {
        this.imgPan = file.item(0);
        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.displayImagePan = event.target.result;
        };
        reader.readAsDataURL(this.imgPan);
      }
    } else if (index === 4) {
      if (file.length === 0) {
        this.displayImage = 'assets/images/upload.png';
      } else {
        this.imgDoc = file.item(0);
        this.imgDocArray = [];
        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.displayImage = event.target.result;
        };
        const filesIndex = _.range(file.length);
        // if (this.imgDocArray.length < 4) {
          console.log(this.imgDocArray.length, 'Doc');
          _.each(filesIndex, (idx) => {
            if (idx < 4) {
            this.imgDocArray.push(file[idx]);
            }
          }
          );
        // }

        // _.each(filesIndex, (idx) => {
        //   this.imgDocArray.push(file[idx]);
        // }
        // );


        reader.readAsDataURL(this.imgDoc);
      }
    }


  }


  submitPin(form: NgForm) {

    const storedPin = localStorage.getItem('pin');
    if (JSON.parse(form.value.pin) === JSON.parse(storedPin)) {

      const data = JSON.parse(localStorage.getItem('new-merchant'));

      if (data.email !== '' && data.email !== null ) {
        this.merchantAuthService.signup(data)
        .subscribe(
          (response) => {

            if (response.success === 200) {
              // this.router.navigate(['/verify']);
              this.stepperTwo = false;
              this.stepperThree = true;
              form.reset();
              localStorage.clear();
              this.localStorageService.set('token', response.data.token);
              this.localStorageService.set('user-data', response.data);

              // location
              this.mapsAPILoader.load().then(
                () => {

                  const autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {});
                  autocomplete.addListener('place_changed', () => {
                    this.ngZone.run(() => {
                      const place: google.maps.places.PlaceResult = autocomplete.getPlace();
                      if (place.geometry === undefined || place.geometry === null) {
                        return;
                      }
                      this.lat = JSON.stringify(place.geometry.location.lat());
                      this.lng = JSON.stringify(place.geometry.location.lng());
                      this.place = place.formatted_address;

                      const location = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};

                      const elevator = new google.maps.ElevationService;
                       this.displayLocationElevation(location, elevator).then(alt => {
                         this.altitude =  alt;
                       });
                    });
                  });
                }
              );


            } else if (response.output.statusCode === 1102) {
              this.router.navigate(['/merchant/auth']);
              this.snackBar.open('Phone Number Already Registered!', 'Dismiss', {
                duration: 5000,
              });
            } else {
              // this.postSubmit = true;
              // this.error = response.output.payload.message;
              console.log(response.output.payload.message);
              this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
                duration: 5000,
              });
            }
          },
          (error) => {
            console.log('error', error);
            this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
              duration: 5000,
            });
          }
        );
      } else {
        localStorage.clear();
        this.router.navigate(['/merchant/auth']);
        form.reset();
      }

    } else {
      this.showErrorMsg = true;
      this.ErrorMsg = 'Enter Valid PIN!';
    }
  }

  resendPin() {
    const data = JSON.parse(localStorage.getItem('new-merchant'));
    if (data === null) {
      this.router.navigate(['/merchant/auth']);
      localStorage.clear();
    }
    this.merchantAuthService.sendPin(data.phoneNumber).subscribe(
      (response) => {
        if (response.success === 200) {
          this.localStorageService.set('pin', response.data);
        } else {
          console.log(response);
          this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
            duration: 5000,
          });
        }
      }, (error) => {
        console.log(error);
        this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
          duration: 5000,
        });
      }
    );
  }



  // Docmument Page form

  submitDocs(form: NgForm) {

    if (form.status === 'INVALID') {
      this.postSubmit = true;
      this.error = 'Mandatory Parameter Missing!';
    } else if (this.imgPan === undefined || this.imgPan === '' ||
      this.imgLicence === undefined || this.imgLicence === '') {
      this.postSubmit = true;
      this.error = 'Mandatory Parameter Missing!!!';
    } else {
      this.postSubmit = false;

      if (form.value.gst !== '' && this.imgGst !== undefined ||
        form.value.gst === '' && this.imgGst === undefined) {

        const data = {
          form: form.value,
          gstImage: this.imgGst,
          imgLicence: this.imgLicenceArray,
          imgPan: this.imgPan,
          doc: this.imgDocArray
        };
        this.isLoading = true;
        // Post request to store user data
        this.merchantsService.uploadDocuments(data)
          .subscribe(
            (response) => {
              if (response.success === 200) {

                this.localStorageService.set('doc', response.data);
                form.reset();
                this.imgDocArray = [];
                this.imgLicenceArray = [];
                this.displayImageLicence = 'assets/images/upload.png';
                this.displayImagePan = 'assets/images/upload.png';
                this.displayImageGst = 'assets/images/upload.png';
                this.displayImage = 'assets/images/upload.png';
                this.stepperFour = false;
                this.router.navigate(['/']);
              } else {
                this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
                  duration: 5000,
                });

                console.log(response.output.payload.message);
              }

            },
            (error) => {
              // handle all error cases
              console.log(error);
              this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
                duration: 5000,
              });
            }
          );

    } else {

        this.postSubmit = true;
        this.error = 'Add Both GST number as well as image';
      }

    }
  }

  addMerchantData(form: NgForm) {

    if (form.status === 'INVALID') {
      this.postSubmit = true;
      this.error = 'Mandatory Parameter Missing!';
    } else {
      this.postSubmit = false;


      const data = {
        form: form.value,
        place: this.place,
        lat: this.lat,
        lng: this.lng,
        altitude: this.altitude,
        image: this.imgMerchant,
        merchantID: JSON.parse(localStorage.getItem('user-data')).merchant_id
      };

      // Post request to store user data
      this.merchantsService.editMerchant(data)
        .subscribe(
          (response) => {
            if (response.success === 200) {

              this.localStorageService.set('user-data', response.data);
              form.reset();
              this.displayImageMerchant = 'assets/images/profile-pic.png';
              this.stepperThree = false;
              this.stepperFour = true;
              // stepper handle here
            } else {
              this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
                duration: 5000,
              });
              console.log(response.output.payload.message);
            }

          },
          (error) => {
            // handle all error cases
            console.log(error);
            this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
              duration: 5000,
            });
          }
        );
    }
  }

  planSelected(option) {

      if (option === 1) {
          this.DataPlan = 'FREELISTING';
      } else if (option === 2) {
          this.DataPlan = 'ONLINE';
      } else if (option === 3) {
          this.DataPlan = 'INSTORE';
      } else if (option === 4) {
          this.DataPlan = 'ONLINE/INSTORE';
      }

      this.merchantsService.editMerchantPlans(this.DataPlan).subscribe(
        (response) => {
            if (response.success === 200 ) {
              this.stepperFour = false;
              this.stepperFive = true;
              this.localStorageService.set('plan-selected', true);
            } else {
              console.log(response);
              this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
                duration: 5000,
              });
            }
        }, (error) => {
            console.log(error);
            this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
              duration: 5000,
            });
        }
      );
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  displayLocationElevation(loc, elevator2) {
    return new Promise ((resolve, reject) => {
        return elevator2.getElevationForLocations({
          'locations': [loc]
        }, function(results, status) {
          resolve(results[0].elevation);
        });
    });

  }

}
