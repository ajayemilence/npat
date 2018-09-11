import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ElementRef, ViewChild, NgZone, HostListener } from '@angular/core';
import { LocalStorageService } from '../shared/local-storage.service';
import { NgForm } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import { MerchantAuthService } from './merchant-auth.service';
import { MatSnackBar } from '@angular/material';
import { GLobalErrorService } from '../shared/global-error.service';

@Component({
  selector: 'app-merchant-auth',
  templateUrl: './merchant-auth.component.html',
  styleUrls: ['./merchant-auth.component.css']
})
export class MerchantAuthComponent implements OnInit {
  logoImage = 'assets/images/app-logo.png';
  loaderImage = 'assets/images/loader-new.gif';
  newNumber = '';
  newPwd = '';
  newEmail = '';
  showRegister = false;
  showLogin = true;
  postSubmit = false;
  error;
  displayImage = 'assets/images/profile-pic.png';
  defaultType = 'PickUp Only';
  userImage: File = null;
  showMessage = false;
  message: string;
  showOption = true;
  @ViewChild('search') public searchElement: ElementRef;
  lat;
  lng;
  place;
  ErrorMsg = 'Enter Valid Email Address!';
  showErrorMsg;
  pwdErrorMsg = false;
  acceptInvalid = false;

  highlightInput = 0;
  emailInput = 0;
  passwordInput = 0;
  numberInput = 0;
  requestSent = false;
  NumMsg = 'Enter Valid Phone Number';
  numberInvalid = false;
  @HostListener('document:click', ['$event'])

  clickout(event) {
    if (this.newEmail.length === 0) {
      this.emailInput = 0;
    } else if (this.newNumber.length === 0) {
      this.numberInput = 0;
    } else if (this.newPwd.length === 0) {
      this.passwordInput = 0;
    }
  }

  constructor(private router: Router,
              private route: ActivatedRoute,
              private localStorageService: LocalStorageService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private merchantAuthService: MerchantAuthService,
              private el: ElementRef,
              private snackbar: MatSnackBar,
              private globalErrorSerice: GLobalErrorService
            ) { }


