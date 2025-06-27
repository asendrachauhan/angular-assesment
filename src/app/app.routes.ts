// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login-component/login.component';
import { DashboardComponent } from './dashboard/dashboard-component/dashboard-component';
// import { AdminComponent } from './admin/admin.component';

import { AuthGuard } from './auth/gaurds/auth.guard';
import { RoleGuard } from './auth/gaurds/role.guard';
import { ProjectListComponent } from './projects/project-list/project-list';
import { HomeComponent } from './shared/components/home-component/home-component';
import { TaskListComponent } from './tasks/task-list/task-list';
import { NotFound } from './shared/components/not-found/not-found';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login-component/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./shared/components/un-authorize/un-authorize').then((m) => m.UnAuthorize),
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard-component/dashboard-component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'projects',
        canActivate: [RoleGuard],
        canLoad: [RoleGuard],
        canActivateChild: [RoleGuard],
        data: { role: ['admin', 'project manager', 'developer'] },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./projects/project-list/project-list').then(
                (m) => m.ProjectListComponent
              ),
          },
          {
            path: ':projectId/tasks',
            loadComponent: () =>
              import('./tasks/task-list/task-list').then(
                (m) => m.TaskListComponent
              ),
          },
        ],
      },
      {
        path: 'users',
        canActivate: [RoleGuard],
        canLoad: [RoleGuard],
        canActivateChild: [RoleGuard],
        data: { role: ['admin'] },
        loadComponent: () =>
          import('./users/user-list/user-list').then((m) => m.UserList),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found').then((m) => m.NotFound),
  },
];
