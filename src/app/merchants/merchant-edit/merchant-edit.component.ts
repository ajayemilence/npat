import { MerchantService } from '../merchants.service';
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
import { LocalStorageService } from '../../shared/local-storage.service';
import { MatSnackBar } from '@angular/material';
import { GLobalErrorService } from '../../shared/global-error.service';


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
  altitude;
  place;
  currentMerchant;
  error;
  fname = '';
  lname;
  url;
  phone;
  address;
  profilepic;
  displayImage = 'assets/images/userImage.png';
  userImage: File = null;
  isLoading = false;
  constructor(private merchantsService: MerchantService,
              private router: Router,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private localStorage: LocalStorageService,
              private snackbar: MatSnackBar,
              private globalErrorService: GLobalErrorService
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

        //  const location = [this.lat, this.lng];
        const location = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};

// =====================
          const elevator = new google.maps.ElevationService;
          this.displayLocationElevation(location, elevator).then(alt => {
            this.altitude =  alt;
          });

        // function displayLocationElevation(loc, elevator2) {
        //   // Initiate the location request
        //   elevator.getElevationForLocations({
        //     'locations': [loc]
        //   }, function(results, status) {
        //     this.altitude = results[0].elevation;
        //     console.log(this.altitude, 'in fn');
        //   });
        // }
        // this. altitude = !function(loc) {
        //   const elevator2 = new google.maps.ElevationService;
        //   console.log('Hello from IIFE!', loc, elevator2);
        //   elevator2.getElevationForLocations({
        //         'location': [location]
        //   });

        // }(location);
        // Iife with return
        // this. altitude = (function(loc) {
        //   const elevator2 = new google.maps.ElevationService;
        //   elevator2.getElevationForLocations({'location' : [loc]}, (results, status) => {
        //     return results;
        //   });
        // }(location));

        // elevator.getElevationForLocations(this.lat, this.lng),
        // const elevator = new google.maps.ElevationService;
        // elevator.getElevationForLocations({
        //   'locations': [this.lat, this.lng]
        // }, function(results, status) {
        //   console.log(results);
        //   console.log('-----------');
        //   console.log(status);
          // infowindow.setPosition(location);
          // if (status === 'OK') {
          //   // Retrieve the first result
          //   if (results[0]) {
          //     // Open the infowindow indicating the elevation at the clicked position.
          //     infowindow.setContent('The elevation at this point <br>is ' +
          //         results[0].elevation + ' meters.');
          //   } else {
          //     infowindow.setContent('No results found');
          //   }
          // } else {
          //   infowindow.setContent('Elevation service failed due to: ' + status);
          // }
        // });
// =====================
        // const result = 'https://maps.googleapis.com/maps/api/elevation/json?locations=' + this.lat + ',' + this.lng +
        // '&key=AIzaSyAV910NJZ9cwBSy-MvdDaVwVw1597icBmY';
        // console.log(result);
        // this.merchantsService.getElevation(result).subscribe(
        //   (response) => {
        //     console.log(response);
        //   }, (error) => {
        //     console.log(error);
        //   }
        // );
// =====================

        // result.
        //  google.maps.ElevationService.apply({
        //   locations: {
        //     lat: this.lat,
        //     lng: this.lng
        //   }
        //   }, (err, response) => {
        //     if (!err && response.status === 200) {
        //       console.log('hsg', response);
        //       // return response.json.results
        //     } else {
        //       console.log('error', err);
        //     }https://maps.googleapis.com/maps/api/elevation/json?locations=30.712059000000004,76.706578&key=
        //   });
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
      this.isLoading = true;
      // const elevator = new google.maps.ElevationService;
      // const loc = {lat: JSON.parse(this.lat), lng: JSON.parse(this.lng)};
      // return new Promise((resolve, reject) => {
      //   elevator.getElevationForLocations({
      //     'locations': [loc]
      //   }, function(results, status) {
      //     // this.altitude = results[0].elevation;
      //     console.log(this.altitude, '00000000000000');
      //   });
      // });

      // this.merchantsService.getElevation(loc).subscribe(
      //   (response) => {
      //     console.log(response, 'response');
      //   }, (error) => {
      //     console.log(error, 'error');
      //   }
      // );



      // const output = this.displayLocationElevation(loc, elevator);
      // this.displayLocationElevation(loc, elevator);
      // console.log(output);
      // elevator.getElevationForLocations({
      //   'locations': [{lat: JSON.parse(this.lat), lng: JSON.parse(this.lng)}]
      // }, function(results, status) {
      //   // this.altitude = results[0].elevation;
      //   console.log(this.altitude, '00000000000000');
      // });

      if (this.place === undefined) {
        this.place = this.currentMerchant.merchant_address;
        this.lat = this.currentMerchant.merchant_lat;
        this.lng = this.currentMerchant.merchant_long;
        this.altitude = this.currentMerchant.merchant_altitude;
      }

      const data = {
          form : form.value,
          place: this.place,
          lat: this.lat,
          lng: this.lng,
          altitude : this.altitude,
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
          // this.error = response.output.payload.message;
          // this.isLoading = false;
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
