import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiResources } from '../../constants';
import { environment } from '../../../environments/environment';
import { ApiService } from '../api.service';
import { catchError, map } from 'rxjs/operators';
import { Response } from '../../models';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private apiService: ApiService) { }

  // Needs to remove in next version release.
  getLastDayAttendanceByStudentId(id: number): Observable<Response> {
    const url = environment.apiPrefix + ApiResources.getLastDayAttendanceByStudentId + '/' + id;
    const response: Response = {
      failure: false, success: false
    };
    return this.apiService.getData(url, null).pipe(map((result) => {
      if (result instanceof HttpErrorResponse || result.error) {
        response.error = result.message || result.error;
        response.failure = true;
      } else {
        response.result = result;
        response.success = true;
      }
      return response;
    }), catchError((err: HttpErrorResponse) => {
      response.error = err.message;
      response.failure = true;
      return of(response);
    }));
  }

  // Needs to remove in next version release.
  getAttendanceByStudentIdandCourseId(id: number, courseId: number): Observable<Response> {
    const url = `${environment.apiPrefix}${ApiResources.getAttendanceByStudentIdandCourseId}?studentId=${id}&courseId=${courseId}`;
    const response: Response = {
      failure: false, success: false
    };
    return this.apiService.getData(url, null).pipe(map((result) => {
      if (result instanceof HttpErrorResponse || result.error) {
        response.error = result.message || result.error;
        response.failure = true;
      } else {
        response.result = result;
        response.success = true;
      }
      return response;
    }), catchError((err: HttpErrorResponse) => {
      response.error = err.message;
      response.failure = true;
      return of(response);
    }));
  }

  /**
   * Gets the student attendance.
   *
   * @param id The student id.
   * @param schoolId The school id.
   * @param courseId The course id.
   * @param startDate The start date.
   * @param endDate The end date.
   * @param pageIndex The page index.
   * @param pageSize The page size.
   * @returns response object.
   */
  getAttendanceByStudentCourseandDate(id: number, schoolId: number, courseId: number,
    startDate: string, endDate: string, pageIndex: number, pageSize: number): Observable<Response> {
    const url = `${environment.apiPrefix}${ApiResources.getAttendanceByStudentIdandDate}`;
    const response: Response = {
      failure: false, success: false
    };
    const req = {
      schoolId,
      courseId,
      studentId: id,
      startDate,
      endDate,
      pageIndex,
      pageSize
    };
    return this.apiService.postData(url, req).pipe(map((res) => {
      if (res instanceof HttpErrorResponse || res.message?.toLowerCase() === 'failure') {
        response.error = res.result || res.message;
        response.failure = true;
      } else {
        if (typeof(res.result) === 'string' && res.result.indexOf('Holiday') > -1) {
          response.result = { total: 0, history: [] };
          response.error = this.populateHolidayResponseMessage(startDate);
        } else {
          response.result = res.result;
          response.result.history = this.populateAttendanceResponse(response.result.history);
        }
        response.success = true;
      }
      return response;
    }), catchError((err: HttpErrorResponse) => {
      response.error = err.message;
      response.failure = true;
      return of(response);
    }));
  }

  /**
   * Gets the student attendance annual report details.
   *
   * @param id The student id.
   * @returns response object
   */
  getStudentAttendanceDetails(id: number): Observable<Response> {
    const url = `${environment.apiPrefix}${ApiResources.getStudentAttendanceDetails}?studentId=${id}`;
    const response: Response = {
      failure: false, success: false
    };
    return this.apiService.postData(url, null).pipe(map((res) => {
      if (res instanceof HttpErrorResponse || res.message?.toLowerCase() === 'failure') {
        response.error = res.result || res.message;
        response.failure = true;
      } else {
        response.result = res.result;
        response.success = true;
      }
      return response;
    }), catchError((err: HttpErrorResponse) => {
      response.error = err.message;
      response.failure = true;
      return of(response);
    }));
  }

  /**
   * Updates the attendance acknowledgement details by student.
   *
   * @param req The attendance history request object.
   * @returns The request object.
   */
  updateAcknowledement(req: any): Observable<Response> {
    const url = `${environment.apiPrefix}${ApiResources.updateStudentAcknowledgement}`;
    const response: Response = {
      failure: false, success: false
    };
    return this.apiService.postData(url, req).pipe(map((res) => {
      if (res instanceof HttpErrorResponse || res.message?.toLowerCase() === 'failure') {
        response.error = res.result || res.message;
        response.failure = true;
      } else {
        response.result = res.result;
        response.success = true;
      }
      return response;
    }), catchError((err: HttpErrorResponse) => {
      response.error = err.message;
      response.failure = true;
      return of(response);
    }));
  }

  // Need to remove in next version.
  getAttendanceReportData(id: number): Observable<Response> {
    const url = `${environment.apiPrefix}${ApiResources.getAttendanceReportData}?studentId=${id}`;
    const response: Response = {
      failure: false, success: false
    };
    return this.apiService.getData(url, null).pipe(map((result) => {
      if (result instanceof HttpErrorResponse || result.error) {
        response.error = result.message || result.error;
        response.failure = true;
      } else {
        response.result = result;
        response.success = true;
      }
      return response;
    }), catchError((err: HttpErrorResponse) => {
      response.error = err.message;
      response.failure = true;
      return of(response);
    }));
  }

  /**
   * Gets the students attendance mapped to teacher.
   *
   * @param id The student id.
   * @param schoolId The school id.
   * @param courseId The course id.
   * @param startDate The start date.
   * @param endDate The end date.
   * @param pageIndex The page index.
   * @param pageSize The page size.
   * @returns response object.
   */
  getStudentsAttendanceByCourseandDate(id: number, schoolId: number, courseId: number,
    startDate: string, endDate: string, pageIndex: number, pageSize: number): Observable<Response> {
    const url = `${environment.apiPrefix}${ApiResources.getStudentsAttendanceByCourseandDate}`;
    const response: Response = {
      failure: false, success: false
    };
    const req = {
      schoolId,
      courseId,
      teacherId: id,
      startDate,
      endDate,
      pageIndex,
      pageSize
    };
    return this.apiService.postData(url, req).pipe(map((res) => {
      if (res instanceof HttpErrorResponse || res.message?.toLowerCase() === 'failure') {
        response.error = res.result || res.message;
        response.failure = true;
      } else {
        if (typeof(res.result) === 'string' && res.result.indexOf('Holiday') > -1) {
          response.result = { total: 0, history: [] };
          response.error = this.populateHolidayResponseMessage(startDate);
        } else {
          response.result = res.result;
          response.result.history = this.populateAttendanceResponse(response.result.history);
        }
        response.success = true;
      }
      return response;
    }), catchError((err: HttpErrorResponse) => {
      response.error = err.message;
      response.failure = true;
      return of(response);
    }));
  }

  /**
   * Updates the attendance acknowledgement details by teacher.
   *
   * @param req The attendance history request object.
   * @returns The response object.
   */
  updateStudentAttendanceByTeacher(req: any): Observable<Response> {
    const url = `${environment.apiPrefix}${ApiResources.updateStudentAttendanceByTeacher}`;
    const response: Response = {
      failure: false, success: false
    };
    return this.apiService.postData(url, req).pipe(map((res) => {
      if (res instanceof HttpErrorResponse || res.message?.toLowerCase() === 'failure') {
        response.error = res.result || res.message;
        response.failure = true;
      } else {
        response.result = res.result;
        response.success = true;
      }
      return response;
    }), catchError((err: HttpErrorResponse) => {
      response.error = err.message;
      response.failure = true;
      return of(response);
    }));
  }

  /**
   * Enables/Disables the self marking the attendance.
   *
   * @param id The teacher id.
   * @param courseId The course id.
   * @param isEnable The flag to update self marking status.
   * @returns The response object
   */
  enableOrDisableSelfMarking(id: number, courseId: number, isEnable: boolean): Observable<Response> {
    const url = `${environment.apiPrefix}${ApiResources.enableOrDisableSelfMarking}/${isEnable ? 'enable' : 'disable'}`;
    const req = {
      teacherId: id,
      courseId
    };
    const response: Response = {
      failure: false, success: false
    };
    return this.apiService.postData(url, req).pipe(map((res) => {
      if (res instanceof HttpErrorResponse || res.message?.toLowerCase() === 'failure') {
        response.error = res.result || res.message;
        response.failure = true;
      } else {
        response.result = res.result;
        response.success = true;
      }
      return response;
    }), catchError((err: HttpErrorResponse) => {
      response.error = err.message;
      response.failure = true;
      return of(response);
    }));
  }

  /**
   * Gets the self marking status.
   *
   * @param id The teacher id.
   * @param schoolId The school id.
   * @param courseId The course id.
   * @returns The response object.
   */
  getSelfMarkStatus(id: number, schoolId: number, courseId: number): Observable<Response> {
    const url = `${environment.apiPrefix}${ApiResources.getSelfMarkStatus}?courseId=${courseId}`;
    const response: Response = {
      failure: false, success: false
    };
    return this.apiService.getData(url, null).pipe(map((res) => {
      if (res instanceof HttpErrorResponse || res.message?.toLowerCase() === 'failure') {
        response.error = res.result || res.message;
        response.failure = true;
      } else {
        response.result = res.result;
        response.success = true;
      }
      return response;
    }), catchError((err: HttpErrorResponse) => {
      response.error = err.message;
      response.failure = true;
      return of(response);
    }));
  }

  /**
   * Populates the holiday date in 'MMM dd, YYYY' format.
   *
   * @param fromDate The from date.
   * @returns date string
   */
  private populateHolidayResponseMessage(fromDate: string) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (fromDate) {
      const startDate = new Date(fromDate);
      if (startDate.toDateString() === new Date().toDateString()) {
        return '';
      }
      return `${months[startDate.getMonth()]} ${startDate.getDate() < 10
        ? ('0' + startDate.getDate())
        : startDate.getDate()}, ${startDate.getFullYear()} is Holiday`;
    } else {
      return 'Selected date is holiday';
    }
  }

  /**
   * Populates the attendance response with isTeacherAcknowledged & isAcknowledged flag.
   *
   * @param attendanceHistory The attendance history of student(s).
   * @returns The attendance history array.
   */
  private populateAttendanceResponse(attendanceHistory: Array<any>) {
    attendanceHistory.forEach((val: any) => {
      val.isTeacherAcknowledged = val.teacherAcknowledged === 'Y' ? true : false;
      val.isAcknowledged = val.selfAcknowledged === 'Y' ? true : val.isTeacherAcknowledged;
    });
    return attendanceHistory;
  }
}
