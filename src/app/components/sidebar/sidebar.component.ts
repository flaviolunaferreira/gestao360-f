import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
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
  imports: [MatIconModule, MatListModule, CommonModule, MatSidenavModule]
})
export class SidebarComponent {
  constructor(private router: Router) {}

  @Input() options: SidebarOption[] = [];

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}