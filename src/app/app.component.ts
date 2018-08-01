import {
  Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild, ElementRef, NgZone
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { LocalStorageService } from './shared/local-storage.service';
import { MerchantService } from './merchants/merchants.service';
import { RequestService } from './request/request.service';
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

  RequestClicked = false;
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private router: Router,
              private localStorage: LocalStorageService,
              private merchantService: MerchantService,
              private requestSerive: RequestService
            ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }


  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (this.router.url === '/auth' ||
          this.router.url === '/merchant/auth'
        ) {
        this.admin = false;
      } else if (this.router.url === '/' ) {
        this.admin = true;
        const user = JSON.parse(localStorage.getItem('user-data'));
        if (user !== null) {
          if (user.merchant_id !== undefined) {
            this.merchant = true;
          } else if (user.admin_id !== undefined) {
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
    console.log(num);
    this.router.navigate(['/requests']);
    this.requestSerive.setRequest(num);
  }
}
