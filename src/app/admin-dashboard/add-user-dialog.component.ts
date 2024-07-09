import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styles: `
  mat-form-field {
  display: block;
  width: 100%;
}

label {
  display: block;
  margin: 10px 0;
}

  `
})
export class AddUserDialogComponent {
  addUserForm: FormGroup;
  roles = ['user', 'admin'];

  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    private fb: FormBuilder
  ) {
    this.addUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      username: ['', [Validators.required]],
      roles: this.fb.array([], [Validators.required])
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCheckboxChange(e: any) {
    const roles: FormArray = this.addUserForm.get('roles') as FormArray;

    if (e.target.checked) {
      roles.push(this.fb.control(e.target.value));
    } else {
      const index = roles.controls.findIndex(x => x.value === e.target.value);
      roles.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.addUserForm.valid) {
      const userData = {
        email: this.addUserForm.value.email,
        password: this.addUserForm.value.password,
        username: this.addUserForm.value.username,
        roles: this.addUserForm.value.roles.map((role: string) => role.toUpperCase())
      };
      this.dialogRef.close(userData);

      console.log(userData);
      
    }
  }
}
