import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

interface SidebarOption {
  icon: string;
  text: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [ CommonModule]
})
export class SidebarComponent {
  constructor(private router: Router) {}

  @Input() options: SidebarOption[] = [];

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}