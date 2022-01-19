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
export class StudentService {

  constructor(private apiService: ApiService) { }

  getStudentsByTeacherId(id: number): Observable<Response> {
    const url = environment.apiPrefix + ApiResources.getStudentsByTeacherId + `/${id}`;
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
   * Gets the academic years of school
   *
   * @param id the school id.
   * @returns response model.
   */
  getAcademicYearsBySchoolId(id: number): Observable<Response> {
    const url = `${environment.apiPrefix}${ApiResources.getAcademicYearsBySchoolId}?schoolId=${id}`;
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
}
