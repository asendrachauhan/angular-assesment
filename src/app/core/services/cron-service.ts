import { Injectable } from '@angular/core';
import { ProjectService } from '../../projects/project-service';
import { TaskService } from '../../tasks/task-service';
import { firstValueFrom, forkJoin, takeUntil } from 'rxjs';
import { NotificationService } from './notification-service';
import { Projects } from '../models/project.model';
import { Tasks } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class CronService {
  public tasks: Tasks[] = [];
  public projects: Projects[] = [];

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private notificationService: NotificationService
  ) {
    this.scheduleMidnightCheck();
  }

  private scheduleMidnightCheck() {
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0,
      0
    );

    const msUntilMidnight = nextMidnight.getTime() - now.getTime();

    setTimeout(() => {
      this.checkOverdueTasks();
      this.scheduleMidnightCheck(); // schedule again for the next day
    }, msUntilMidnight);
  }

  public async checkOverdueTasks() {
    await this.fetchData();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log(this.tasks, this.projects);
    const overdueToday = this.tasks.filter((task) => {
      if (!task.dueDate || task.status.toLowerCase() === 'Done') return false;

      const due = new Date(task.dueDate);
      due.setHours(0, 0, 0, 0);
      console.log(due.getTime() === today.getTime());
      return due.getTime() === today.getTime();
    });

    overdueToday.forEach((task) => {
      console.log(task);
      this.createNotification(task);
    });
  }

  public async fetchData(): Promise<void> {
    const [tasks, projects] = await firstValueFrom(
      forkJoin([
        this.taskService.fetchTasks(),
        this.projectService.fetchProjects(),
      ])
    );
    this.tasks = tasks;
    this.projects = projects;
  }
  private createNotification(task: Tasks) {
    const project = this.projects.find((p) => p.id == task.projectId);

    if (project) {
      this.notificationService
        .create({
          userId: project.assignedTo,
          type: 'task-overdue',
          message: `Task ${task.name} will be overdue today`,
          projectId: project.id,
          taskId: task.id,
          read: false,
          createdAt: new Date().toISOString(),
        })
        .subscribe();
    }
  }

  // this function use forn testing that it emit at particular time for testing purpose 

  // private scheduleTaskAtParticularTime() {
  //   const now = new Date();
  //   const target = new Date();

  //   target.setHours(3, 46, 0, 0); // 3:46 AM today

  //   // If it's already past 3:21 AM, schedule for tomorrow
  //   if (now > target) {
  //     target.setDate(target.getDate() + 1);
  //   }

  //   const delay = target.getTime() - now.getTime();

  //   setTimeout(() => {
  //     this.checkOverdueTasks();
  //     this.scheduleTaskAtParticularTime(); // Reschedule for the next day
  //   }, delay);
  // }
}
