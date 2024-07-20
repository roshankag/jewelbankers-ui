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
import { Bill } from '../pledge/Bill';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MatAutocompleteModule,HttpClientModule,AsyncPipe,CommonModule, RouterModule, ReactiveFormsModule,MatFormFieldModule, MatInputModule, MatDatepickerModule,MatIconModule,MatNativeDateModule,MatSelectModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  searchform: FormGroup;
  bills!: Bill[];
  // bills: Bill[] = [];  
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
    this.searchform = this.fb.group({
      search: [''],
    });
  }

  ngOnInit() {
    this.searchform.patchValue({ billserial: 'B' });
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
    this.http.get<Data[]>('http://localhost:8080/jewelbankersapicustomers').subscribe(
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
    if (this.searchform.valid) {
      let flag=0;

      const value = this.myControl.value?.trim(); // Use optional chaining to handle undefined values
      let searchParams = {};
      let billNo = this.myControl.value;
      console.log(billNo)
      const billSerial=billNo?.charAt(0);
      const a=billNo?.slice(1)
      const customerName=this.myControl.value;

      if (value) {
        if (/^[A-Za-z]\d{4}$/.test(value)) {
          flag =1;
          searchParams = { bill_no: value };
        } else if (/\d{5}/.test(value)) {
          flag=2;
          searchParams = { address: value };
        } else {
          searchParams = { customerName: value };
          flag=2;
        }
  
        console.log('Form submitted');
        console.log(this.searchform.value);
        console.log('Search Parameters:', searchParams);
  
        } else {
        console.error('Search value is undefined');
      }
      const searchvalue = this.myControl.value;
      console.log("searchvalue"+searchvalue)
      // if (customerName) {
      //   const url =`http://localhost:8080/jewelbankersapicustomers/search?customerName=${customerName}`
      if (searchvalue){
        // const url = `http://localhost:8080/jewelbankersapibills/number?billNo=${a}&billSerial=${billSerial}`;
        const url = `http://localhost:8080/jewelbankersapibills/search?customerName=${searchvalue}&billNo=${searchvalue}`
        this.http.get<[]>(url).subscribe(
          (response:any) => {
            console.log('Bill details:', response);

            this.bills = response.content;
            this.bills = response;
            console.log(this.bills);
            
          },
          (error) => {
            console.error('Error fetching bill details:', error);
          }
        );
      }

        // this.http.get(url).subscribe(
        //   (response) => {
        //     console.log('Bill details:', response);
        //     this.bill= response[0];
        //     // Handle the response as needed
        //   },
        //   (error) => {
        //     console.error('Error fetching bill details:', error);
        //   }
        // )

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




