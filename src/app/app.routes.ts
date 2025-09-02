import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-layout/employee-list/employee-list.component';
import { EmployeeLayoutComponent } from './employee-layout/employee-layout.component';
import { EmployeeDatailsComponent } from './employee-layout/employee-datails/employee-datails.component';

export const routes: Routes = [
    { path: '', redirectTo: 'employees/list', pathMatch: 'full' }, // root redirect

    {
        path: 'employees',
        component: EmployeeLayoutComponent,
        data: { title: 'Employee List' },
        children: [
            { path: 'list', component: EmployeeListComponent },        // /employees/list
            { path: 'details', component: EmployeeDatailsComponent,
                data: { title: 'Add Employee Details' }
             },
            { path: 'details/:id', component: EmployeeDatailsComponent ,
                data: { title: 'Edit Employee Details' },
            }
              // /employees/details
        ]
    }
];
