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
export class CourseService {
  courses = [];
  constructor(private apiService: ApiService) { }

  /**
   * Gets the courses mapped to student.
   *
   * @param id The student id.
   * @param schoolId The school id.
   * @returns The response object.
   */
  getCoursesByStudentId(id: number, schoolId: number): Observable<Response> {
    const url = environment.apiPrefix + ApiResources.getCoursesByStudentId;
    const response: Response = {
      failure: false, success: false
    };
    const request = {
      studentId: id,
      schoolId
    };
    return this.apiService.postData(url, request).pipe(map((res) => {
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
   * Gets the courses mapped to teacher.
   *
   * @param id The student id.
   * @param schoolId The school id.
   * @returns The response object.
   */
  getCoursesByTeacherId(id: number, schoolId: number): Observable<Response> {
    const url = environment.apiPrefix + ApiResources.getCoursesByTeacherId;
    const response: Response = {
      failure: false, success: false
    };
    const request = {
      teacherId: id,
      schoolId
    };
    return this.apiService.postData(url, request).pipe(map((res) => {
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
  getCourseByStudentIdandDate(id: number, date: string): Observable<Response> {
    const url = environment.apiPrefix + ApiResources.getCoursesByStudentId + '/' + id;
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

  // Need to remove in next version.
  getCourseByStudentandMonth(id: number, month: number): Observable<Response> {
    const url = environment.apiPrefix + ApiResources.getCoursesByStudentId + '/' + id;
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

  // Need to remove in next version.
  getCourseByTeacherandMonth(id: number, month: number): Observable<Response> {
    const url = environment.apiPrefix + ApiResources.getCoursesByStudentId + '/' + id;
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
}
