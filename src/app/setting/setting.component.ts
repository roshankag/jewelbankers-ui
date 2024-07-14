import { Component , OnInit,Renderer2, ViewChild } from '@angular/core';
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
  selector: 'app-setting',
  standalone: true,
  imports: [MatAutocompleteModule,AsyncPipe,HttpClientModule,AsyncPipe,CommonModule, RouterModule, ReactiveFormsModule,MatFormFieldModule, MatInputModule, MatDatepickerModule,MatIconModule,MatNativeDateModule,MatSelectModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent implements OnInit {

  billform: FormGroup;
  myControl = new FormControl('');
  options: string[] = ['Chennai', 'Kancheepuram', 'Mambakkam'];
  filteredOptions: Observable<string[]>|undefined;
  selectedCustomer: Data | undefined;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private renderer: Renderer2) {
    this.billform = this.fb.group({
      billPledgeSerial: [{ value: '' }, [Validators.maxLength(2)]],
      shopAddress: ['', []],
      roiSilver: ['', [Validators.maxLength(3)]],
      roiGold: ['', []],
      recordsPerPage: ['', []],
      billRedemptionSerial: ['', []],
      RED_DETAILS :['', []],
      ROI_DETAILS: ['', []],
      country: ['', []],
      district: ['', []],
      DATABASE_IPADDRESS: ['', []],
      DATABASE_NAME: ['', []],
      LICENCE_NO: ['', []],
      MONTHLY_INCOME: ['', []],
      MYSQL_DB_PASSWORD: ['', []],
      MYSQL_DB_PATH: ['', []],
      MYSQL_DB_USER_ID:['',[]],
      MYSQL_DRIVER:['',[]],
      MYSQL_PORT:['',[]],
      MYSQL_URL:['',[]],
      PAWNER_SIGN:['',[]],
      PAWN_TICKET:['',[]],
      SEC_RULE:['',[]],
    });
  }

  ngOnInit() {
    this.billform.patchValue({ billPledgeSerial: 'B' });
    this.billform.patchValue({ billRedemptionSerial: 'B' });
    this.billform.patchValue({ LICENCE_NO: 'P.B.L.NO 765/2010-2011' });
    this.billform.patchValue({ MONTHLY_INCOME_DETAILS: 'I PROMISE TO MY MONTHLY INCOME RS.' });
    this.billform.patchValue({ MYSQL_DB_PASSWORD: 'ROOT' });
    this.billform.patchValue({ MYSQL_DB_PATH: 'C:\\PROGRAM FILES (X86)\\MYSQL\\MYSQL SERVER 5.1\\BIN' });
    this.billform.patchValue({ MYSQL_DB_USER_ID: 'ROOT' });
    this.billform.patchValue({ MYSQL_DRIVER: 'COM.MYSQL.JDBC.DRIVER' });
    this.billform.patchValue({ MYSQL_PORT: '3306' });
    this.billform.patchValue({ MYSQL_URL: 'JDBC:MYSQL' });
    this.billform.patchValue({ PAWNER_SIGN: 'SIG. OF PAWN BROKER/AGENT' });
    this.billform.patchValue({ RED_DETAILS: 'TIME AGREE UPON FOR A REDEMPTION OF THE ARTICLE IS ONE YEAR' });
    this.billform.patchValue({ ROI_DETAILS: 'THE RATE OF INTEREST CHARGED AT 16% PER ANNUM' });
    this.billform.patchValue({ MYSQL_URL: 'JDBC:MYSQL' });
    this.billform.patchValue({ SEC_RULE: "FROM F '(SEC. 7 & RULE 8')" });
    

    



    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onSubmit(form:any) {
    if (this.billform.valid) {
      console.log('Form submitted');
      console.log(this.billform.value);
      this.router.navigate(["/login"]);
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
      address?:any;
    }