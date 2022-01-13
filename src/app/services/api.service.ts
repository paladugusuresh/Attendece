import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private postheaders = new HttpHeaders().set('Content-Type', 'application/json');
    constructor(private http: HttpClient) { }

    getData(url: string, options: any, params?: any): Observable<any> {
        const requestParams = this.populateRequestHeaderParams(options, params);
        return this.http.get(url, { params: requestParams }).pipe((response) => response, (error) => error);
    }

    postData(url: string, body: any): Observable<any> {
        return this.http.post(url, body, { headers: this.postheaders }).pipe((response) => response, (error) => error);
    }

    uploadFile(url: string, body: any): Observable<any> {
        const headers = {};
        return this.http.post(url, body, { headers }).pipe((response) => response, (error) => error);
    }

    updateData(url: string, body: any): Observable<any> {
        return this.http.put(url, body).pipe((response) => response, (error) => error);
    }

    deleteData(url: string): Observable<any> {
        return this.http.delete(url).pipe((response) => response, (error) => error);
    }

    private populateRequestHeaderParams(modelData: any, jsonparams?: any): HttpParams {
        let params = new HttpParams();
        if (modelData) {
            Object.keys(jsonparams).forEach(element => {
                params = params.set(element, modelData[element]);
            });
        }
        return params;
    }
}
