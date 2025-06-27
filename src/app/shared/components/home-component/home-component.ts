import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Notification } from '../../../core/components/notification/notification';
import { TopHeader } from '../../../core/top-header/top-header';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { materialImports } from '../../../core/models/material.imports';

@Component({
  selector: 'app-home-component',
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    Notification,
    TopHeader,
    materialImports,
  ],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss',
})
export class HomeComponent {
  public isMobile: boolean = true;
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  constructor(private observer: BreakpointObserver) {}

  ngOnInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if (screenSize.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
      console.log(this.isMobile);
    });
  }
}
