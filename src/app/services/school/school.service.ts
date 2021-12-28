import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiResources } from '../../constants';
import { environment } from '../../../environments/environment';
import { ApiService } from '../api.service';
import { Response } from '../../models';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  constructor(private apiService: ApiService) { }

  getSchoolsMappedToTeacher(id: number) {
    const url = `${environment.apiPrefix}${ApiResources.getSchoolsMappedToTeacher}?teacherId=${id}`;
    const response: Response = {
      failure: false, success: false
    };
    return this.apiService.getData(url, null).pipe(map((res) => {
      if (res instanceof HttpErrorResponse || res.error) {
        response.error = res.message || res.error;
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
