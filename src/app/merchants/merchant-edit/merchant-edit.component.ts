import { MerchantService } from '../merchants.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms/src/directives';
import { Router } from '@angular/router';
@Component({
  selector: 'app-merchant-edit',
  templateUrl: './merchant-edit.component.html',
  styleUrls: ['./merchant-edit.component.css']
})
export class MerchantEditComponent implements OnInit {
  postSubmit = false;
  error;
  constructor(private merchantsService: MerchantService,
              private router: Router) { }

  ngOnInit() {
  }

  addMerchant(form: NgForm) {
    if (form.status === 'INVALID') {
      this.postSubmit = true;
      this.error = 'Mandatory Parameter Missing!';
    } else {
      this.postSubmit = false;

      // Post request to store user data
      this.merchantsService.addMerchant(form)
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
