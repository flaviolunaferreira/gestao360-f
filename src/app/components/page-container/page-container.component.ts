import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-page-container',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './page-container.component.html',
  styleUrls: ['./page-container.component.scss']
})
export class PageContainerComponent {
  @Input() title = '';
  @Input() loading = false;
}
