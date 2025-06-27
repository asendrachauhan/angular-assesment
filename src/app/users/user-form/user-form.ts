import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../user-service';
import { Observable } from 'rxjs';
import { userDialogData } from '../../core/models/dialogData.model';
import { CommonService } from '../../core/services/commonService/common-service';
import { materialImports } from '../../core/models/material.imports';
import { Users } from '../../core/models/user.model';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule, materialImports],
  providers: [provideNativeDateAdapter()],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm {
  public form: FormGroup;
  public currentDate: Date = new Date();
  public userId: string = '';
  public roles = ['Admin', 'Project Manager', 'Developer'];
  public userData = {} as Users;
  public canEdit: boolean = true;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: userDialogData,
    private dialogRef: MatDialogRef<UserForm>,
    private userService: UserService,
    private commonService: CommonService
  ) {
    if (this.data && this.data.id) {
      this.userId = this.data.id;
      this.canEdit = this.data.canEdit !== undefined ? this.data.canEdit : true;
      this.getUser();
    }

    this.form = this.fb.group({
      fullName: [this.userData.fullName || '', Validators.required],
      userName: [this.userData.userName || '', Validators.required],
      password: [this.userData.password || '', Validators.required],
      role: [this.userData.role || '', Validators.required],
    });

    if (!this.canEdit) {
      this.form.get('fullName')?.disable();
      this.form.get('userName')?.disable();
      this.form.get('password')?.disable();
      this.form.get('role')?.disable();
    }
  }

  private getUser() {
    this.userService.getUser(this.userId).subscribe(
      (response) => {
        this.userData = response;
        const { id, creationDate, ...pro } = response;
        this.form.setValue(pro);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public onSubmit(): void {
    if (!this.canEdit) {
      this.dialogRef.close();
    }
    if (this.form.valid) {
      let response: Observable<Users>;

      let UpdatedUser: Users = this.form.value;

      if (this.userId) {
        response = this.userService.updateUser(UpdatedUser, this.userId);
      } else {
        UpdatedUser['creationDate'] = new Date();
        response = this.userService.addUser(UpdatedUser);
      }

      response.subscribe(
        (result) => {
          if (result) {
            this.dialogRef.close(true);
            const msg = this.userId ? 'User Updated' : 'User Added';
            this.commonService.openSuccessSnackBar(msg);
          }
        },
        (error) => {
          this.commonService.openFailureSnackBar('something went wrong');
        }
      );
    }
  }
}
