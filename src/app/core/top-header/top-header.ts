import { Component } from '@angular/core';
import { Notification } from '../components/notification/notification';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/authService/auth-service';
import { CommonService } from '../services/commonService/common-service';
import { MatDialog } from '@angular/material/dialog';
import { UserForm } from '../../users/user-form/user-form';
import { materialImports } from '../models/material.imports';

@Component({
  selector: 'app-top-header',
  imports: [Notification, CommonModule, materialImports],
  templateUrl: './top-header.html',
  styleUrl: './top-header.scss',
})
export class TopHeader {
  constructor(
    private authService: AuthService,
    private commonService: CommonService,
    private dialog: MatDialog
  ) {}

  public logOut() {
    this.authService.logout();
    this.commonService.openSuccessSnackBar('LogOut successfully', 'ok');
  }

  public viewProfile() {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser.id) {
      const dialogRef = this.dialog.open(UserForm, {
        data: { id: currentUser.id, canEdit: false },
        width: '400px',
      });
      dialogRef.afterClosed().subscribe((result) => {});
    }
  }
}
