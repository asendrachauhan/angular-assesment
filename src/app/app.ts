import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CronService } from './core/services/cron-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor(private cronService: CronService) {

  }
  protected title = 'angular-assesment';
}
