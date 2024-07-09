import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { AgGridAngular, ICellRendererAngularComp } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef, ICellRendererParams } from 'ag-grid-community'; 
import { MatDialog } from '@angular/material/dialog';
import { Router } from 'express';
import { AddUserDialogComponent } from './add-user-dialog.component';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  columnDefs = [
    { headerName: 'ID', field: 'id' },
    { headerName: 'Username', field: 'username' },
    { headerName: 'Email', field: 'email' },
    { headerName: 'Roles', field: 'rolesString' },
    // { headerName: 'Actions', cellRenderer: ActionCellRendererComponent1 },
  ];
  rowData: any[] = [];

  constructor(private userService: UserService, public dialog: MatDialog) { }

  ngOnInit(): void {
    console.log('gellooo');
    
    this.userService.getUsers().subscribe(data => {
      this.rowData = data.map(user => ({
        ...user,
        rolesString: user.roles.map((role: { name: any; }) => role.name).join(', ')
      }));
    });
  }
  addUser(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.addUser(result).subscribe(() => {
          this.ngOnInit(); // Refresh the user list after adding a new user
        });
      }
    });
  }

  onEdit(id: number) {
    console.log('Edit user', id);
    // Implement edit functionality here
  }

  onDelete(id: number) {
    console.log('Delete user', id);
    // Implement delete functionality here
  }
}