  ngOnInit() {

    // const newMerchant = JSON.parse(localStorage.getItem('new-merchant'));
    // if (newMerchant !== null) {
    //     this.newNumber = newMerchant.phoneNumber;
    //     this.newPwd = newMerchant.password;
    //     this.newEmail = newMerchant.email;
    //     this.showRegister = true;
    //     this.showLogin = false;
    //     this.postSubmit = false;
    // }

    this.highlightInput = 0;
    // if (this.searchElement !== undefined) {
    //   this.mapsAPILoader.load().then(
    //     () => {

    //      const autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {});
    //      autocomplete.addListener('place_changed', () => {
    //       this.ngZone.run(() => {
    //        const place: google.maps.places.PlaceResult = autocomplete.getPlace();
    //        if (place.geometry === undefined || place.geometry === null ) {
    //         return;
    //        }
    //        this.lat = JSON.stringify(place.geometry.location.lat());
    //        this.lng = JSON.stringify(place.geometry.location.lng());
    //        this.place = place.formatted_address;
    //       });
    //       });
    //     }
    //        );
    // }

  }


registerPage() {
  this.showRegister = true;
  this.showLogin = false;
  this.postSubmit = false;
  this.emailInput = 0;
  this.passwordInput = 0;
  this.numberInput = 0;
  this.newEmail = '';
  this.newNumber = '';
  this.newPwd = '';
  this.pwdErrorMsg = false;
  this.showErrorMsg = false;
  this.numberInvalid = false;
  this.acceptInvalid = false;
}

loginPage() {
  this.showRegister = false;
  this.showLogin = true;
  this.postSubmit = false;
  this.emailInput = 0;
  this.passwordInput = 0;
  this.numberInput = 0;
  this.newEmail = '';
  this.newNumber = '';
  this.newPwd = '';
  this.pwdErrorMsg = false;
  this.showErrorMsg = false;
  this.numberInvalid = false;
}



// Sign In
onSignin(form: NgForm) {

  if (form.valid === false) {
    if (form.form.controls.email.valid === false) {
      this.showErrorMsg = true;
    } else {
       this.showErrorMsg = false;
    }
    if (form.form.controls.password.valid === false) {
      this.pwdErrorMsg = true;
    } else {
      this.pwdErrorMsg = false;
    }
  } else {
    this.requestSent = true;
    this.showErrorMsg = false;
    this.pwdErrorMsg = false;
    this.merchantAuthService.signin(form.value).subscribe(
        (response) => {
          this.requestSent = false;
          // if response 2 verify account
          if (response.success === 200) {
           localStorage.clear();

            // // storing data in local storage
            this.localStorageService.set('token', response.data.token);
            this.localStorageService.set('user-data', response.data);

            form.reset();
            // navigating to profile
            if (response.data.documents === 0) {
              this.router.navigate(['/verify']);
              this.merchantAuthService.setAddDocRequest();
            } else {
              this.router.navigate(['/']);
            }

          } else {
            this.postSubmit = true;
            this.error = 'Invalid Email or Password';
            console.log('something went wrong!!', response.output.payload);
            this.globalErrorSerice.errorOccured(response);
          }
      },
        (error) => {
          console.log('error!!', error);
          this.postSubmit = true;
          this.error = 'Something went wrong, please try again later!';
          this.globalErrorSerice.errorOccured(error);
        }
      );
  }

}


// Register
onFileChange(file: FileList) {
  this.userImage = file.item(0);
  const reader = new FileReader();
  reader.onload = (event: any) => {
    this.displayImage = event.target.result;
  };
    reader.readAsDataURL(this.userImage);
}

onSignup(form: NgForm) {


  // if (this.showErrorMsg ===  true) {
  //   this.postSubmit = true;
  //   this.error = 'Email Already Registered, Choose Another One! ';
  // } else

  if (form.valid === false || this.showErrorMsg === true) {

    if (this.newNumber.toString().length === 10) {
        this.numberInvalid = false;
     } else {
        this.numberInvalid = true;
     }
     if (form.form.controls.email.valid === false ||  this.showErrorMsg === true) {
        this.showErrorMsg = true;
     } else {
       this.showErrorMsg = false;
     }
    if (form.form.controls.password.valid === false) {
      this.pwdErrorMsg = true;
    } else {
      this.pwdErrorMsg = false;
    }

    if (form.form.controls.checkbox.valid === false) {
      this.acceptInvalid = true;
    } else {
      this.acceptInvalid = false;
    }
  } else {
    this.requestSent = true;
    this.showErrorMsg = false;
    this.pwdErrorMsg = false;
    this.acceptInvalid = false;
    this.numberInvalid = false;

    this.localStorageService.set('new-merchant' , form.value);

    const data = form.value.phoneNumber;
    this.merchantAuthService.sendPin(data).subscribe(
      (response) => {
        this.requestSent = false;
          if (response.success === 200) {
              localStorage.clear();
              this.localStorageService.set('pin', response.data);
              this.localStorageService.set('new-merchant' , form.value);
              form.reset();
              this.router.navigate(['/verify']);
          } else if (response.output.payload.statusCode === 1102) {
            this.globalErrorSerice.errorOccured(response);
            this.postSubmit = true;
            this.error = 'Phone Number already Registered, try with some another number. ';
          } else {
            console.log(response);
            this.globalErrorSerice.errorOccured(response);
            this.postSubmit = true;
            this.error = 'Something went wrong, please try again later! ';
          }
      }, (error) => {
          console.log(error);
          this.postSubmit = true;
          this.error = 'Something went wrong, please try again later! ';
          this.globalErrorSerice.errorOccured(error);
      }
    );

  }
}

  onSearchEmail(searchValue: string ) {


    // autocomplete
     this.merchantAuthService.checkEmail(searchValue).subscribe(
     (response) => {

      if (response.success === 200 ) {
        this.showErrorMsg = false;
          // this.validEmail = 'true';
      } else if (response.output.statusCode === 1102 &&
        response.output.payload.message === 'This email is already registered. Please try logging in.' ) {
          this.showErrorMsg = true;
          this.ErrorMsg = 'Email Already Taken!';
          // this.validEmail = 'false';
          this.globalErrorSerice.errorOccured(response);
      } else {
        this.showErrorMsg = false;
        this.globalErrorSerice.errorOccured(response);
      }

     },
     (error) => {
       console.log(error);
       this.globalErrorSerice.errorOccured(error);
     }
   );
  }


 onChangeValue(searchValue, type) {
    if (type === 'email' && searchValue.length === 0) {
      this.emailInput = 0;
    } else if (type === 'email' && searchValue.length > 0) {
      this.emailInput = 1;
    } else if (type === 'pwd' && searchValue.length === 0) {
      this.passwordInput = 0;
    } else if (type === 'pwd' && searchValue.length > 0) {
      this.passwordInput = 1;
    } else if (type === 'no' && searchValue.length === 0) {
      this.numberInput = 0;
    } else if (type === 'no' && searchValue.length > 0) {
      this.numberInput = 1;
      if (this.newNumber.toString().length === 10) {
         this.numberInvalid = false;
      } else {
         this.numberInvalid = true;
      }
    }
 }
}
