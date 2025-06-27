import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartDataset, ChartOptions, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { UserService } from '../../users/user-service';
import { ProjectService } from '../../projects/project-service';
import { TaskService } from '../../tasks/task-service';
import { CommonService } from '../../core/services/commonService/common-service';
import { Kpis } from '../../core/models/dashboard.model';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { materialImports } from '../../core/models/material.imports';
import { Projects } from '../../core/models/project.model';
import { Tasks } from '../../core/models/task.model';
import { Users } from '../../core/models/user.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, materialImports],
  templateUrl: './dashboard-component.html',
  styleUrls: ['./dashboard-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  public users: Users[] = [];
  public tasks: Tasks[] = [];
  public projects: Projects[] = [];
  public kpis: Kpis[] = [];
  public isLoading: boolean = false;

  public taskChartData = this.initChartData();
  public projectChartData = this.initChartData();

  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  private destroy$ = new Subject<void>();

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private taskService: TaskService,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    forkJoin([
      this.userService.fetchUsers(),
      this.taskService.fetchTasks(),
      this.projectService.fetchProjects(),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([users, tasks, projects]) => {
        this.users = users;
        this.tasks = tasks;
        this.projects = projects;

        requestIdleCallback(() => {
          this.buildDashboard();
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      });
  }

  trackByLabel(index: number, item: Kpis): string {
    return item.label;
  }

  private buildDashboard(): void {
    // KPIs
    this.kpis = [
      { label: 'Users', value: this.users.length },
      { label: 'Total Tasks', value: this.tasks.length },
      {
        label: 'Overdue Tasks',
        value: this.commonService.getOverdueTasks(this.tasks).length,
      },
      { label: 'Total Projects', value: this.projects.length },
      {
        label: 'Overdue Projects',
        value: this.commonService.getOverdueProjects(this.projects).length,
      },
    ];

    // Tasks Chart
    const taskStatus = this.countByStatus(this.tasks);
    this.taskChartData = {
      labels: ['Done', 'In Progress', 'To Do'],
      datasets: [
        {
          data: [
            taskStatus['done'] || 0,
            taskStatus['in progress'] || 0,
            taskStatus['to do'] || 0,
          ],
          backgroundColor: ['#32a864', '#8ba832', '#3432a8'],
        },
      ],
    };

    // Projects Chart
    const projectStatus = this.countByStatus(this.projects);
    this.projectChartData = {
      labels: ['Done', 'In Progress', 'To Do'],
      datasets: [
        {
          data: [
            projectStatus['done'] || 0,
            projectStatus['in progress'] || 0,
            projectStatus['to do'] || 0,
          ],
          backgroundColor: ['#66BB6A', '#FFA726', '#EF5350'],
        },
      ],
    };
  }

  private initChartData(): { labels: string[]; datasets: ChartDataset[] } {
    return {
      labels: ['Done', 'In Progress', 'To Do'],
      datasets: [
        {
          data: [],
          backgroundColor: ['#66BB6A', '#FFA726', '#EF5350'],
        },
      ],
    };
  }

  private countByStatus<T extends { status: string }>(
    items: T[]
  ): { [key: string]: number } {
    return items.reduce((acc, item) => {
      const key = item.status.toLowerCase();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
