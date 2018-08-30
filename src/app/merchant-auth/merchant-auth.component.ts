import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { LocalStorageService } from '../shared/local-storage.service';
import { NgForm } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import { MerchantAuthService } from './merchant-auth.service';

@Component({
  selector: 'app-merchant-auth',
  templateUrl: './merchant-auth.component.html',
  styleUrls: ['./merchant-auth.component.css']
})
export class MerchantAuthComponent implements OnInit {
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
  ErrorMsg;
  showErrorMsg;
  // validEmail = 'true';
  constructor(private router: Router,
              private route: ActivatedRoute,
              private localStorageService: LocalStorageService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private merchantAuthService: MerchantAuthService
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
    if (this.searchElement !== undefined) {
      this.mapsAPILoader.load().then(
        () => {

         const autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {});
         autocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
           const place: google.maps.places.PlaceResult = autocomplete.getPlace();
           if (place.geometry === undefined || place.geometry === null ) {
            return;
           }
           this.lat = JSON.stringify(place.geometry.location.lat());
           this.lng = JSON.stringify(place.geometry.location.lng());
           this.place = place.formatted_address;
          });
          });
        }
           );
    }

  }


registerPage() {
  this.showRegister = true;
  this.showLogin = false;
  this.postSubmit = false;
}

loginPage() {
  this.showRegister = false;
  this.showLogin = true;
  this.postSubmit = false;
}



// Sign In
onSignin(form: NgForm) {

  if (form.valid === false) {
    // console.log
    this.postSubmit = true;
    this.error = 'Mandatory Parameter Missing';
  } else {
    this.merchantAuthService.signin(form.value).subscribe(
        (response) => {

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
            this.showMessage = true;
            this.message = 'Invalid Email or Password';
            console.log('something went wrong!!', response.output.payload);
          }
      },
        (error) => console.log('error!!', error)
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


  if (this.showErrorMsg ===  true) {
    this.postSubmit = true;
    this.error = 'Email Already Registered, Choose Another One! ';
  } else if (form.valid === false) {
    // console.log
    this.postSubmit = true;
    this.error = 'Mandatory Parameter Missing';
  } else {
    this.localStorageService.set('new-merchant' , form.value);

    const data = form.value.phoneNumber;
    this.merchantAuthService.sendPin(data).subscribe(
      (response) => {
        console.log(response);
          if (response.success === 200) {
              localStorage.clear();
              this.localStorageService.set('pin', response.data);
              this.localStorageService.set('new-merchant' , form.value);
              form.reset();
              this.router.navigate(['/verify']);
          } else if (response.output.payload.statusCode === 1102) {
            this.postSubmit = true;
            this.error = 'Phone Number already Registered, try with some another number. ';
          } else {
            console.log(response);
            this.postSubmit = true;
            this.error = 'Something went wrong, please try again later! ';
          }
      }, (error) => {
          console.log(error);
          this.postSubmit = true;
          this.error = 'Something went wrong, please try again later! ';
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
      }

     },
     (error) => {
       console.log(error);
     }
   );
  }


}
