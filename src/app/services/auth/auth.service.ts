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

  /**
   * Validates the user based on the token.
   * @returns promise object.
   */
  isLoggedIn(): Promise<boolean> {
    return Promise.resolve(!!this.token);
  }

  /**
   * Authenticates the user using user id and password.
   * @param userId the user id.
   * @param password the password.
   * @returns response model.
   */
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

  /**
   * Registering the user.
   * @param user user object.
   * @returns response model.
   */
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

  /**
   * Changes the password of the user.
   * @param userId the user id.
   * @param oldPwd the old password of user.
   * @param newPwd the new password of user.
   * @param userName the user name.
   * @returns response model.
   */
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

  /**
   * Changes the password of the unknown user based on user name. 
   * @param oldPwd the old password of user.
   * @param newPwd the new password of user.
   * @param userName the user name.
   * @returns response model.
   */
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

  /**
   * Updates the user details.
   * @param user the user object.
   * @returns response model.
   */
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

  /**
   * Gets the roles.
   * @returns response model.
   */
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

  /**
   * Sets the token of logged in user into application storage.
   * @param token the token.
   */
  setToken(token: string) {
    Storage.set({ key: 'token', value: token }).then(() => {});
    this.token = token;
  }

  /**
   * Gets the token of the logged in user from application storage.
   * @returns the token.
   */
  getToken() {
    return this.token;
  }

  /**
   * Update the authorized user session details once application is loading for first time.
   * @param sessionData the session data of the logged in user.
   * @param token the token.
   */
  updateAuthData(sessionData: string, token: string) {
    this.token = token;
    this.sessionData = sessionData;
  }
}
