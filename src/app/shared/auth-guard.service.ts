import {
    ActivatedRouteSnapshot,
    CanActivate,
    RouterStateSnapshot,
    Router
} from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable()

export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService,
                private router: Router) { }


    canActivate (route: ActivatedRouteSnapshot,
                 state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // return this.authService.isAuthenticated
    //     .then (
    //        (authenticated: boolean) => {
    //            if (authenticated) {
    //                return true;
    //            } else {
    //             this.router.navigate(['/signin']);
    //            }
    //        }
    //     );
    console.log(localStorage.getItem('user-info'));
    if (localStorage.getItem('user-info')) {
        // logged in so return true
        console.log(localStorage.getItem('user-info'));
        return true;
    }

    // not logged in so redirect to login page with the return url and return false
    this.router.navigate(['/auth/login']);
    return false;
    }
}
