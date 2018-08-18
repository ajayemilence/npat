import { AuthService } from '../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    // this.router.navigate(['orders']);
    this.router.navigate([this.router.url]);
    if (this.router.url === '/') {
      const user = JSON.parse(localStorage.getItem('user-data'));

      // location.reload();
      if (user !== null) {
        if (user.merchant_id !== undefined) {

          // this.merchant = true;
          this.router.navigate(['catalogue']);
        } else if (user.admin_id !== undefined) {
          // this.merchant = false;

          this.router.navigate(['merchants']);
        }
      }
    }
  }


}
