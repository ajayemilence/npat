import { MerchantService } from '../merchants.service';
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import { LocalStorageService } from '../../shared/local-storage.service';


@Component({
  selector: 'app-merchant-edit',
  templateUrl: './merchant-edit.component.html',
  styleUrls: ['./merchant-edit.component.css']
})
export class MerchantEditComponent implements OnInit {
  postSubmit = false;
  @ViewChild('search') public searchElement: ElementRef;
  lat;
  lng;
  place;
  currentMerchant;
  error;
  fname = '';
  lname;
  url;
  phone;
  address;
  profilepic;
  displayImage = 'assets/images/profile-pic.png';
  userImage: File = null;
  constructor(private merchantsService: MerchantService,
              private router: Router,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private localStorage: LocalStorageService
            ) { }

  ngOnInit() {

    this.currentMerchant = this.merchantsService.getMerchant();

    if (this.currentMerchant === undefined) {
      const user = JSON.parse(localStorage.getItem('user-data'));
      if (user.admin_id !== undefined) {
        this.router.navigate(['/merchants']);
      } else if (user.merchant_id !== undefined) {
        this.router.navigate(['/catalogue']);
      }

    } else {
      if (this.currentMerchant.merchant_profile_pic !==  '' &&
      this.currentMerchant.merchant_profile_pic !== undefined) {
      this.displayImage = 'https://s3.us-east-2.amazonaws.com/swift-spar-local/delivery_app/' + this.currentMerchant.merchant_profile_pic;
      }
    }


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

  // Image
onFileChange(file: FileList) {
  if (file.length === 0 ) {
    this.displayImage = 'assets/images/profile-pic.png';
  } else {
    console.log(file, 'file');
    this.userImage = file.item(0);
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.displayImage = event.target.result;
    };
      reader.readAsDataURL(this.userImage);
  }
}

  editMerchant(form: NgForm) {
    if (form.status === 'INVALID') {
      this.postSubmit = true;
      this.error = 'Enter Valid Phone Number';
    } else {
      this.postSubmit = false;

      if (this.place === undefined) {
        this.place = this.currentMerchant.merchant_address;
        this.lat = this.currentMerchant.merchant_lat;
        this.lng = this.currentMerchant.merchant_long;
      }
      const data = {
          form : form.value,
          place: this.place,
          lat: this.lat,
          lng: this.lng,
          image: this.userImage,
          merchantID: this.currentMerchant.merchant_id
      };

      // Post request to store user data
      this.merchantsService.editMerchant(data)
      .subscribe(
        (response) => {
         if (response.success === 200) {
          this.postSubmit = false;
          const user = JSON.parse(localStorage.getItem('user-data'));
          if (user.merchant_id !== undefined) {
            this.router.navigate(['/catalogue']);
            this.localStorage.set('user-data', response.data);
          } else {
            this.router.navigate(['/merchants']);
          }

          form.reset();
        } else {
          this.postSubmit = true;
          this.error = response.output.payload.message;
        }

        },
        (error) => {
          // handle all error cases
          console.log(error);
        }
      );
    }
  }



}
