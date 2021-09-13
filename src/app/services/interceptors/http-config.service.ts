import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse, HttpEventType } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpConfigService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.token) {
      req = req.clone({
        setHeaders: {
          authorization: this.authService.token,
          'content-type': 'application/json'
        }
      });
    }
    if (!window.navigator.onLine) {
      throw new HttpErrorResponse({ error: 'Unable to connect to network', status: 0, statusText: 'NetworkConnectionError' });
    }
    return next.handle(req).pipe(map((event: HttpEvent<any>) => event), catchError((error: HttpErrorResponse) => {
      if (error.message.toLowerCase().indexOf('unknown error') > -1) {
          error = new HttpErrorResponse({ error: 'Service is not available', url: error.url });
          // tslint:disable-next-line: no-string-literal
          // eslint-disable-next-line @typescript-eslint/dot-notation
          error['_message'] = 'Service is not available, try after sometime';
      }
      return throwError(error);
  }));;
  }
}
