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

  constructor(private router: Router,
              private route: ActivatedRoute,
              private localStorageService: LocalStorageService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private merchantAuthService: MerchantAuthService
            ) { }


  ngOnInit() {
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
  console.log('in signin', form);
  if (form.valid === false) {
    // console.log
    this.postSubmit = true;
    this.error = 'Mandatory Parameter Missing';
  } else {
    this.merchantAuthService.signin(form.value).subscribe(
        (response) => {
          console.log(response);
          // if response 2 verify account
          console.log(response.message);
          if (response.success === 200) {
           localStorage.clear();

            // // storing data in local storage
            this.localStorageService.set('token', response.data.token);
            this.localStorageService.set('user-data', response.data);

            form.reset();
            // navigating to profile
            this.router.navigate(['/']);
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

  console.log(form, 'register');
  if (form.valid === false) {
    // console.log
    this.postSubmit = true;
    this.error = 'Mandatory Parameter Missing';
  }
  this.merchantAuthService.signup(form)
  .subscribe(
    (response) => {
      console.log(response, 'response');
    if (response.success === 200) {
      this.postSubmit = false;
      this.router.navigate(['/']);
      form.reset();
      this.displayImage = 'assets/images/profile-pic.png';
    } else {
      this.postSubmit = true;
      this.error = response.output.payload.message;
    }
    },
    (error) => {
      console.log('error', error);
    }
  );
}


}
