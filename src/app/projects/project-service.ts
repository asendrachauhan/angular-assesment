import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Projects } from '../core/models/project.model';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  public apiUrl = 'http://localhost:3000/projects';

  constructor(private http: HttpClient) { }

  public fetchProjects(): Observable<Projects[]> {
        return this.http.get<Projects[]>(this.apiUrl);
    }

     public getProject(id: number): Observable<Projects> {
        return this.http.get<Projects>(`${this.apiUrl}/${id}`);
    }

  public addProject(project: Projects): Observable<Projects> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<Projects>(this.apiUrl, project, { headers });
    }

  public updateProject(project: Projects, id: number): Observable<Projects> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.patch<Projects>(`${this.apiUrl}/${id}`, project, { headers });
    }

  public deleteProject(id: number): Observable<Projects> {
        return this.http.delete<Projects>(`${this.apiUrl}/${id}`);
    }
}
