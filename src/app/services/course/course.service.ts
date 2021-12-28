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

  getCoursesByStudentId(id: number): Observable<Response> {
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

  getCoursesByTeacherId(id: number, schoolId: number): Observable<Response> {
    const url = environment.apiPrefix + ApiResources.getCoursesByTeacherId;
    const response: Response = {
      failure: false, success: false
    };
    const request = {
      teacherId: id,
      schoolId
    }
    return this.apiService.postData(url, request).pipe(map((result) => {
      if (result instanceof HttpErrorResponse || result.error) {
        response.error = result.message || result.error;
        response.failure = true;
      } else {
        response.result = result.result;
        response.success = true;
      }
      return response;
    }), catchError((err: HttpErrorResponse) => {
      response.error = err.message;
      response.failure = true;
      return of(response);
    }));
  }

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
