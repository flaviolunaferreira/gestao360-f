import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {
  @Input() dataSource: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() loading = false;
  @Input() showActions = true;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  get displayedColumns(): string[] {
    return this.columns.map(c => c.key).concat(this.showActions ? ['actions'] : []);
  }
}

export interface TableColumn {
  key: string;
  header: string;
  type?: 'text' | 'number' | 'currency' | 'boolean' | 'date';
}
