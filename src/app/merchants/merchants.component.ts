import { Component, OnInit } from '@angular/core';
import { MerchantService } from './merchants.service';

@Component({
  selector: 'app-merchants',
  templateUrl: './merchants.component.html',
  styleUrls: ['./merchants.component.css']
})
export class MerchantsComponent implements OnInit {
  merchants;
  count;
  constructor(private merchantService: MerchantService) { }

  ngOnInit() {
    const token = localStorage.getItem('token');

    this.merchantService.getMerchants(token)
    .subscribe(
      (response) => {
        if (response.success === 200) {
          this.merchants = response.data.rows;
          this.count = response.data.count;
          console.log(this.merchants);
          console.log(this.count);
        } else {
          // navigate to error page
          console.log(response);
        }
    },
      (error) => {
        console.log('error!!', error);
    });
  }

}
