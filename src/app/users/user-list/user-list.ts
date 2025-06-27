import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { CommonService } from '../../core/services/commonService/common-service';
import { Header } from '../../shared/components/header/header';
import { DuedatePipe } from '../../shared/pipes/duedate-pipe';
import { UserForm } from '../user-form/user-form';
import { UserService } from '../user-service';
import { materialImports } from '../../core/models/material.imports';
import { Users } from '../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Header,
    DuedatePipe,
    materialImports,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList {
  private sub!: Subscription;

  public users: Users[] = [];
  public displayedColumns: string[] = [
    'id',
    'name',
    'userName',
    'creationDate',
    'password',
    'role',
    'actions',
  ];
  public dataSource = new MatTableDataSource<any>(this.users);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.sub = this.commonService.search$.subscribe((term) => {
      const filteredData = this.commonService.filteredSearchData(
        term,
        this.users,
        ['id', 'fullName', 'userName', 'password', 'role']
      );
      this.dataSource.data = filteredData;
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    this.fetchUsers();
  }

  private updateDatasource() {
    this.dataSource.data = this.users;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Default sort: ID ascending
    this.sort.active = 'id';
    this.sort.direction = 'asc';

    this.sort.sortChange.emit({
      active: this.sort.active,
      direction: this.sort.direction,
    });
    this.cdr.detectChanges();
  }

  private fetchUsers() {
    this.userService.fetchUsers().subscribe(
      (response) => {
        this.users = response;

        this.updateDatasource();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public openForm(id?: string) {
    const dialogRef = this.dialog.open(UserForm, {
      data: { id },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchUsers();
      }
    });
  }

  public onDelete(userId: string) {
    this.userService.deleteUser(userId).subscribe(
      (res) => {
        if (res) {
          this.fetchUsers();
          this.commonService.openSuccessSnackBar('User Deleted');
        }
      },
      (err) => {
        console.log('something went wrong', err);
      }
    );
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
