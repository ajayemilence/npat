import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MerchantAuthService } from '../merchant-auth.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { GLobalErrorService } from '../../shared/global-error.service';

@Component({
  selector: 'app-forgot-pwd',
  templateUrl: './forgot-pwd.component.html',
  styleUrls: ['./forgot-pwd.component.css']
})
export class ForgotPwdComponent implements OnInit {
usernamePage = true;
otpPage = false;
passwordPage = false;
postSubmit = false;
error;
data;
otp;
pwdValid = false;
rewritePwd = false;
logoImage = 'assets/images/app-logo.png';
loaderImage = 'assets/images/loader-new.gif';
requestSent = false;
  constructor(
          private merchantAuthService: MerchantAuthService,
          private snackbar: MatSnackBar,
          private router: Router,
          private globalErrorService: GLobalErrorService
        ) { }

  ngOnInit() {
  }
  verifyForm (form: NgForm) {
    this.requestSent = true;

    if (form.valid === false) {
        this.postSubmit = true;
        this.error = 'Enter Valid Input';
    } else {
      // const email
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.value.username)) {

          this.data = {
            email : form.value.username,
            number: ''
          };

          this.merchantAuthService.sendOtpPwdReset(this.data).subscribe(
            (response) => {
              this.requestSent = false;
              this.postSubmit = false;
                if (response.success === 200) {
                    this.usernamePage = false;
                    this.otpPage = true;
                    this.passwordPage = false;
                } else {
                  console.log('error', response.output);
                  this.globalErrorService.errorOccured(response);
                    this.usernamePage = true;
                    this.otpPage = false;
                    this.passwordPage = false;


                }
            }, (error) => {
                console.log('error', error);
                this.globalErrorService.errorOccured(error);
            }
          );

      } else {

          this.data = {
            email : '',
            number: form.value.username
          };

          // if (data.number.)
          this.merchantAuthService.sendOtpPwdReset(this.data).subscribe(
            (response) => {
              this.requestSent = false;
              this.postSubmit = false;
                if (response.success === 200) {
                    this.usernamePage = false;
                    this.otpPage = true;
                    this.passwordPage = false;
                } else {
                  console.log('error', response.output);
                  this.globalErrorService.errorOccured(response);

                }
            }, (error) => {
                console.log('error', error);
                this.globalErrorService.errorOccured(error);
            }
          );
      }



    }
  }

  otpform(form: NgForm) {
    this.requestSent = true;
    this.postSubmit = false;
     if (form.valid !== true ) {
        this.requestSent = false;
        this.postSubmit = true;
        this.error = 'Enter Valid Input';
     } else if (form.value.otp > 1000 && form.value.otp < 9999) {
          this.otp  = form.value.otp;
          this.otpPage = false;
          this.passwordPage = true;
          this.usernamePage = false;
          this.postSubmit = false;
          this.requestSent = false;
     } else {
        this.requestSent = false;
        this.postSubmit = true;
        this.error = 'Enter Valid OTP';

     }
  }

  pwdForm(form: NgForm) {
    this.requestSent = true;
    if (form.valid === false) {
        this.postSubmit = true;
        this.error = 'Enter Valid Input';
    } else {
        if (form.value.pwd.length < 6 && form.value.pwd !== form.value.cpwd) {
          this.pwdValid = true;
          this.rewritePwd = true;
        } else if (form.value.pwd.length < 6) {
          this.pwdValid = true;
          this.rewritePwd = false;
        } else if (form.value.pwd !== form.value.cpwd) {
          this.rewritePwd = true;
          this.pwdValid = false;
        } else {
          this.rewritePwd = false;
          this.pwdValid = false;

          const data = {
            otp : this.otp,
            pwd : form.value.pwd
          };

          this.merchantAuthService.forgotPwd(data).subscribe(
            (response) => {
                this.requestSent = false;
                if (response.success === 200) {
                  this.usernamePage = true;
                  this.otpPage = false;
                  this.passwordPage = false;
                  this.postSubmit = false;
                  this.pwdValid = false;
                  this.rewritePwd = false;
                  this.router.navigate(['/merchant/auth']);
                  this.globalErrorService.showSnackBar('Password Changed Successfully!');
                } else {
                    this.usernamePage = true;
                    this.otpPage = false;
                    this.passwordPage = false;
                    this.postSubmit = false;
                    this.pwdValid = false;
                    this.rewritePwd = false;

                  if (response.output.payload.statusCode === 401) {
                      this.usernamePage = false;
                      this.otpPage = true;
                      this.error = response.output.payload.message;
                      this.passwordPage = false;
                      this.postSubmit = true;
                      this.pwdValid = false;
                      this.rewritePwd = false;
                      this.globalErrorService.errorOccured(response);
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
