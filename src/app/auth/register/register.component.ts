import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  postSubmit = false;
  error;
  displayImage = 'assets/images/profile-pic.png';
  defaultType = 'PickUp Only';
  userImage: File = null;
  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

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
       console.log(response, 'response');
      if (response.success === 200) {
        this.postSubmit = false;
        this.router.navigate(['/']);
        form.reset();
        this.displayImage = 'assets/images/profile-pic.png';
      } else {
        this.postSubmit = true;
        this.error = 'Email Already Registered!';
      }
     },
     (error) => {
       console.log('error', error);
     }
   );
  }

}
