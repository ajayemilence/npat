import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MerchantService } from '../merchants/merchants.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { GLobalErrorService } from '../shared/global-error.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
user = 0; // 0 admin, 1 merchant
postSubmit = false;
error;
lengthErrorCurrent = false;
lengthErrorNew = false;
lengthErrorConfirm = false;

logoImage = 'assets/images/app-logo.png';
loaderImage = 'assets/images/loader-new.gif';
  constructor(private merchantService: MerchantService,
              private snackbar: MatSnackBar,
              private router: Router,
              private authService: AuthService,
              private globalErrorService: GLobalErrorService
          ) { }

  ngOnInit() {
  }

  changePassword(form: NgForm) {

    if (form.valid === false) {
        this.postSubmit = true;
        this.error = 'Mandatory Fields Missing';
    } else {
        this.postSubmit = false;
        // if  (form.value.currentPwd.length < 6 && form.value.newPassword.length < 6) {
        //        this.lengthErrorCurrent = true;
        //        this.lengthErrorCurrent = true;
        //        this.lengthErrorConfirm = false;
        // } else if  (form.value.newPassword.length < 6) {
        //       this.lengthErrorCurrent = false;
        //       this.lengthErrorCurrent = true;
        //       this.lengthErrorConfirm = false;
        // } else if  (form.value.currentPwd.length < 6 ) {
        //       this.lengthErrorCurrent = true;
        //       this.lengthErrorCurrent = false;
        //       this.lengthErrorConfirm = false;
        // } else
        if (form.value.newPassword !== form.value.confirmPassword) {
              this.lengthErrorConfirm = true;
              this.lengthErrorCurrent = false;
              this.lengthErrorCurrent = false;
        } else {
          this.lengthErrorConfirm = false;
          this.lengthErrorCurrent = false;
          this.lengthErrorCurrent = false;
          const user = JSON.parse(localStorage.getItem('user-data'));

          if (user.admin_id !== undefined) {
            // change admin's password
            console.log('form valid admin');

              this.authService.adminChangePassword(form.value).subscribe(
                (response) => {
                    if (response.success === 200) {
                      this.globalErrorService.showSnackBar('Password changed successfully');
                      this.router.navigate(['/catalogue']);
                    } else {
                        console.log(response.output.payload.message);
                        if (response.output.payload.statusCode === 412 || response.output.payload.statusCode === 1100) {
                            // if (response.output.payload.statusCode === 412) {
                              this.postSubmit = true;
                              this.error = response.output.payload.message;
                            // }
                        } else {
                          this.globalErrorService.errorOccured(response);
                        }

                    }
                }, (error) => {
                  console.log(error);
                  this.globalErrorService.errorOccured(error);
                }
              );
          } else if (user.merchant_id !== undefined) {
            // change merchant's password
            this.merchantService.merchantChangePassword(form.value).subscribe(
              (response) => {
                  if (response.success === 200) {
                    this.globalErrorService.showSnackBar('Password changed successfully');
                    this.router.navigate(['/catalogue']);
                  } else {
                      console.log(response.output.payload.message);
                      if (response.output.payload.statusCode === 412 || response.output.payload.statusCode === 1100) {
                          // if (response.output.payload.statusCode === 412) {
                            this.postSubmit = true;
                            this.error = response.output.payload.message;
                          // }

                      } else {
                        this.globalErrorService.errorOccured(response);
                      }

                  }
              }, (error) => {
                console.log(error);
                this.globalErrorService.errorOccured(error);
              }
            );
          }
        }
    }
  }

}
