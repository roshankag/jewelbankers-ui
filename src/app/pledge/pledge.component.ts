import { Component , ElementRef, OnInit,Renderer2, ViewChild } from '@angular/core';
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
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Bill } from './Bill';
import { get } from 'http';
import { BillDetail } from './BillDetails';
import { Customer } from '../add-customer/Customer';


export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-pledge',
  standalone: true,
  imports: [MatAutocompleteModule,HttpClientModule,AsyncPipe,CommonModule, RouterModule, ReactiveFormsModule,MatFormFieldModule, MatInputModule, MatDatepickerModule,MatIconModule,MatNativeDateModule,MatSelectModule],
  templateUrl: './pledge.component.html',
  styleUrl: './pledge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class PledgeComponent implements OnInit {

    billform : FormGroup;
    isBillSerialDisabled: boolean = false;
    selectedCustomer: Customer | undefined;
isSuccess: boolean = false;
alertMessage: string = "";
  isExistingCustomer: boolean=false;
  

    constructor(private fb: FormBuilder, private router: Router,private http:HttpClient,private renderer: Renderer2) {
      this.billform = this.fb.group({
        billSerial: [{disabled: false},[ Validators.maxLength(2)]],
        billNo: ['', [ Validators.maxLength(5)]],
        customerName: [''],
        customerid: ['', [ Validators.maxLength(8)]],
        Address: ['', []],
        fullAddress: ['', []],
        productTypeNo: ['', []],
        amount: ['', [ Validators.maxLength(8)]],
        grams: ['', [ Validators.maxLength(5)]],
        productQuantity: ['', [ Validators.maxLength(3)]],
        productDescription: ['' ],
        presentValue: ['', [ Validators.maxLength(8)]],
        rateOfInterest: ['', [ Validators.maxLength(3)]],
        billDate: [new Date(), []],
        AmountInWords: ['', [ ]],
        totalgive: [''],
        interstpledge: [''],
        phone:['']
        
      });
      
      
      
    }
    transcript: string = '';
    myControl = new FormControl('');
    options: Customer[]=[];
    filteredOptions: Observable<string[]>|undefined ;
    
    ngOnInit() {
      this.billform.patchValue({billSerial:'B'})
      
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(""),
        map(value => this._filter(value || '')),
      );


      this.fetch();
      this.billform.get('rateOfInterest')!.valueChanges.subscribe(() => this.calculateIntrestPledgeAndTotalGive());
      this.billform.get('amount')!.valueChanges.subscribe(() => this.calculateIntrestPledgeAndTotalGive());
      this.billform.get('amount')!.valueChanges.subscribe(() => this.roiacess());
      this.billform.get('productTypeNo')!.valueChanges.subscribe(() => this.roiacess());
      this.billform.get('amount')!.valueChanges.subscribe(() => this.presentvalue());
      this.billform.get('grams')!.valueChanges.subscribe(() => this.presentvalue());
      this.billform.get('presentValue')!.valueChanges.subscribe(() => this.presentvalue());

        }

            private _filter(value: string): string[] {
              if (!value) {
                return [];
              }
          
              const filterValue = value.toLowerCase();
              // Filter options based on customerName and map to an array of strings
              return this.options.filter(option =>
                option.customerName ? option.customerName.toLowerCase().includes(filterValue) : false
              ).map(filteredOption => filteredOption.customerName);
            }

    getBillDetails(){
      const billDetail : BillDetail = {
        productNo: (this.billform.get('productNo')?.value),
        productDescription: (this.billform.get('productDescription')?.value) ,
        productQuantity: (this.billform.get('productQuantity')?.value),
      };
      const billDetails:any[] = new Array;
      billDetails.push(billDetail);    

      return billDetails;
    }

    getCustomer(customerName:any){

      
      const customer : Customer = {
        "customerid": parseInt(this.billform.get('id')?.value),
        "area": "KELLAMBAKKAM",
        "email": null,
        "state": "TAMIL NADU",
        "pincode": 603103,
        "customerName": customerName,
        "street": "THAIYUR",
        "district": "KANCHEEPURAM",
        "country": "INDIA",
        "relationShip": null,
        "relationShipName": null,
        "phone": null,
        "mobileNo": null,
        "address": null
      }
      return customer;
    }
    onSubmit(form:any) {
      const customerName = this.myControl.value;
      
      console.log("Customer Name:"+this.myControl.value)

      if (this.billform.valid) {
      console.log('Form submitted')
      console.log(this.billform.value);
      const bill: Bill = {
       // billSequence: parseInt(this.billform.get('billSequence')?.value),
        amount: parseInt(this.billform.get('amount')?.value),
        billSerial: String(this.billform.get('billSerial')?.value),
        billDate: String(this.billform.get('billDate')?.value),
        billNo: parseInt(this.billform.get('billNo')?.value),
        careOf: this.billform.get('careOf')?.value != null?this.billform.get('careOf')?.value:null,
        productTypeNo: parseInt(this.billform.get('productTypeNo')?.value),
        amountInWords: String(this.billform.get('AmountInWords')?.value),
        presentValue: parseInt(this.billform.get('presentValue')?.value),
        grams: parseInt(this.billform.get('grams')?.value),
        monthlyIncome: parseInt(this.billform.get('monthlyIncome')?.value),
        redemptionDate: this.billform.get('redemptionDate')?.value != null?this.billform.get('redemptionDate')?.value:null,
        redemptionInterest: parseInt(this.billform.get('redemptionInterest')?.value),
        redemptionTotal: parseInt(this.billform.get('redemptionTotal')?.value),
        redemptionStatus: this.billform.get('redemptionStatus')?.value != null?this.billform.get('redemptionStatus')?.value:null,
        billRedemSerial: this.billform.get('billRedemSerial')?.value != null?this.billform.get('billRedemSerial')?.value:null,
        billRedemNo: parseInt(this.billform.get('billRedemNo')?.value),
        comments: this.billform.get('comments')?.value != null?this.billform.get('comments')?.value:null,
        customer: this.getCustomer(customerName),
        rateOfInterest: 0,
        billDetails: this.getBillDetails()
      }

      const billDetails : BillDetail = {
        productNo: parseInt(this.billform.get('productNo')?.value),
        productDescription:this.billform.get('productDescription')?.value,
        productQuantity: parseInt(this.billform.get('productQuantity')?.value),
      }



      this.saveCustomer(bill);
      this.isSuccess = true;
      //this.alertMessage = "Bill saved successfully!" 
      //alert('Bill saved successfully!');
      //this.router.navigate(["/login"])
      }
  }
    fetch() {
      this.http.get<Customer[]>('http://localhost:8080/jewelbankersapicustomers').subscribe(
        (resp) => {
          // console.log(resp);
          this.options = resp.map(customer => ({
            ...customer,
            address: `${customer.street}, ${customer.district}, ${customer.country} - ${customer.pincode}`
          
          }));
          console.log("options length"+this.options.length);
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    }

    saveCustomer(bill: Bill) { 
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
  
    displayFn(customer: Customer): string {
      return customer && customer.customerName ? customer.customerName : '';
    }   
    
  
    onCustomerSelected(customerName: string) {
      console.log('called');
      const selectedCustomer = this.options.find(option => option.customerName === customerName);
      if (selectedCustomer) {        
        console.log("selected");
        const fullAddress1 = `${selectedCustomer.area}, ${selectedCustomer.street}, ${selectedCustomer.district}, ${selectedCustomer.country} - ${selectedCustomer.pincode}`;
        console.log(fullAddress1)
        this.billform.patchValue({ fullAddress: fullAddress1 });
        this.billform.patchValue({customerName:selectedCustomer.customerName});
        this.billform.patchValue({ customerid: selectedCustomer.customerid });
        console.log("Customer Name:"+this.myControl.value)
        this.billform.patchValue({ phone: selectedCustomer.customerid });
      }

    }
    updateAmountInWords(event: Event) {
      const inputElement = event.target as HTMLInputElement;
      const amount = inputElement.value;
  
      if (amount) {
        console.log(amount)
        const amountValue = parseFloat(amount); // Convert input value to a number if needed
        const amountWords = this.convertAmountToWords(amountValue);
        this.billform.patchValue({ AmountInWords: amountWords });
      } else {
        this.billform.patchValue({ AmountInWords: '' }); // Handle case when amount is empty or invalid
      }
    }
  
    convertAmountToWords(amount: number): string {
      const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
      const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
      const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
      if (amount === 0) {
        return 'Zero Rupees Only';
      }
      if (amount === 10000) {
        return 'Ten Thousand Rupees Only';
      }
    
      let words = '';
    
      // Function to convert numbers from 1 to 99 into words
      function convertLessThanHundred(number: number): string {
        if (number === 0) {
          return '';
        } else if (number < 10) {
          return ones[number];
        } else if (number < 20) {
          return teens[number - 11];
        } else {
          const tensDigit = Math.floor(number / 10);
          const unitDigit = number % 10;
          return tens[tensDigit] + ' ' + ones[unitDigit];
        }
      }
    
      if (amount >= 10000000) {  // Crores
        const crore = Math.floor(amount / 10000000);
        words += convertLessThanHundred(crore) + ' Crore ';
        amount %= 10000000;
      }
    
      if (amount >= 100000) {  // Lakhs
        const lakh = Math.floor(amount / 100000);
        words += convertLessThanHundred(lakh) + ' Lakh ';
        amount %= 100000;
      }
    
      if (amount >= 1000) {  // Thousands
        const thousand = Math.floor(amount / 1000);
        words += convertLessThanHundred(thousand) + ' Thousand ';
        amount %= 1000;
      }
    
      if (amount >= 100) {  // Hundreds
        const hundred = Math.floor(amount / 100);
        words += convertLessThanHundred(hundred) + ' Hundred ';
        amount %= 100;
      }
    
      if (amount > 0) {  // Tens and Units
        words += convertLessThanHundred(amount);
      }
    
      words += ' Rupees Only';
      return words.trim();
    }
    presentvalue(){
      const wei=this.billform.get('weight')!.value;
      const amo=this.billform.get('amount')!.value;
      const art=this.billform.get('article')!.value;
      if (art=='Gold'){
        const tot=wei*3000
        if (tot<=amo){
          const tot2=amo+200
          this.billform.patchValue({presentValue:tot2})
        }
        else if (tot>amo){
          this.billform.patchValue({presentValue:tot})
        }
      else if(art=='Silver'){
        const tot=wei*35
        if (tot<=amo){
          const tot2=amo+100
          this.billform.patchValue({presentValue:tot2})
        }
        else if (tot>amo){
          this.billform.patchValue({presentValue:tot})
        }


      }
      }
      



    }

    roiacess(){
      const art=this.billform.get('productTypeNo')!.value;
      const amo=this.billform.get('amount')!.value;

      if (art==='5'){
        if(amo<10000){
          this.billform.patchValue({rateOfInterest:36})
        }
        else if (amo>10000){
          this.billform.patchValue({rateOfInterest:24})
        }
      }      
      else if (art==='3'){
        this.billform.patchValue({
          rateOfInterest:48
        })
      }

    }
    calculateIntrestPledgeAndTotalGive() {
      const roi = this.billform.get('rateOfInterest')!.value;
      const amount = this.billform.get('amount')!.value;
  
      // Calculate intrestpledge (simple interest for demonstration purposes)
      const intrestpledge = (roi * amount) / (12*100);
  
      // Calculate totalgive (intrestpledge + amount)
      const totalgive = -intrestpledge + amount;
  
      // Update form controls with computed values
      this.billform.patchValue({
        intrestpledge: intrestpledge.toFixed(2),  // Display intrestpledge to two decimal places
        totalgive: totalgive.toFixed(2)          // Display totalgive to two decimal places
      });
      
    } 
    // Example function to toggle disabled state
toggleBillSerialInput() {
  this.isBillSerialDisabled = !this.isBillSerialDisabled;
}


 
  }    
  
    interface Window {
  webkitSpeechRecognition: any;
}
