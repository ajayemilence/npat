import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class GLobalErrorService {
  constructor(private snackbar: MatSnackBar) {}


  errorOccured(response) {
      const errorStatus = response.output.payload.statusCode;
      const errorMsg = response.output.payload.message;
      this.showSnackBar(errorMsg);

        // if (errorStatus === 500) {
        //     // server error

        // } else if (errorStatus === 504) {
        //     // GATEWAY_TIMEOUT = 504;

        // } else if (errorStatus === 404) {
        //     // NOT_FOUND = 404;

        // } else if (errorStatus === 401) {
        //     // UNAUTHORIZED = 401;

        // } else if (errorStatus === 403) {
        //     // FORBIDDEN = 403;

        // } else if (errorStatus === 400) {
        //     // BAD_REQUEST = 400;

        // } else if (errorStatus === 408) {
        //     // REQUEST_TIMEOUT = 408

        // } else if (errorStatus === 504) {
        //     // GATEWAY_TIMEOUT = 504;

        // } else if (errorStatus === 409) {
        //     //  ALREADY_EXIST = 409;

        // } else if (errorStatus === 440) {
        //     //  TIME_OUT = 440;

        // } else if (errorStatus === 449) {
        //     //  RETRY = 449;

        // } else if (errorStatus === 420) {
        //     // METHOD_FAILURE = 420;

        // } else if (errorStatus === 1100) {
        //     // PARAMETER_MISSING = 1100;

        // } else if (errorStatus === 1101) {
        //     // FILE_NOT_UPLOADED = 1101;

        // } else if (errorStatus === 1102) {
        //     // VALUE_NOT_UNIQUE = 1102;

        // }

  }

  showSnackBar(msg) {
      this.snackbar.open(msg, 'Dismiss', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top'

      });
  }

}
