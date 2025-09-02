import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-employee-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './employee-layout.component.html',
  styleUrls: ['./employee-layout.component.scss']
})
export class EmployeeLayoutComponent {
  title = '';

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe(data => {
      this.title = data['title'];   // ✅ get data from route config
    });
  }
}
