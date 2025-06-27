import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tasks } from '../core/models/task.model';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
 public apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) { }

  public fetchTasks(projectId?: string): Observable<Tasks[]> {
     const url = projectId ? `${this.apiUrl}?projectId=${projectId}` : this.apiUrl
        return this.http.get<Tasks[]>(url);
    }

     public getTasks(id: string): Observable<Tasks> {
        return this.http.get<Tasks>(`${this.apiUrl}/${id}`);
    }

  public addTasks(project: Tasks): Observable<Tasks> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<Tasks>(this.apiUrl, project, { headers });
    }

  public updateTasks(project: Tasks, id: string): Observable<Tasks> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.patch<Tasks>(`${this.apiUrl}/${id}`, project, { headers });
    }
    

  public deleteTasks(id: string): Observable<Tasks> {
        return this.http.delete<Tasks>(`${this.apiUrl}/${id}`);
    }
}
