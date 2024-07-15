import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8003/'; // Update with your actual API endpoint

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]> {
    const token = sessionStorage.getItem('accessToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get<any[]>(this.apiUrl + 'api/users/list', { headers });
  }


  addUser(user: any): Observable<any> {
    const token = sessionStorage.getItem('accessToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.post<any>(this.apiUrl + 'api/auth/signup', user, { headers });
  }
}
