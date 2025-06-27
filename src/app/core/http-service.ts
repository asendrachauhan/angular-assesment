import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

   public baseUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }

  public async getProjects() {
    
     const result = await this.http.get(`${this.baseUrl}projects`)
    
     console.log(result)
  }
}
