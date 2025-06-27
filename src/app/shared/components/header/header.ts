import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { materialImports } from '../../../core/models/material.imports';
import { SearchInput } from '../search-input/search-input';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, materialImports, SearchInput],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  @Input() title: string = '';

  @Input() selectedFilter: string = '';

  @Input() search: boolean = false;

  @Input() filter: boolean = false;

@Output() emitFilter = new EventEmitter();

@Output() add = new EventEmitter();

  public emit() {
    console.log('skjsjsjj')
    this.emitFilter.emit(this.selectedFilter)
  }

  public emitAdd() {
     this.add.emit()
  }

}
