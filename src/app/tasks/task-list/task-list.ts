import { ChangeDetectorRef, Component } from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskForm } from '../task-form/task-form';
import { Header } from '../../shared/components/header/header';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../task-service';
import { CommonService } from '../../core/services/commonService/common-service';
import { materialImports } from '../../core/models/material.imports';
import { Tasks } from '../../core/models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    Header,
    materialImports,
  ],
  styleUrls: ['./task-list.scss'],
})
export class TaskListComponent {
  public tasks: Tasks[] = [];

  statusFilter: string = '';
  sortField: string = '';
  private projectId: string = '';

  public filteredTasks: Tasks[] = [];

  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('projectId') || '';
    if (this.projectId) {
      this.fetchTasks(this.projectId);
    }
  }

  private fetchTasks(projectId: string) {
    this.taskService.fetchTasks(projectId).subscribe((res) => {
      this.tasks = res;
      this.filteredTasks = this.filterData();
      this.cdr.detectChanges();
    });
  }

  public filterData() {
    let result = [...this.tasks];
    if (this.statusFilter) {
      result = result.filter((t) => t.status === this.statusFilter);
    }
    if (this.sortField === 'dueDate') {
      result.sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
    }
    if (this.sortField === 'priority') {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      result.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    }
    return result;
  }

  public onDrop(event: CdkDragDrop<Tasks[]>) {
    this.sortField = '';
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    this.filteredTasks = this.filterData();
  }

  public openForm(task?: Tasks) {
    const dialogRef = this.dialog.open(TaskForm, {
      data: { ...task, projectId: this.projectId },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchTasks(this.projectId);
         this.cdr.detectChanges();
      }
    });
  }

  public deleteTask(id: string, name: string) {
    this.taskService.deleteTasks(id).subscribe((res) => {
      if (res) {
        this.fetchTasks(this.projectId);
        this.commonService.openSuccessSnackBar(`Task deleted`);
      }
    });
  }

  public updateStatus(id: string, status: string) {
    const updated = { status };
    this.taskService.updateTasks({ status } as Tasks, id).subscribe(
      (res) => console.log('status change'),
      (err) => console.log(err)
    );
  }

  public sortTasks(sortBy: 'dueDate' | 'priority') {
    this.sortField = sortBy;
    this.filteredTasks = this.filterData();
  }

  trackById(index: number, task: Tasks) {
  return task.id;
}
}
