import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://localhost:5000/api/posts'; // Your backend API URL
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  getToken(): string {
    return localStorage.getItem(this.tokenKey) || '';
  }

  // Service method to create a new post
  createPost(postData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'x-auth-token': this.getToken(),
    });
    return this.http.post(`${this.apiUrl}/create`, postData, { headers });
  }

  getPosts(): Observable<any> {
    const headers = new HttpHeaders({
      'x-auth-token': this.getToken(),
    });
    return this.http.get(`${this.apiUrl}/`, { headers });
  }
}
