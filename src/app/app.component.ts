import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { IconBarComponent } from './components/icon-bar/icon-bar.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    RouterModule,
    FooterComponent,
    SidebarComponent,
    ToolbarComponent,
    IconBarComponent,
    HttpClientModule
  ]
})
export class AppComponent {
  isSidebarOpen = false;
  sidebarOptions: string[] = [];

  toggleSidebar(options: string[]) {
    if (this.isSidebarOpen && this.sidebarOptions === options) {
      this.isSidebarOpen = false;
    } else {
      this.isSidebarOpen = true;
      this.sidebarOptions = options;
    }
  }
}
