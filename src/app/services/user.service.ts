import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/users';
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user);
  }

  getProfile(): Observable<any> {
    const headers = new HttpHeaders({
      'x-auth-token': this.getToken(),
    });
    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string {
    return localStorage.getItem(this.tokenKey) || '';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Files

  uploadProfilePicture(file: File): Observable<any> {
    const formData: FormData = new FormData();
    console.log('FORM DATA BEFORE:', formData);
    formData.append('profilePic', file, file.name);
    const headers = new HttpHeaders({
      'x-auth-token': this.getToken(),
    });
    console.log(formData);
    console.log(file);
    console.log(file.name);
    return this.http
      .post('http://localhost:5000/api/users/profile-picture', formData, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Error uploading profile picture:', error);
          return throwError('Something went wrong with the file upload');
        })
      );
  }
}
