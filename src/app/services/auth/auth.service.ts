import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { ApiResources } from '../../constants';
import { environment } from '../../../environments/environment';
import { ApiService } from '../api.service';
import { catchError, map } from 'rxjs/operators';
import { Response } from '../../models';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  sessionData: any;
  token: string;
  userLoggedIn = new BehaviorSubject(false);

  constructor(private apiService: ApiService) { }

  isLoggedIn(): Promise<boolean> {
    const val = localStorage.getItem('token');
    return Promise.resolve(!!val);
  }

  login(userName: string, password: string): Observable<any> {
    const url = environment.apiPrefix + ApiResources.login;
    const request = {
      userName,
      password
    };
    const response: Response = {
      failure: false, success: false
    };
    return this.apiService.postData(url, request).pipe(map((result) => {
      if (result instanceof HttpErrorResponse || result.error) {
        response.error = result.message || result.error;
        response.failure = true;
      } else {
        result.userName = userName;
        result.fullName = result.fullName || `${result.firstName} ${result.lastName || ''}`;
        response.success = true;
        response.result = result;
        localStorage.setItem('sessionData', JSON.stringify(result));
        this.sessionData = result;
      }
      return response;
    }), catchError((err: HttpErrorResponse) => {
      response.error = err.message;
      response.failure = true;
      return of(response);
    }));
  }

  registerUser(user: any): Observable<any> {
    const url = environment.apiPrefix + ApiResources.registerUser;
    const response: Response = {
      failure: false, success: false
    };
    return this.apiService.postData(url, user).pipe(map((result) => {
      if (result instanceof HttpErrorResponse || result.error) {
        response.error = result.message || result.error;
        response.failure = true;
      } else {
        response.success = true;
        response.result = result;
      }
      return response;
    }), catchError((err: HttpErrorResponse) => {
      response.error = err.message;
      response.failure = true;
      return of(response);
    }));
  }

  changePassword(userId: number, oldPwd: string, newPwd: string, userName: string): Observable<any> {
    const url = `${environment.apiPrefix}${ApiResources.changePassword}?userId=${userId}&oldPwd=${oldPwd}&newPwd=${newPwd}`;
    const response: Response = {
      failure: false, success: false
    };
    const body = {
      oldPwd,
      newPwd,
      userId,
      userName
    };
    return this.apiService.postData(url, body).pipe(map((result) => {
      if (result instanceof HttpErrorResponse || result.error) {
        response.error = result.message || result.error;
        response.failure = true;
      } else {
        response.success = result;
        response.result = result;
      }
      return response;
    }), catchError((err: HttpErrorResponse) => {
      response.error = err.message;
      response.failure = true;
      return of(response);
    }));
  }

  forgotPassword(oldPwd: string, newPwd: string, userName: string): Observable<any> {
    const url = `${environment.apiPrefix}${ApiResources.forgotPassword}`;
    const response: Response = {
      failure: false, success: false
    };
    const body = {
      oldPwd,
      newPwd,
      userName
    };
    return this.apiService.postData(url, body).pipe(map((result) => {
      if (result instanceof HttpErrorResponse || result.error) {
        response.error = result.message || result.error;
        response.failure = true;
      } else {
        response.success = result;
        response.result = result;
      }
      return response;
    }), catchError((err: HttpErrorResponse) => {
      response.error = err.message;
      response.failure = true;
      return of(response);
    }));
  }

  updateProfile(user: any): Observable<any> {
    const url = environment.apiPrefix + ApiResources.updateProfile;
    const response: Response = {
      failure: false, success: false
    };
    return this.apiService.postData(url, user).pipe(map((result) => {
      if (result instanceof HttpErrorResponse || result.error) {
        response.error = result.message || result.error;
        response.failure = true;
      } else {
        response.success = true;
        response.result = result;
      }
      return response;
    }), catchError((err: HttpErrorResponse) => {
      response.error = err.message;
      response.failure = true;
      return of(response);
    }));
  }

  getAllRoles(): Observable<any> {
    const url = `${environment.apiPrefix}${ApiResources.getRoles}`;
    const response: Response = {
      failure: false, success: false
    };
    return this.apiService.getData(url, null).pipe(map((result) => {
      if (result instanceof HttpErrorResponse || result.error) {
        response.error = result.message || result.error;
        response.failure = true;
      } else {
        response.success = true;
        response.result = result;
      }
      return response;
    }), catchError((err: HttpErrorResponse) => {
      response.error = err.message;
      response.failure = true;
      return of(response);
    }));
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    this.token = localStorage.getItem('token');
    return this.token;
  }
}
