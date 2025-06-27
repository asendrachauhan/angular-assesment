import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-toaster-component',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './toaster-component.html',
  styleUrl: './toaster-component.scss',
})
export class ToasterComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

  public dismiss() {
    this.data.snackBar.dismiss();
  }
}
