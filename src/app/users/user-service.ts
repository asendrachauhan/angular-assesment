import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from '../core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  public fetchUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(this.apiUrl);
  }

  public getUser(id: string): Observable<Users> {
    return this.http.get<Users>(`${this.apiUrl}/${id}`);
  }

  public addUser(User: Users): Observable<Users> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Users>(this.apiUrl, User, { headers });
  }

  public updateUser(User: Users, id: string): Observable<Users> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch<Users>(`${this.apiUrl}/${id}`, User, { headers });
  }

  public deleteUser(id: string): Observable<Users> {
    return this.http.delete<Users>(`${this.apiUrl}/${id}`);
  }
}
