import { Component, OnInit, Input } from '@angular/core';
import { MerchantService } from '../merchants.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.css']
})
export class MerchantComponent implements OnInit {
  message;
  isLoading = true;
  constructor(private merchantService: MerchantService,
              private router: Router) { }

  ngOnInit() {
    // this.merchantService.currentMessage.subscribe(message => this.message = message)
    this.message = this.merchantService.getMerchant();
    console.log(this.message, 'message');
    if (this.message !== undefined) {
        this.isLoading = false;
    } else {
      this.router.navigate(['/merchants']);
    }
  }


  editMerchant() {
    this.merchantService.setMerchant(this.message);
  }
}
