import { MerchantService } from '../merchants.service';
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';

@Component({
  selector: 'app-merchant-new',
  templateUrl: './merchant-new.component.html',
  styleUrls: ['./merchant-new.component.css']
})
export class MerchantNewComponent implements OnInit {
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
              private ngZone: NgZone) { }

  ngOnInit() {
      if (this.router.url === '/merchants/edit'
        ) {
          this.currentMerchant = this.merchantsService.getMerchant();
          if (this.currentMerchant !== undefined) {
            console.log('in If part');
            this.fname = this.currentMerchant.merchant_first_name;
            this.lname = this.currentMerchant.merchant_last_name;
            this.url = this.currentMerchant.merchant_description;
            this.phone = this.currentMerchant.merchant_phone_no;
            this.address = this.currentMerchant.merchant_address;
           //  this.profilepic = this.currentMerchant.merchant_profile_pic;
          }

          console.log(this.fname, 'in edit');


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


  addMerchant(form: NgForm) {
    if (form.status === 'INVALID') {
      this.postSubmit = true;
      this.error = 'Mandatory Parameter Missing!';
    } else {
      this.postSubmit = false;
      const data = {
          form : form.value,
          place: this.place,
          lat: this.lat,
          lng: this.lng,
          image: this.userImage
      };
      console.log(data);
      // Post request to store user data
      this.merchantsService.addMerchant(data)
      .subscribe(
        (response) => {
         if (response.success === 200) {
          this.postSubmit = false;
          this.router.navigate(['/merchants']);
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
