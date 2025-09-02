import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IndexedDbService } from 'src/app/config/indexDB';
import { HammerModule } from '@angular/platform-browser';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HammerModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent {
  previousEmployeesList: any[] = [];
  ngOnInit() {
    this.getAllEmployees();
  }
  currentEmployeesList: any[] = [];
  constructor(private indexedDbService: IndexedDbService) { }

  async getAllEmployees() {
    // Fetch all employees from IndexedDB
    const all = await this.indexedDbService.getAllEmployees();
    this.currentEmployeesList = all.filter(emp => !emp.toDate);
    this.previousEmployeesList = all.filter(emp => emp.toDate);

  }

  async deleteEmployee(id: number) {
    await this.indexedDbService.deleteEmployeeById(id);
    this.getAllEmployees();
  } 


}
