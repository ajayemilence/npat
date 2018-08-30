import {
  Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild, ElementRef, NgZone, TemplateRef
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { LocalStorageService } from './shared/local-storage.service';
import { MerchantService } from './merchants/merchants.service';
import { RequestService } from './request/request.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { MatSnackBar } from '@angular/material';
import { CatalogueService } from './merchants/merchant/catalogue/catalogue.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  admin = false;
  merchant = false;
  mobileQuery: MediaQueryList;
  merchantVerified = false;
  modalRef: BsModalRef;
  planModalRef: BsModalRef;
  RequestClicked = false;
  private _mobileQueryListener: () => void;
  DataPlan;
  currentPlan;
  UserName;
  constructor(changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private router: Router,
              private localStorage: LocalStorageService,
              private merchantService: MerchantService,
              private requestSerive: RequestService,
              private modalService: BsModalService,
              private snackbar: MatSnackBar,
              private localStorageService: LocalStorageService,
              private catalogueService:  CatalogueService
            ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }


  ngOnInit() {

    this.router.events.subscribe((event) => {
      if (this.router.url === '/auth' ||
          this.router.url === '/merchant/auth' ||
          this.router.url === '/verify'
        ) {
        this.admin = false;
      } else if (this.router.url === '/' ) {
        this.admin = true;
        const user = JSON.parse(localStorage.getItem('user-data'));

        if (user !== null) {
          if (user.merchant_id !== undefined) {
            this.merchant = true;
            this.UserName = user.merchant_first_name;
            if (user.merchant_verification_status === 'Not verified') {
              this.merchantVerified = false;
            } else {
              this.merchantVerified = true;
            }
            this.currentPlan = user.merchant_subscription;
          } else if (user.admin_id !== undefined) {
            this.UserName = user.admin_first_name + user.admin_last_name;
            this.merchant = false;
          }
        }

      }

   });


  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth']);
  }

  editProfile() {
    const user = JSON.parse(localStorage.getItem('user-data'));
    if (user.merchant_id !== undefined) {
      this.router.navigate(['/merchants/edit']);
      this.merchantService.setMerchant(user);
    }

  }

  showSubList() {
    this.RequestClicked = !this.RequestClicked;
  }
  ShowRequest(num) {
    if (num === 5) {
      this.router.navigate(['/requests/merchants']);
    } else {
      this.router.navigate(['/requests']);
      this.requestSerive.setRequest(num);
    }

  }

  openOrders() {
    const user = JSON.parse(localStorage.getItem('user-data'));
    if (user.merchant_id !== undefined) {
      this.merchant = true;

      if (user.merchant_verification_status === 'Not verified') {
        this.merchantVerified = false;
      } else {
        this.merchantVerified = true;
        this.router.navigate(['/orders']);
      }
    } else {
      this.router.navigate(['/orders']);
    }
  }

  upgradePlanModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  planDetailModal(template: TemplateRef<any>) {
    this.planModalRef = this.modalService.show(template);
  }

  planSelected(option) {

    // if (option === 1) {
    //     this.DataPlan = 'FREELISTING';
    // } else
    if (option === 2) {
        this.DataPlan = 'INSTORE';
    } else if (option === 3) {
        this.DataPlan = 'ONLINE';
    } else if (option === 4) {
        this.DataPlan = 'ONLINE/INSTORE';
    }

    this.merchantService.editMerchantPlans(this.DataPlan).subscribe(
      (response) => {
          if (response.success === 200 ) {
            this.clickOnceVerified();
            this.modalRef.hide();
          } else {
            console.log(response);
            this.snackbar.open('Something Went Wrong, try again', 'Dismiss', {
              duration: 5000,
            });
          }
      }, (error) => {
          console.log(error);
          this.snackbar.open('Something Went Wrong, try again', 'Dismiss', {
            duration: 5000,
          });
      }
    );
}

clickOnceVerified () {
  this.merchantService.verifyMerchant().subscribe(
    (response) => {
        if (response.success === 200) {
            this.localStorageService.set('user-data', response.data);

            const currentUrl = this.router.url;
            // const currentUrl = this.router.url;
            location.reload();
            // this.router.navigate(['/catalogue']);
            // this.router.navigate([currentUrl]);
            this.catalogueService.setUser(localStorage.getItem('user-data'));
        } else {
          console.log(response.output.payload.message);
          this.snackbar.open('Something Went Wrong, try again', 'Dismiss', {
            duration: 5000,
          });
        }
    }, (error) => {
      console.log(error);
      this.snackbar.open('Something Went Wrong, try again', 'Dismiss', {
        duration: 5000,
      });
    }
  );
}

logoClicked() {
    const user = JSON.parse(localStorage.getItem('user-data'));
    if (user.merchant_id !== undefined ) {
      this.router.navigate(['/catalogue']);

    } else {
      this.router.navigate(['/merchants']);
    }

}

}
