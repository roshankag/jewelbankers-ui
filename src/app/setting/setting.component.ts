import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Settings } from './settings';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [
    MatAutocompleteModule, AsyncPipe, HttpClientModule, CommonModule, RouterModule,
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule,
    MatIconModule, MatNativeDateModule, MatSelectModule
  ],
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  settingForm: FormGroup;
  myControl = new FormControl('');
  options: string[] = ['Chennai', 'Kancheepuram', 'Mambakkam'];
  filteredOptions: Observable<Settings[]> | undefined;
  selectedCustomer: Data | undefined;
  settings: Settings[] = [];


  constructor(
    private fb: FormBuilder, private router: Router,
    private http: HttpClient, private renderer: Renderer2
  ) {
    this.settingForm = this.fb.group({
      billPledgeSerial: [{ value: '' }, [Validators.maxLength(2)]],
      shopAddress: ['', []],
      roiSilver: ['', [Validators.maxLength(3)]],
      roiGold: ['', []],
      recordsPerPage: ['', []],
      billRedemptionSerial: ['', []],
      RED_DETAILS: ['', []],
      ROI_DETAILS: ['', []],
      country: ['', []],
      district: ['', []],
      DATABASE_IPADDRESS: ['', []],
      DATABASE_NAME: ['', []],
      LICENCE_NO: ['', []],
      MONTHLY_INCOME: ['', []],
      MYSQL_DB_PASSWORD: ['', []],
      MYSQL_DB_PATH: ['', []],
      MYSQL_DB_USER_ID: ['', []],
      MYSQL_DRIVER: ['', []],
      MYSQL_PORT: ['', []],
      MYSQL_URL: ['', []],
      PAWNER_SIGN: ['', []],
      PAWN_TICKET: ['', []],
      SEC_RULE: ['', []],
    });
  }

  ngOnInit() {
    this.fetchSettings();
    this.settingForm = this.fb.group({
      settings: this.fb.array([])
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onSubmit(form: any) {
    if (this.settingForm.valid) {
      console.log('Form submitted');
      console.log(this.settingForm.value);
      this.router.navigate(['/login']);
    }
  }

  fetchSettings() {
    this.http.get<Settings[]>('http://localhost:8080/settings').subscribe(
      list => {
        this.settings=list;
      });

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
