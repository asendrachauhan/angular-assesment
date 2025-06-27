import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../project-service';
import { CommonService } from '../../core/services/commonService/common-service';
import { NotificationService } from '../../core/services/notification-service';
import { materialImports } from '../../core/models/material.imports';
import { Projects } from '../../core/models/project.model';

@Component({
  selector: 'app-project-form',
  imports: [CommonModule, ReactiveFormsModule, materialImports],
  providers: [provideNativeDateAdapter()],
  templateUrl: './project-form.html',
  styleUrl: './project-form.scss',
})
export class ProjectForm {
  public form: FormGroup;
  public currentDate: Date = new Date();
  public projectId: number = 0;
  public users: { id: string; fullName: string }[] = [{ id: '', fullName: '' }];
  public statuses = ['To Do', 'In Progress', 'Done'];
  public projectData = {} as Projects;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProjectForm>,
    private projectService: ProjectService,
    private commonService: CommonService,
    private notificationService: NotificationService
  ) {
    if (this.data && this.data.id) {
      this.projectId = this.data.id;
      this.getProject();
    }
    this.getUsers();
    this.form = this.fb.group({
      name: [this.projectData.name || '', Validators.required],
      startDate: [
        this.projectData.startDate || this.currentDate,
        Validators.required,
      ],
      deadlineDate: [this.projectData.deadlineDate || ''],
      assignedTo: [this.projectData.assignedTo || '', Validators.required],
      status: [this.projectData.status || '', Validators.required],
      description: [this.projectData.description || '', [Validators.required]],
    });
  }

  private getProject() {
    this.projectService.getProject(this.projectId).subscribe(
      (response) => {
        this.projectData = response;
        const { id, ...pro } = response;
        this.form.setValue(pro);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  private getUsers() {
    this.commonService.fetchUsers().subscribe((res) => {
      this.users = res.map(({ id, fullName }) => ({ id, fullName }));
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const UpdatedProject = { ...this.form.value, id: this.projectData.id };

      const response = this.projectId
        ? this.projectService.updateProject(UpdatedProject, this.projectId)
        : this.projectService.addProject(UpdatedProject);

      response.subscribe(
        (result) => {
          if (result) {
            this.dialogRef.close(true);
            const message = this.projectId
              ? 'Project Updated'
              : 'Project Created';
            this.commonService.openSuccessSnackBar(message, 'ok');
            if (result.assignedTo !== this.projectData.assignedTo) {
              this.notifyUser(result);
            }
          }
        },
        (error) => {
          this.commonService.openFailureSnackBar(
            'something went wrong',
            'try again!'
          );
        }
      );
    }
  }

  private notifyUser(project: Projects) {
    this.notificationService
      .create({
        userId: project.assignedTo,
        type: 'new-assignment',
        message: `You’ve been assigned to Project ${project.name}`,
        projectId: project.id,
        read: false,
        createdAt: new Date().toISOString(),
      })
      .subscribe(
        () => {},
        (err) => {
          this.commonService.openFailureSnackBar(
            'something went wrong',
            'try again!'
          );
        }
      );
  }
}
