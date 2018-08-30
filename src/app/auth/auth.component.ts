import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../shared/local-storage.service';
import { AuthService } from './auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  showRegister = false;
  showLogin = true;
  postSubmit = false;
  error;
  displayImage = 'assets/images/profile-pic.png';
  defaultType = 'PickUp Only';
  userImage: File = null;
  showMessage = false;
  message: string;
  showOption = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private localStorageService: LocalStorageService) { }

  ngOnInit() {}


registerPage() {
  this.showRegister = true;
  this.showLogin = false;
  this.postSubmit = false;
}

loginPage() {
  this.showRegister = false;
  this.showLogin = true;
  this.postSubmit = false;
}



// Sign In
onSignin(form: NgForm) {
  const email = form.value.email;
  const pass = form.value.password;
  const body = {
    'admin_email': email,
    'admin_password': pass
  };
  this.authService.signin(body).subscribe(
  (response) => {

    if (response.success === 200) {
    //   console.log('print error message');
    //   this.showMessage = true;
    //   this.message = response.msg;
    // } else if (response.success === 1) {
      // if response 1 clear local storage and store data again

      // clearing data in local storage
      localStorage.clear();

      // storing data in local storage
      this.localStorageService.set('token', response.data.token);
      this.localStorageService.set('user-data', response.data);

      form.reset();
      // navigating to profile
      this.router.navigate(['/']);
    } else {
      this.showMessage = true;
      this.message = 'Invalid Email or Password';
      console.log('something went wrong!!', response.output.payload);
    }
},
  (error) => console.log('error!!', error)
);
}


// Register
onFileChange(file: FileList) {
  this.userImage = file.item(0);
  const reader = new FileReader();
  reader.onload = (event: any) => {
    this.displayImage = event.target.result;
  };
    reader.readAsDataURL(this.userImage);
}

onSignup(form: NgForm) {

  const body = {
    admin_email : form.value.email,
    admin_password: form.value.password,
    admin_first_name: form.value.fname,
    admin_last_name: form.value.lname,
    image: this.userImage,
    admin_phone_no: form.value.phoneNumber
  };

  this.authService.signup(body)
  .subscribe(
    (response) => {

    if (response.success === 200) {
      this.postSubmit = false;
      this.router.navigate(['/']);
      form.reset();
      this.displayImage = 'assets/images/profile-pic.png';
    } else {
      this.postSubmit = true;
      this.error = response.output.payload.message;
    }
    },
    (error) => {
      console.log('error', error);
    }
  );
}
}
