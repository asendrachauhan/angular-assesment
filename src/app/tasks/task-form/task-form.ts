import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { TaskService } from '../task-service';
import { CommonService } from '../../core/services/commonService/common-service';
import { materialImports } from '../../core/models/material.imports';
import { Tasks } from '../../core/models/task.model';

@Component({
  selector: 'app-task-form',
  imports: [
    MatButtonModule,
    MatMenuModule,
    CommonModule,
    ReactiveFormsModule,
    materialImports,
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm {
  public form: FormGroup;
  public taskId: string = '';
  public users = ['Alice', 'Bob', 'Charlie'];
  public statuses = ['To Do', 'In Progress', 'Done'];
  public priorities = ['High', 'Medium', 'Low'];

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Tasks,
    public dialogRef: MatDialogRef<TaskForm>,
    private taskService: TaskService,
    private commonService: CommonService
  ) {
    const defaultData = this.data || {};

    if (defaultData) {
      this.taskId = defaultData.id;
    }

    this.form = this.fb.group({
      name: [defaultData.name || '', Validators.required],
      dueDate: [defaultData.dueDate || ''],
      status: [defaultData.status || 'To Do', Validators.required],
      priority: [defaultData.priority || 'Low', Validators.required],
      description: [defaultData.description || '', [Validators.required]],
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const UpdatedTask = {
        ...this.form.value,
        id: this.taskId,
        projectId: this.data.projectId,
      };

      const response = this.taskId
        ? this.taskService.updateTasks(UpdatedTask, this.taskId)
        : this.taskService.addTasks(UpdatedTask);

      response.subscribe(
        (result) => {
          if (result) {
            this.dialogRef.close(true);
            const message = this.taskId ? 'Task Updated' : 'Task Created';
            this.commonService.openSuccessSnackBar(message);
          }
        },
        (error) => {
          this.commonService.openFailureSnackBar('something went wrong');
        }
      );
    }
  }
}
