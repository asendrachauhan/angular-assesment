import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonService } from '../../../core/services/commonService/common-service';

@Component({
  selector: 'app-search-input',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './search-input.html',
  styleUrl: './search-input.scss',
})
export class SearchInput {
  constructor(private commonService: CommonService) {}

  public onSearchInputChange(searchTerm: string) {
    this.commonService.triggerSearch(searchTerm);
  }
}
