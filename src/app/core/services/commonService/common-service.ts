import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { debounceTime, Observable, shareReplay, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToasterComponent } from '../../../shared/components/toaster-component/toaster-component';
import { Projects } from '../../models/project.model';
import { Tasks } from '../../models/task.model';
import { Users } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private searchInput = new Subject<string>();

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  // Debounced, shared observable
  public search$: Observable<string> = this.searchInput.asObservable().pipe(
    debounceTime(500),
    shareReplay(1) // So late subscribers get the last value
  );

  public triggerSearch(term: string) {
    this.searchInput.next(term);
  }

  public filteredSearchData(
    searchTerm: string,
    data: any,
    keysToSearch: string[]
  ) {
    if (!searchTerm?.trim()) return data;

    const escapedTerm = this.escapeRegExp(searchTerm.trim());
    const regex = new RegExp(escapedTerm, 'i'); // 'i' for case-insensitive

    return data.filter((item: any) =>
      keysToSearch.some((key) => regex.test(item[key]))
    );
  }

  private escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape special regex chars
  }

  public fetchUsers(): Observable<Users[]> {
    const apiUrl = 'http://localhost:3000/users';
    return this.http.get<Users[]>(apiUrl);
  }

  //Snackbar that opens with success background
  public openSuccessSnackBar(message: string, action: string = 'ok') {
    this.snackBar.openFromComponent(ToasterComponent,
      {
     data: {
      message: message,
      action: action,
      type: 'success',
      snackBar: this.snackBar
     },
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  //Snackbar that opens with failure background
  public openFailureSnackBar(message: string, action: string = 'try again!') {
    this.snackBar.openFromComponent(ToasterComponent,
      {
     data: {
      message: message,
      action: action,
      type: 'error',
      snackBar: this.snackBar
     },
      duration: 3000000,
      panelClass: 'error-snackbar',
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  public getCurrentUser(): { id: string; role: string } {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user;
  }

  public getOverdueTasks(tasks: Tasks[]): Tasks[] {
    const now = new Date();
    return tasks.filter((task) => {
      const due = new Date(task.dueDate);
      return task.status !== 'Done' && due < now;
    });
  }

  public getOverdueProjects(projects: Projects[]): Projects[] {
    const now = new Date();
    return projects.filter((task) => {
      const due = new Date(task.deadlineDate);
      return task.status !== 'Done' && due < now;
    });
  }
}
