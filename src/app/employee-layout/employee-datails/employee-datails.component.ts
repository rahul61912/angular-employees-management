import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { IndexedDbService } from '../../config/indexDB';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

interface Employee {
  employeeId: number | null;
  name: string;
  role: string;
  fromDate: any;
  toDate: any;
}

@Component({
  selector: 'app-employee-datails',
  standalone: true,
  imports: [CommonModule, FormsModule, BsDatepickerModule, RouterModule],
  templateUrl: './employee-datails.component.html',
  styleUrls: ['./employee-datails.component.scss']
})
export class EmployeeDatailsComponent {
  
  isUpdateMode = signal(false);
  isValidateForm = signal(false);

  employeeDetails = signal<Employee>({
    employeeId: null,
    name: '',
    role: '',
    fromDate: new Date(),   // default today
    toDate: null
  });

  resetEmployeeDetails: Employee = {
    employeeId: null,
    name: '',
    role: '',
    fromDate: null,
    toDate: null
  };

  constructor(
    private indexedDbService: IndexedDbService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(async (params: any) => {
      const id = Number(params.get('id'));
      if (!id) return;

      this.isUpdateMode.set(true);

      const employee = await this.indexedDbService.getEmployeeById(id);
      if (employee) {
        this.employeeDetails.set({
          employeeId: employee.id,
          name: employee.name,
          role: employee.role,
          fromDate: employee.fromDate ? new Date(employee.fromDate) : null,
          toDate: employee.toDate ? new Date(employee.toDate) : null
        });
      }
    });
  }

  async saveEmployee(Value: any) {
    if (Value.invalid) {
      alert('Please fill all required fields');
      this.isValidateForm.set(true);
      return;
    }

    const emp = this.employeeDetails();

    if (!this.isUpdateMode()) {
      await this.indexedDbService.addEmployee({
        name: emp.name,
        role: emp.role,
        fromDate: emp.fromDate ? emp.fromDate.toISOString() : '',
        toDate: emp.toDate ? emp.toDate.toISOString() : ''
      });
    } else {
      await this.indexedDbService.updateEmployee({
        id: emp.employeeId as number,
        name: emp.name,
        role: emp.role,
        fromDate: emp.fromDate ? emp.fromDate.toISOString() : '',
        toDate: emp.toDate ? emp.toDate.toISOString() : ''
      });
    }

    this.employeeDetails.set({ ...this.resetEmployeeDetails });
    this.router.navigate(['/employees/list']);
  }

  validateToDate(selectedDate: Date) {
    const emp = this.employeeDetails();

    if (!emp.fromDate) {
      alert('Please select From Date first');
      setTimeout(() => {this.employeeDetails.update(e => ({ ...e, toDate: '' }));},0)
      return;
    }

    const fromDate = new Date(emp.fromDate);
    const toDate = new Date(selectedDate);

    if (toDate < fromDate) {
      alert('To Date cannot be earlier than From Date');
      setTimeout(() => {this.employeeDetails.update(e => ({ ...e, toDate: '' }));},0)
    }
  }
}
