import { LocalStorageService } from '../../shared/local-storage.service';
import { AuthService } from '../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms/src/directives';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showMessage = false;
  message: string;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private localStorageService: LocalStorageService) { }

  ngOnInit() {
  }

  register() {
    this.router.navigate(['auth/register']);
  }

  onSignin(form: NgForm) {
    const email = form.value.email;
    const pass = form.value.password;
    const body = {
     'admin_email': email,
     'admin_password': pass
   };

   this.authService.signin(body).subscribe(
    (response) => {
      console.log(response);
      // if response 2 verify account
      console.log(response.message);
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
        console.log('something went wrong!!', response.output.payload.statusCode);
      }
  },
    (error) => console.log('error!!', error)
  );
  }

}
