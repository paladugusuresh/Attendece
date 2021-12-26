import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { ApiResources } from '../../constants';
import { environment } from '../../../environments/environment';
import { ApiService } from '../api.service';
import { catchError, map } from 'rxjs/operators';
import { Response } from '../../models';
import { HttpErrorResponse } from '@angular/common/http';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  sessionData: any;
  token: string;
  userLoggedIn = new BehaviorSubject(false);

  constructor(private apiService: ApiService) { }

  isLoggedIn(): Promise<boolean> {
    return Promise.resolve(!!this.token);
  }

  login(userId: string, password: string): Observable<any> {
    const url = environment.apiPrefix + ApiResources.login;
    const request = {
      userId,
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
        result.result.userName = userId;
        result.result.fullName = result.fullName || `${result.firstName} ${result.lastName || ''}`;
        response.success = true;
        response.result = result.result;
        Storage.set({key: 'sessionData', value: JSON.stringify(result.result) });
        this.sessionData = result.result;
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
    Storage.set({ key: 'token', value: token }).then(() => {});
    this.token = token;
  }

  getToken() {
    return this.token;
  }

  updateAuthData(sessionData: string, token: string) {
    this.token = token;
    this.sessionData = sessionData;
  }
}
