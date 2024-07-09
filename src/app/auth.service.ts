import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';

import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8003/api/auth';

  constructor(private http: HttpClient) {
   }

   signIn(username: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/signin`;
    const body = {
      username: username,
      password: password
    };
    return this.http.post(url, body).pipe(
      tap((response:any) => {
        if (response && response.accessToken) {
          this.storeUserData(response);
        }
      }, error => {
      })
    );
  }

  signUp(signupdata: any): Observable<any> {

    const token = sessionStorage.getItem('accessToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const url = `${this.apiUrl}/signup`;
    const body = signupdata
    return this.http.post(url, body, {headers}).pipe(
      tap((response:any) => {
        if (response && response.accessToken) {
          this.storeUserData(response);
        }
      }, error => {
      })
    );
  }
  private storeUserData(response: any): void {
    sessionStorage.setItem('accessToken', response.accessToken);
    sessionStorage.setItem('email', response.email);
    sessionStorage.setItem('id', response.id.toString());
    sessionStorage.setItem('roles', JSON.stringify(response.roles));
    sessionStorage.setItem('tokenType', response.tokenType);
    sessionStorage.setItem('username', response.username);
  }

  getUserData(): any {
    if(typeof window !== 'undefined' && sessionStorage){
      return {
        accessToken: window.sessionStorage?.getItem('accessToken'),
        email: sessionStorage?.getItem('email'),
        id: sessionStorage?.getItem('id'),
        roles: JSON.parse(sessionStorage?.getItem('roles') || '[]'),
        tokenType: sessionStorage?.getItem('tokenType'),
        username: sessionStorage?.getItem('username')
      };
    }else{
      return {}
    }
  }

  clearUserData(): void {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('roles');
    sessionStorage.removeItem('tokenType');
    sessionStorage.removeItem('username');
  }


  logout(){
    if(typeof window !== 'undefined' && sessionStorage){
      sessionStorage.clear();
    }
  }
}
