import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {ChangeDetectionStrategy} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import * as _moment from 'moment';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment} from 'moment';
import { Bill } from '../pledge/Bill';
@Component({
  selector: 'app-redeem',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule,MatFormFieldModule, MatInputModule, MatDatepickerModule,MatIconModule,MatNativeDateModule,MatSelectModule],
  templateUrl: './redeem.component.html',
  styleUrl: './redeem.component.css'
})


export class RedeemComponent {
  
    redeemform : FormGroup;
    bill!: Bill;
  
  
    constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
      this.redeemform = this.fb.group({
        billSerial: ['', [Validators.required, Validators.maxLength(2)]],
        billNo: ['', [Validators.required, Validators.maxLength(5)]],
        // name: ['', [Validators.required, Validators.maxLength(21)]],
        // customerid: ['', [Validators.required, Validators.maxLength(8)]],
        // adrress: ['', [Validators.required]],
        // article: ['', [Validators.required]],
        // amount: ['', [Validators.required, Validators.maxLength(8)]],
        // weight: ['', [Validators.required, Validators.maxLength(5)]],
        // quantity: ['', [Validators.required, Validators.maxLength(3)]],
        // description: ['', [Validators.required]],
        // presentvalue: ['', [Validators.required, Validators.maxLength(8)]],
        // roi: ['', [Validators.required, Validators.maxLength(3)]],
        // date: ['', [Validators.required]],
        // AmountInWords: ['', [Validators.required]],
        redemptionDate: ['', [Validators.required]],
        redemptionTotal: ['', [Validators.required]],
        redemptionInterest: ['', [Validators.required]],
        billRedemSerial: ['', [Validators.required]],
        billRedemNo: ['', [Validators.required]]
      });
    }
    ngOnInit() {
    // this.billFetch();
    } 


      billFetch(billNo:number,billSerial:string) {
        this.http.get<Bill[]>(`http://localhost:8080/jewelbankersapibills/number?billNo=${billNo}&billSerial=${billSerial}`).subscribe(
          (resp) => {
            console.log(resp);
            this.bill = resp[0];
            
            // this.options = resp.map(this.bill => ({
            //   ...customer,
            //   address: `${customer.street}, ${customer.district}, ${customer.country} - ${customer.pincode}`
            
            // }));
            console.log("Bill Sequence : "+this.bill.billSequence);
          },
          (error) => {
            console.error('Error fetching data:', error);
          }
        );
      }
    
      onRedemSubmit() {
      if (this.redeemform.valid) {
        console.log('Form submitted');
        console.log(this.redeemform.value);
  
        // Make HTTP PUT request to update the bill details
        const id = this.bill.billSequence; // Replace with your bill ID
        const updateUrl = `http://localhost:8080/jewelbankersapibills/${id}`;
        this.http.put(updateUrl, this.redeemform.value).subscribe(
          (response) => {
            console.log('Updated successfully:', response);
            this.router.navigate(['/login']); // Navigate to login page after successful update
          },
          (error) => {
            console.error('Error updating bill:', error);
            // Handle error appropriately (e.g., show error message)
          }
        );
      }
    }
    onBillSelected(event:Event) {
      console.log('onBillSelected called');

      const billNo = this.redeemform.get("billNo")?.value;
      const billSerial = this.redeemform.get("billSerial")?.value;
      this.billFetch(billNo,billSerial)
      // const selectedCustomer = this.options.find(option => option.customerName === customerName);
      // if (selectedCustomer) {
      //   console.log("selected");
      //   const fullAddress1 = `${selectedCustomer.area}, ${selectedCustomer.street}, ${selectedCustomer.district}, ${selectedCustomer.country} - ${selectedCustomer.pincode}`;
      //   console.log(fullAddress1)
      //   this.billform.patchValue({ fullAddress: fullAddress1 });
      //   this.billform.patchValue({customerName:selectedCustomer.customerName});
      //   this.billform.patchValue({ customerid: selectedCustomer.customerid });
      //   console.log()
      //   this.billform.patchValue({ phone: selectedCustomer.customerid });
      // }
    }

    saveRedemptionBill(bill: Bill) { 
      const body=JSON.stringify(bill);
      const headers  = new HttpHeaders({ 'Content-Type': 'application/json'})
  //     const headers= new HttpHeaders()
  // .set('content-type', 'application/json')
  // .set('Access-Control-Allow-Origin', '*');  

      this.http.post('http://localhost:8080/jewelbankersapibills',body, {headers}).subscribe(
        (resp) => {
          //console.log(resp);
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
 }
  setRedeemption() {
    const bill: any = {
      
      redemptionDate: this.redeemform.get('redemptionDate')?.value != null?this.redeemform.get('redemptionDate')?.value:null,
      redemptionInterest: parseInt(this.redeemform.get('redemptionInterest')?.value),
      redemptionTotal: parseInt(this.redeemform.get('redemptionTotal')?.value),
      redemptionStatus: this.redeemform.get('redemptionStatus')?.value != null?this.redeemform.get('redemptionStatus')?.value:null,
      billRedemSerial: this.redeemform.get('billRedemSerial')?.value != null?this.redeemform.get('billRedemSerial')?.value:null,
      billRedemNo: parseInt(this.redeemform.get('billRedemNo')?.value),
     }
     return bill;
  }
}
