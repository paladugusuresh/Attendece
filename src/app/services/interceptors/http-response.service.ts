import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class HttpResponseService implements HttpInterceptor {
    users = [{
        userId: 1,
        firstName: 'Suresh',
        lastName: 'Paladugu',
        userName: 'sureshP',
        role: 'Teacher',
        email: 'stummala@gmail.com',
        dob: new Date(1989, 6, 5)
    }, {
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        userName: 'adityaT',
        role: 'Student',
        email: 'stummala@gmail.com',
        dob: new Date(1991, 9, 16)
    }];
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.handleRoute(req, next);
    }

    handleRoute(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        switch (true) {
            case req.url.endsWith('/ValidateUser'):
                return this.authenticateUser(req);
            case req.url.endsWith('/UpdateProfile'):
                return this.updateProfile(req);
            case req.url.endsWith('/RegisterUser'):
                return this.createUser(req);
            case req.url.endsWith('/ForgotPassword'):
                return this.forgotPassword(req);
            case req.url.indexOf('/GetLastDayAttendanceById') > -1:
                return this.getLastDayAttendanceByStudentId(req);
            case req.url.indexOf('/GetCoursesById') > -1:
                return this.getCoursesByStudentId(req);
            default:
                return next.handle(req);
        }
    }

    authenticateUser(req: HttpRequest<any>): Observable<HttpResponse<any>> {
        const { body } = req;
        const { userName, password } = body;
        let res = null;
        if (this.users.findIndex(t => t.userName === userName) > -1) {
            res = this.users.find(t => t.userName === userName);
            res.token = 'sergt4gg3';
        } else {
            res = 'No users found with given details';
        }
        return of(new HttpResponse({ status: res === null ? 400 : 200, body: res }));
    }

    updateProfile(req: HttpRequest<any>): Observable<HttpResponse<any>> {
        const { body } = req;
        const user = body;
        let res = null;
        const existingUser = this.users.find(t => t.userName === user.userName);
        if (existingUser) {
            existingUser.firstName = user.firstName;
            existingUser.lastName = user.lastName;
            existingUser.email = user.email;
            res = 'Profile Updated Successfully';
        } else {
            res = 'No users found with given details';
        }
        return of(new HttpResponse({ status: res === null ? 400 : 200, body: res }));
    }

    createUser(req: HttpRequest<any>): Observable<HttpResponse<any>> {
        const { body } = req;
        const user = body;
        let res = null;
        const existingUser = this.users.find(t => t.userName === user.userName);
        if (existingUser) {
            res = 'User already exists with user name, Try again with different user name';
        } else {
            user.id = this.users.sort((a,b) => a.userId - b.userId)[0].userId + 1;
            this.users.push(user);
            res = `User with ${user.userName} created successfully, log into the application`;
        }
        return of(new HttpResponse({ status: res === null ? 400 : 200, body: res }));
    }

    changePassword(req: HttpRequest<any>): Observable<HttpResponse<any>> {
        const { body } = req;
        const user = body;
        let res = null;
        const existingUser = this.users.find(t => t.userId === user.userId);
        if (!existingUser) {
            res = 'User does not exists with user name';
        } else {
            res = `Password for User with ${user.userName} updated successfully`;
        }
        return of(new HttpResponse({ status: res === null ? 400 : 200, body: res }));
    }

    forgotPassword(req: HttpRequest<any>): Observable<HttpResponse<any>> {
        const { body } = req;
        const user = body;
        let res = null;
        const existingUser = this.users.find(t => t.userName === user.userName);
        if (!existingUser) {
            res = 'User does not exists with user name';
        } else {
            res = `Password for User with ${user.userName} updated successfully`;
        }
        return of(new HttpResponse({ status: res === null ? 400 : 200, body: res }));
    }

    getLastDayAttendanceByStudentId(req: HttpRequest<any>): Observable<HttpResponse<any>> {
        const result = {
            averageAttendance: 74.5,
            history: [{
                id: 1,
                course: 'Maths',
                attendedDate: '2021-09-03'
            }, {
                id: 2,
                course: 'Physics',
                attendedDate: '2021-09-03'
            }, {
                id: 3,
                course: 'Chemistry',
                attendedDate: '2021-09-03'
            }]
        };
        return of(new HttpResponse({ status: 200, body: result}));
    }

    getCoursesByStudentId(req: HttpRequest<any>): Observable<HttpResponse<any>> {
        const result = [{
            name: 'Maths',
            image: '/assets/imgs/maths.jpeg',
            id: 2
        }, {
            id: 3,
            name: 'Physics',
            image: '/assets/imgs/physics.jpeg'
        }, {
            id: 4,
            name: 'Chemistry',
            image: '/assets/imgs/chemistry.jpeg'
        }];
        return of(new HttpResponse({ status: 200, body: result}));
    }
}
