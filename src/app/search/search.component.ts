import {Component, OnInit,Renderer2, ViewChild } from '@angular/core';
import {ChangeDetectionStrategy} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {default as _rollupMoment} from 'moment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MatAutocompleteModule,HttpClientModule,AsyncPipe,CommonModule, RouterModule, ReactiveFormsModule,MatFormFieldModule, MatInputModule, MatDatepickerModule,MatIconModule,MatNativeDateModule,MatSelectModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  billform: FormGroup;
  isBillSerialDisabled: boolean = true;
  selectedCustomer: Data | undefined;

  transcript: string = '';
  myControl = new FormControl('');
  options: string[] = [];
  filteredOptions: Observable<string[]> | undefined;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private http: HttpClient,
    private renderer: Renderer2
  ) {
    this.billform = this.fb.group({
      search: [''],
    });
  }

  ngOnInit() {
    this.billform.patchValue({ billserial: 'B' });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.fetch();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase().trim(); // Ensure value is trimmed and lowercase
    return this.options.filter(option =>
      option && option.toLowerCase().includes(filterValue)
    );
  }

  fetch() {
    this.http.get<Data[]>('http://localhost:8080/customers').subscribe(
      (resp) => {
        console.log(resp);
        const names = resp.map(customer => customer.customerName);
        const addresses = resp.map(customer => `${customer.street} ${customer.area} ${customer.district} ${customer.country} - ${customer.pincode}`);
        this.options = [...names, ...addresses];
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
  onSubmit(form: any) {
    if (this.billform.valid) {
      const value = this.myControl.value?.trim(); // Use optional chaining to handle undefined values
      let searchParams = {};
  
      if (value) {
        if (/^[A-Za-z]\d{5}$/.test(value)) {
          // It's a bill number
          searchParams = { bill_no: value };
        } else if (/\d{5}/.test(value)) {
          // It's an address (assuming addresses contain digits like pincode)
          searchParams = { address: value };
        } else {
          // Default to customer name if it's not a bill number or address
          searchParams = { customerName: value };
        }
  
        console.log('Form submitted');
        console.log(this.billform.value);
        console.log('Search Parameters:', searchParams);
  
        } else {
        console.error('Search value is undefined');
      }
    }
  }
    
}

interface Data {
  id: any;
  area: any;
  email: any;
  phone: any;
  pincode: any;
  customerName: any;
  street: any;
  district: any;
  country: any;
  relationShip: any;
  relationShipName: any;
  address?: any;
}