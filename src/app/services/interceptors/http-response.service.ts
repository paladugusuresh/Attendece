import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class HttpResponseService implements HttpInterceptor {
    users = [{
        firstName: 'Suresh',
        lastName: 'Paladugu',
        userName: 'sureshP',
        role: 'Teacher'
    }, {
        firstName: 'Aditya',
        lastName: 'T',
        userName: 'adityaT',
        role: 'Student'
    }];
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.handleRoute(req, next);
    }
    handleRoute(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        switch (true) {
            case req.url.endsWith('/ValidateUser'):
                return of(new HttpResponse({ status: 200, body: { token: 'sergt4ggh3', } }));
            default:
                return next.handle(req);
        }
    }

    authenticateUser(req: HttpRequest<any>): Observable<HttpResponse<any>> {
        const { body } = req;
        const { userName, password } = body;
        let res = null;
        if (this.users.findIndex(t => t.userName === userName) > -1 && password === 'Password1') {
            res = this.users.find(t => t.userName === userName);
            res.token = 'sergt4gg3';
        } else {
            res = 'No users found with given details';
        }
        return of(new HttpResponse({ status: res === null ? 400 : 200, body: res }));
    }
}
