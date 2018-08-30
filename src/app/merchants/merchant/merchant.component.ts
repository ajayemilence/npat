import { Component, OnInit, Input } from '@angular/core';
import { MerchantService } from '../merchants.service';
import { Router } from '@angular/router';
import { GlobalService } from '../../shared/global.service';
import { LocalStorageService } from '../../shared/local-storage.service';

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.css']
})
export class MerchantComponent implements OnInit {
  message;
  isLoading = true;
  displayImage = 'assets/images/upload.png';
  constructor(private merchantService: MerchantService,
              private router: Router,
              private globalService: GlobalService,
              private localStorageService: LocalStorageService
            ) { }

  ngOnInit() {
    // this.merchantService.currentMessage.subscribe(message => this.message = message)
    this.message = this.merchantService.getMerchant();

    if (this.message !== undefined) {
        this.isLoading = false;
        if (this.message.merchant_profile_pic !== '') {
          this.displayImage = this.globalService.ImagePath + this.message.merchant_profile_pic;
        }

    } else {
      this.displayImage = 'assets/images/upload.png';
      this.router.navigate(['/merchants']);
    }
  }


  editMerchant() {
    this.merchantService.setMerchant(this.message);
  }

  viewDocuments() {
    this.localStorageService.set('merchant_id' , this.message.merchant_id);
    this.router.navigate(['/documents']);
  }
}
