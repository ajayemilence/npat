import { MerchantService } from '../merchants.service';
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import { MatSnackBar } from '@angular/material';
import { MerchantAuthService } from '../../merchant-auth/merchant-auth.service';
import { GLobalErrorService } from '../../shared/global-error.service';

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
  defaultUserImage = 'assets/images/userImage.png';
  displayImage = this.defaultUserImage;
  userImage: File = null;
  altitude;
  validEmail = false;
  ErrorEmail = '';
  isLoading = false;
  constructor(private merchantsService: MerchantService,
              private router: Router,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private snackbar: MatSnackBar,
              private merchantAuthService: MerchantAuthService,
              private globalErrorService: GLobalErrorService
            ) { }

  ngOnInit() {
      if (this.router.url === '/merchants/edit'
        ) {
          this.currentMerchant = this.merchantsService.getMerchant();
          if (this.currentMerchant !== undefined) {

            this.fname = this.currentMerchant.merchant_first_name;
            this.lname = this.currentMerchant.merchant_last_name;
            this.url = this.currentMerchant.merchant_description;
            this.phone = this.currentMerchant.merchant_phone_no;
            this.address = this.currentMerchant.merchant_address;
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
         const location = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};

         const elevator = new google.maps.ElevationService;
          this.displayLocationElevation(location, elevator).then(alt => {
            this.altitude =  alt;
          });
        });
        });
      }
    );
  }

onSearchEmail(searchValue: string ) {
     this.merchantAuthService.checkEmail(searchValue).subscribe(
     (response) => {
      if (response.success === 200 ) {
        this.validEmail = false;
      } else if (response.output.statusCode === 1102 &&
        response.output.payload.message === 'This email is already registered. Please try logging in.' ) {
          this.validEmail = true;
          this.ErrorEmail = 'Email Already Taken!';

      } else {
          console.log(response);
          this.globalErrorService.errorOccured(response);
      }

     },
     (error) => {
       console.log(error);
       this.globalErrorService.errorOccured(error);
     }
   );
}
    // Image
onFileChange(file: FileList) {
  console.log(file);
  if (file.length === 0 ) {
    this.displayImage = this.defaultUserImage;
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
      console.log('Invalid Form');
      this.postSubmit = true;
      this.error = 'Mandatory Parameter Missing!';
    } else {
      this.isLoading = true;
      this.postSubmit = false;
      const data = {
          form : form.value,
          place: this.place,
          lat: this.lat,
          lng: this.lng,
          image: this.userImage,
          altitude: this.altitude
      };

      // Post request to store user data
      this.merchantsService.addMerchant(data)
      .subscribe(
        (response) => {
         if (response.success === 200) {
          this.postSubmit = false;
          this.router.navigate(['/merchants']);
          form.reset();
        } else {
          this.isLoading = false;
          // this.postSubmit = true;
          // this.error = response.output.payload.message;
          this.globalErrorService.errorOccured(response);
        }

        },
        (error) => {
          // handle all error cases
          console.log(error);
          this.isLoading = false;
          this.globalErrorService.errorOccured(error);
        }
      );
    }
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
