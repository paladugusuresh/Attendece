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
        school: 'Princeton School',
        contactSettings: 'internalMessaging'
    }, {
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        userName: 'adityaT',
        role: 'Student',
        email: 'stummala@gmail.com',
        school: '',
        dob: new Date(1991, 8, 16),
        contactSettings: 'internalMessaging'
    }, {
        userId: 3,
        firstName: 'Krithik',
        lastName: 'C',
        userName: 'krithik234',
        role: 'Student',
        school: '',
        email: 'krithik.c@gmail.com',
        dob: new Date(2011, 11, 20),
        contactSettings: 'internalMessaging'
    }, {
        userId: 4,
        firstName: 'Abhishek',
        lastName: 'C',
        userName: 'abhishekc234',
        role: 'Student',
        school: '',
        email: 'abhishek.c@gmail.com',
        dob: new Date(2011, 11, 20),
        contactSettings: 'internalMessaging'
    }, {
        userId: 5,
        firstName: 'Abhishek',
        lastName: 'K',
        userName: 'abhishekk234',
        role: 'Student',
        school: '',
        email: 'abhishek.k@gmail.com',
        dob: new Date(2011, 11, 20),
        contactSettings: 'internalMessaging'
    }, {
        userId: 6,
        firstName: 'Abhi',
        lastName: 'M',
        userName: 'abhim234',
        role: 'Student',
        school: '',
        email: 'abhi.m@gmail.com',
        dob: new Date(2011, 11, 20),
        contactSettings: 'internalMessaging'
    }, {
        userId: 7,
        firstName: 'Krishna',
        lastName: 'C',
        userName: 'krishnac234',
        role: 'Student',
        school: '',
        email: 'krishna.c@gmail.com',
        dob: new Date(2011, 11, 20),
        contactSettings: 'internalMessaging'
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
    date = new Date();
    attendanceHistory = [{
        id: 1,
        course: 'Maths',
        attendedDate: this.populateDate(this.date),
        isAcknowledged: false,
        enableAcknowledgement: false,
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        isTeacherAcknowledged: false,
        enableTeacherAcknowledgement: true,
        isSelfAcknowledged: false
    }, {
        id: 2,
        course: 'Physics',
        attendedDate: this.populateDate(this.date),
        isAcknowledged: false,
        enableAcknowledgement: false,
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        isTeacherAcknowledged: false,
        enableTeacherAcknowledgement: true,
        isSelfAcknowledged: true
    }, {
        id: 3,
        course: 'Chemistry',
        attendedDate: this.populateDate(this.date),
        isAcknowledged: false,
        enableAcknowledgement: false,
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        isTeacherAcknowledged: false,
        enableTeacherAcknowledgement: true,
        isSelfAcknowledged: true
    }, {
        id: 4,
        course: 'Maths',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 1))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 5,
        course: 'Physics',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 1))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 6,
        course: 'Chemistry',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 1))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 7,
        course: 'Maths',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 2))),
        isAcknowledged: false,
        enableAcknowledgement: false,
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 8,
        course: 'Physics',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 2))),
        isAcknowledged: false,
        enableAcknowledgement: false,
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 9,
        course: 'Chemistry',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 2))),
        isAcknowledged: false,
        enableAcknowledgement: false,
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        isTeacherAcknowledged: false,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 10,
        course: 'Maths',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 3))),
        isAcknowledged: false,
        enableAcknowledgement: false,
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        isTeacherAcknowledged: false,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 11,
        course: 'Physics',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 3))),
        isAcknowledged: false,
        enableAcknowledgement: false,
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        isTeacherAcknowledged: false,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 12,
        course: 'Chemistry',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 3))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 13,
        course: 'Maths',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 4))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 14,
        course: 'Physics',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 4))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 15,
        course: 'Chemistry',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 4))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 16,
        course: 'Maths',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 5))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 17,
        course: 'Physics',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 5))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 18,
        course: 'Chemistry',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 5))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 19,
        course: 'Maths',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 6))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 20,
        course: 'Physics',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 6))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 21,
        course: 'Chemistry',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 6))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 2,
        firstName: 'Aditya',
        lastName: 'T',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 22,
        course: 'Maths',
        attendedDate: this.populateDate(this.date),
        isAcknowledged: false,
        enableAcknowledgement: false,
        userId: 3,
        firstName: 'Krithik',
        lastName: 'C',
        isTeacherAcknowledged: false,
        enableTeacherAcknowledgement: true,
        isSelfAcknowledged: false
    }, {
        id: 23,
        course: 'Physics',
        attendedDate: this.populateDate(this.date),
        isAcknowledged: false,
        enableAcknowledgement: false,
        userId: 3,
        firstName: 'Krithik',
        lastName: 'C',
        isTeacherAcknowledged: false,
        enableTeacherAcknowledgement: true,
        isSelfAcknowledged: true
    }, {
        id: 24,
        course: 'Chemistry',
        attendedDate: this.populateDate(this.date),
        isAcknowledged: false,
        enableAcknowledgement: false,
        userId: 3,
        firstName: 'Krithik',
        lastName: 'C',
        isTeacherAcknowledged: false,
        enableTeacherAcknowledgement: true,
        isSelfAcknowledged: true
    }, {
        id: 25,
        course: 'Maths',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 1))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 3,
        firstName: 'Krithik',
        lastName: 'C',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 26,
        course: 'Physics',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 1))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 3,
        firstName: 'Krithik',
        lastName: 'C',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 27,
        course: 'Chemistry',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 1))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 3,
        firstName: 'Krithik',
        lastName: 'C',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 28,
        course: 'Maths',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 2))),
        isAcknowledged: false,
        enableAcknowledgement: false,
        userId: 3,
        firstName: 'Krithik',
        lastName: 'C',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 29,
        course: 'Physics',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 2))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 3,
        firstName: 'Krithik',
        lastName: 'C',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 30,
        course: 'Chemistry',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 2))),
        isAcknowledged: false,
        enableAcknowledgement: false,
        userId: 3,
        firstName: 'Krithik',
        lastName: 'C',
        isTeacherAcknowledged: false,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 31,
        course: 'Maths',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 3))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 3,
        firstName: 'Krithik',
        lastName: 'C',
        isTeacherAcknowledged: false,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 32,
        course: 'Physics',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 3))),
        isAcknowledged: false,
        enableAcknowledgement: false,
        userId: 3,
        firstName: 'Krithik',
        lastName: 'C',
        isTeacherAcknowledged: false,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 33,
        course: 'Chemistry',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 3))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 3,
        firstName: 'Krithik',
        lastName: 'C',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 34,
        course: 'Maths',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 4))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 3,
        firstName: 'Krithik',
        lastName: 'C',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 35,
        course: 'Physics',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 4))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 3,
        firstName: 'Krithik',
        lastName: 'C',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 36,
        course: 'Chemistry',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 4))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 3,
        firstName: 'Krithik',
        lastName: 'C',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 37,
        course: 'Maths',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 5))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 3,
        firstName: 'Krithik',
        lastName: 'C',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 38,
        course: 'Physics',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 5))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 3,
        firstName: 'Krithik',
        lastName: 'C',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 39,
        course: 'Chemistry',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 5))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 3,
        firstName: 'Krithik',
        lastName: 'C',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 40,
        course: 'Maths',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 6))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 3,
        firstName: 'Krithik',
        lastName: 'C',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 41,
        course: 'Physics',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 6))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 3,
        firstName: 'Krithik',
        lastName: 'C',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }, {
        id: 42,
        course: 'Chemistry',
        attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - 6))),
        isAcknowledged: true,
        enableAcknowledgement: false,
        userId: 3,
        firstName: 'Krithik',
        lastName: 'C',
        isTeacherAcknowledged: true,
        enableTeacherAcknowledgement: false,
        isSelfAcknowledged: false
    }];

    constructor() {
        let count = 0;
        const dateDifference = this.date.getDate() - 1 > 0 ? this.date.getDate() : this.date.getDate() === 1 ? 1 : this.date.getDate();
        for (let index = 7; index < dateDifference; index++) {
            this.attendanceHistory.push({
                id: 42 + (++count),
                course: 'Maths',
                attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - index))),
                isAcknowledged: true,
                enableAcknowledgement: false,
                userId: 2,
                firstName: 'Aditya',
                lastName: 'T',
                isTeacherAcknowledged: true,
                enableTeacherAcknowledgement: false,
                isSelfAcknowledged: false
            });
            this.attendanceHistory.push({
                id: 42 + (++count),
                course: 'Physics',
                attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - index))),
                isAcknowledged: true,
                enableAcknowledgement: false,
                userId: 2,
                firstName: 'Aditya',
                lastName: 'T',
                isTeacherAcknowledged: true,
                enableTeacherAcknowledgement: false,
                isSelfAcknowledged: false
            });
            this.attendanceHistory.push({
                id: 42 + (++count),
                course: 'Chemistry',
                attendedDate: this.populateDate(new Date(new Date().setDate(this.date.getDate() - index))),
                isAcknowledged: true,
                enableAcknowledgement: false,
                userId: 2,
                firstName: 'Aditya',
                lastName: 'T',
                isTeacherAcknowledged: true,
                enableTeacherAcknowledgement: false,
                isSelfAcknowledged: false
            });
        }
    }

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
            case req.url.endsWith('/UpdateAcknowledgement'):
                return this.updateAcknowledgement(req);
            case req.url.indexOf('/GetAttendanceReportData') > -1:
                return this.getAttendanceReportData(req);
            case req.url.indexOf('/GetStudentsAttendanceByCourseandDate') > -1:
                return this.getStudentsAttendanceByCourseandDate(req);
            case req.url.indexOf('/UpdateStudentAttendanceByTeacher') > -1:
                return this.updateStudentAttendanceByTeacher(req);
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
            user.id = this.users.sort((a, b) => a.userId - b.userId)[0].userId + 1;
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
        const date = new Date();
        const id = +req.url.split('/').splice(-1);
        const result = {
            averageAttendance: 74.5,
            grade: 84,
            history: this.attendanceHistory.filter((item) =>
             item.userId === id).slice(0, 3*6),
            totalDays: 64,
            daysPresent: 50,
            daysAbsent: 14
        };
        return of(new HttpResponse({ status: 200, body: result }));
    }

    getCoursesByStudentId(req: HttpRequest<any>): Observable<HttpResponse<any>> {
        const result = [{
            name: 'Maths',
            image: '/assets/imgs/maths.jpeg',
            avgAttendance: '70',
            id: 2
        }, {
            id: 3,
            name: 'Physics',
            avgAttendance: '50',
            image: '/assets/imgs/physics.jpeg'
        }, {
            id: 4,
            name: 'Chemistry',
            avgAttendance: '60',
            image: '/assets/imgs/chemistry.jpeg'
        }];
        return of(new HttpResponse({ status: 200, body: result }));
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
        return of(new HttpResponse({ status: 200, body: result }));
    }

    getStudentsByTeacherId(req: HttpRequest<any>): Observable<HttpResponse<any>> {
        const result = this.attendance;
        return of(new HttpResponse({ status: 200, body: result }));
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
        return of(new HttpResponse({ status: 200, body: result }));
    }

    getAttendanceByStudentIdandCourse(req: HttpRequest<any>): Observable<HttpResponse<any>> {
        const courseId = req.url.split('&')[1].split('=')[1];
        const studentId = req.url.split('?')[1].split('&')[0].split('=')[1];
        let courseName = '';
        switch (courseId) {
            case '2': courseName = 'Maths'; break;
            case '3': courseName = 'Physics'; break;
            case '4': courseName = 'Chemistry'; break;
            default: break;
        }
        const result = {
            history: courseName !== ''
                ? this.attendanceHistory
                    .filter((history) => history.course === courseName && history.userId === +studentId)
                : this.attendanceHistory
                    .filter((history) => history.userId === +studentId)
        };
        return of(new HttpResponse({ status: 200, body: result }));
    }

    getAttendanceByStudentIdandDate(req: HttpRequest<any>): Observable<HttpResponse<any>> {
        const date = req.url.split('&')[2].split('=')[1];
        const studentId = req.url.split('?')[1].split('&')[0].split('=')[1];
        const courseId = req.url.split('&')[1].split('=')[1];
        let courseName = '';
        let history = studentId ? this.attendanceHistory.filter(t => t.userId === +studentId) : [];
        switch (courseId) {
            case '2': courseName = 'Maths'; break;
            case '3': courseName = 'Physics'; break;
            case '4': courseName = 'Chemistry'; break;
            default: break;
        }
        if (courseName) {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            history = date && date !== 'null' ? this.attendanceHistory.filter((history) =>
                history.attendedDate === date && history.course === courseName && history.userId === +studentId)
                : history;
        }
        const result = {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            history: date && history.length === 0 ? this.attendanceHistory.filter((history) =>
                history.attendedDate === date && history.userId === +studentId)
                : history
        };
        return of(new HttpResponse({ status: 200, body: result }));
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

    updateAcknowledgement(req: HttpRequest<any>): Observable<HttpResponse<any>> {
        const { body } = req;
        const history = this.attendanceHistory.find(t => t.id === body.id);
        history.enableAcknowledgement = false;
        history.isAcknowledged = body.isAcknowledged;
        history.isSelfAcknowledged = false;
        return of(new HttpResponse({
            status: 200,
            body: 'Your acknowledgement is received and attendance information is updated successfully'
        }));
    }

    getAttendanceReportData(req: HttpRequest<any>): Observable<HttpEvent<any>> {
        const attendanceData = [65, 59, 80, 81, 56, 55, 40, 30, 20, 40, 60, 70];
        return of(new HttpResponse({ status: 200, body: attendanceData }));
    }

    updateStudentAttendanceByTeacher(req: HttpRequest<any>): Observable<HttpEvent<any>> {
        const { body } = req;
        const history = this.attendanceHistory.find(t => t.id === body.id);
        history.enableAcknowledgement = true;
        history.isTeacherAcknowledged = body.isTeacherAcknowledged;
        history.enableTeacherAcknowledgement = false;
        history.isSelfAcknowledged = false;
        const user = this.users.find(t => t.userId === history.userId);
        return of(new HttpResponse({
            status: 200,
            body: `${user.firstName}'s attendance information updated successfully`
        }));
    }

    getStudentsAttendanceByCourseandDate(req: HttpRequest<any>): Observable<HttpResponse<any>> {
        const date = req.url.split('&')[1].split('=')[1];
        const studentId = req.url.split('?')[1].split('&')[0].split('=')[1];
        const courseId = req.url.split('?')[1].split('&')[0].split('=')[1];
        let courseName = '';
        let history = [];
        switch (courseId) {
            case '2': courseName = 'Maths'; break;
            case '3': courseName = 'Physics'; break;
            case '4': courseName = 'Chemistry'; break;
            default: break;
        }
        if (courseName) {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            history = date ? this.attendanceHistory.filter((history) =>
                history.attendedDate === date && history.course === courseName)
                : history;
        }
        const result = {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            history: date && history.length === 0 ? this.attendanceHistory.filter((history) =>
                history.attendedDate === date)
                : history,
            total: date && history.length === 0 ? this.attendanceHistory.filter((t) =>
                t.attendedDate === date).length : history.length
        };
        return of(new HttpResponse({ status: 200, body: result }));
    }

    private populateDate(date: Date) {
        const month = `${date.getMonth() + 1 < 10 ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1}`;
        const day = `${date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()}`;
        const dateFormat = `${date.getFullYear()}-${month}-${day}`;
        return dateFormat;
    }
}
