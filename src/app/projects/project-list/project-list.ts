import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, takeUntil } from 'rxjs';
import { ProjectForm } from '../project-form/project-form';
import { Header } from '../../shared/components/header/header';
import { CommonService } from '../../core/services/commonService/common-service';
import { DuedatePipe } from '../../shared/pipes/duedate-pipe';
import { ProjectService } from '../project-service';
import { Router } from '@angular/router';
import { UserNamePipe } from '../../shared/pipes/user-name-pipe';
import { materialImports } from '../../core/models/material.imports';
import { Projects } from '../../core/models/project.model';
import { Users } from '../../core/models/user.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProjectForm,
    Header,
    DuedatePipe,
    materialImports,
    UserNamePipe,
  ],
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.scss'],
})
export class ProjectListComponent implements OnInit, OnDestroy {
  public displayedColumns: string[] = [
    'id',
    'name',
    'assignTo',
    'status',
    'startDate',
    'deadline',
    'description',
    'actions',
  ];

  public dataSource = new MatTableDataSource<Projects>([]);
  public isLoading = false;

  private destroy$ = new Subject<void>();
  private projects: Projects[] = [];
  public users: Users[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private commonService: CommonService,
    private projectService: ProjectService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.commonService.search$
      .pipe(takeUntil(this.destroy$))
      .subscribe((term) => {
        const filtered = this.commonService.filteredSearchData(
          term,
          this.projects,
          ['name', 'status']
        );
        this.dataSource.data = filtered;
        this.cdr.detectChanges();
      });

    this.getUsers();
  }

  ngAfterViewInit(): void {
    this.fetchProjects();
  }

  private getUsers() {
    this.commonService.fetchUsers().subscribe((next) => {
      this.users = next;
    });
  }

  private updateDatasource() {
    this.dataSource.data = this.projects;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Default sort: ID ascending
    this.sort.active = 'id';
    this.sort.direction = 'asc';

    this.sort.sortChange.emit({
      active: this.sort.active,
      direction: this.sort.direction,
    });
  }

  private fetchProjects(): void {
    this.projectService.fetchProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.updateDatasource();
      },
      error: (err) => {
        console.error('Failed to fetch projects:', err);
        this.isLoading = false;
      },
    });
  }

  public openForm(id?: number): void {
    const dialogRef = this.dialog.open(ProjectForm, {
      data: { id },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.fetchProjects();
    });
  }

  public onDelete(projectId: number, projectName: string): void {
    this.projectService.deleteProject(projectId).subscribe({
      next: (res) => {
        if (res) {
          this.fetchProjects();
          this.commonService.openSuccessSnackBar(
            `${projectName} Project Deleted`
          );
        }
      },
      error: () => alert('Something went wrong'),
    });
  }

  public addNew(): void {
    this.dialog.open(ProjectForm, { width: '400px' });
  }

  public redirectToTask(id: string): void {
    this.router.navigate(['/projects', id, 'tasks']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
