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
        email: 'sureshp@gmail.com',
        dob: new Date(1989, 5, 5),
        school: 'Princeton School'
    }, {
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        userName: 'adityaT',
        role: 'Student',
        email: 'stummala@gmail.com',
        school: '',
        dob: new Date(1991, 8, 16)
    }, {
        userId: 3,
        firstName: 'Krithik',
        lastName: 'C',
        userName: 'krithik234',
        role: 'Student',
        school: '',
        email: 'krithik.c@gmail.com',
        dob: new Date(2011, 11, 20)
    }, {
        userId: 4,
        firstName: 'Abhishek',
        lastName: 'C',
        userName: 'abhishekc234',
        role: 'Student',
        school: '',
        email: 'abhishek.c@gmail.com',
        dob: new Date(2011, 11, 20)
    }, {
        userId: 5,
        firstName: 'Abhishek',
        lastName: 'K',
        userName: 'abhishekk234',
        role: 'Student',
        school: '',
        email: 'abhishek.k@gmail.com',
        dob: new Date(2011, 11, 20)
    }, {
        userId: 6,
        firstName: 'Abhi',
        lastName: 'M',
        userName: 'abhim234',
        role: 'Student',
        school: '',
        email: 'abhi.m@gmail.com',
        dob: new Date(2011, 11, 20)
    }, {
        userId: 7,
        firstName: 'Krishna',
        lastName: 'C',
        userName: 'krishnac234',
        role: 'Student',
        school: '',
        email: 'krishna.c@gmail.com',
        dob: new Date(2011, 11, 20)
    }];
    attendance = [{
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        attendancePercentage: '56'
    }, {
        userId: 3,
        firstName: 'Krithik',
        lastName: 'C',
        attendancePercentage: '58'
    }, {
        userId: 4,
        firstName: 'Abhishek',
        lastName: 'C',
        attendancePercentage: '60'
    }, {
        userId: 5,
        firstName: 'Abhishek',
        lastName: 'K',
        attendancePercentage: '69'
    }, {
        userId: 6,
        firstName: 'Abhi',
        lastName: 'M',
        attendancePercentage: '60'
    }, {
        userId: 7,
        firstName: 'Krishna',
        lastName: 'C',
        attendancePercentage: '59'
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
            case req.url.indexOf('/GetCoursesByTeacherId') > -1:
                return this.getCoursesByTeacherId(req);
            case req.url.indexOf('/GetStudentsByTeacherId') > -1:
                return this.getStudentsByTeacherId(req);
            case req.url.endsWith('/GetAllHolidays'):
                return this.getAllHolidays(req);
            case req.url.indexOf('/GetAttendanceByStudentIdandCourseId') > -1:
                return this.getAttendanceByStudentIdandCourse(req);
            case req.url.indexOf('/GetAttendanceByStudentIdandDate') > -1:
                return this.getAttendanceByStudentIdandDate(req);
            case req.url.indexOf('/GetSchoolsMappedToTeacher') > -1:
                return this.getSchoolsMappedToTeacher(req);
            case req.url.indexOf('/ChangePassword') > -1:
                return of(new HttpResponse({ status: 200, body: 'Password updated successfully' }));
            case req.url.endsWith('GetRoles'):
                return this.getAllRoles(req);
            default:
                return next.handle(req);
        }
    }
    getAllRoles(req: HttpRequest<any>): Observable<HttpEvent<any>> {
        const roles = [{
            id: 1,
            name: 'Teacher'
        }, {
            id: 2,
            name: 'Student'
        }];
        return of(new HttpResponse({ status: 200, body: roles }));
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
            grade: 84,
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

    getCoursesByTeacherId(req: HttpRequest<any>): Observable<HttpResponse<any>> {
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

    getStudentsByTeacherId(req: HttpRequest<any>): Observable<HttpResponse<any>> {
        const result = this.attendance;
        return of(new HttpResponse({ status: 200, body: result}));
    }

    getAllHolidays(req: HttpRequest<any>): Observable<HttpResponse<any>> {
        const result = [{
            holidayDate: '2021-01-14',
            occassion: 'Pongal',
            type: 'General'
        }, {
            holidayDate: '2021-01-26',
            occassion: 'Republic Day',
            type: 'General'
        }, {
            holidayDate: '2021-03-29',
            occassion: 'Holi',
            type: 'General'
        }, {
            holidayDate: '2021-04-02',
            occassion: 'Good Friday',
            type: 'Optional'
        }, {
            holidayDate: '2021-05-01',
            occassion: 'May Day',
            type: 'General'
        }, {
            holidayDate: '2021-08-16',
            occassion: 'Independence Day',
            type: 'General'
        }, {
            holidayDate: '2021-10-02',
            occassion: 'Gandhi Jayanthi',
            type: 'General'
        }];
        return of(new HttpResponse({ status: 200, body: result}));
    }

    getAttendanceByStudentIdandCourse(req: HttpRequest<any>): Observable<HttpResponse<any>> {
       const courseId = req.url.split('&')[1].split('=')[1];
       let courseName = '';
       switch(courseId) {
           case '2': courseName = 'Maths'; break;
           case '3': courseName = 'Physics'; break;
           case '4': courseName = 'Chemistry'; break;
           default: break;
       }
        const result = {
            history: courseName !== '' ? [{
                id: 1,
                course: courseName,
                attendedDate: '2021-09-03'
            }, {
                id: 2,
                course: courseName,
                attendedDate: '2021-09-03'
            }, {
                id: 3,
                course: courseName,
                attendedDate: '2021-09-03'
            }] : []
        };
        return of(new HttpResponse({ status: 200, body: result}));
    }

    getAttendanceByStudentIdandDate(req: HttpRequest<any>): Observable<HttpResponse<any>> {
        const date = req.url.split('&')[1].split('=')[1];
        const result = {
            history: date ? [{
                id: 1,
                course: 'Maths',
                attendedDate: date
            },{
                id: 2,
                course: 'Physics',
                attendedDate: date
            },{
                id: 3,
                course: 'Chemistry',
                attendedDate: date
            }] : []
        };
        return of(new HttpResponse({ status: 200, body: result}));
    }

    getSchoolsMappedToTeacher(req: HttpRequest<any>): Observable<HttpResponse<any>> {
        const mappedSchools = [{
            id: 1,
            name: 'Princeton School'
        }, {
            id: 2,
            name: 'St. Georgia School'
        }, {
            id: 3,
            name: 'St. Mary\'s School'
        }];
        return of(new HttpResponse({ status: 200, body: mappedSchools }));
    }
}
