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
    isBillSerialDisabled: boolean = true;
    selectedCustomer: Data | undefined;

  
  
    constructor(private fb: FormBuilder, private router: Router,private http:HttpClient,private renderer: Renderer2) {
      this.billform = this.fb.group({
        billserial: [{disabled: true},[ Validators.maxLength(2)]],
        billno: ['', [ Validators.maxLength(5)]],
        name: [''],
        customerid: ['', [ Validators.maxLength(8)]],
        adrress: ['', []],
        article: ['', []],
        amount: ['', [ Validators.maxLength(8)]],
        weight: ['', [ Validators.maxLength(5)]],
        quantity: ['', [ Validators.maxLength(3)]],
        description: ['' ],
        presentvalue: ['', [ Validators.maxLength(8)]],
        roi: ['', [ Validators.maxLength(3)]],
        date: [new Date(), []],
        amountinwords: ['', [ ]],
        totalgive: [''],
        intrestpledge: [''],
        phone:['']
        
      });
      
      
      
    }
    transcript: string = '';
    myControl = new FormControl('');
    options: Data[]=[];
    filteredOptions: Observable<string[]>|undefined ;
    
    ngOnInit() {
      this.billform.patchValue({billserial:'B'})
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(""),
        map(value => this._filter(value || '')),
      );
      this.fetch();
      this.billform.get('roi')!.valueChanges.subscribe(() => this.calculateIntrestPledgeAndTotalGive());
      this.billform.get('amount')!.valueChanges.subscribe(() => this.calculateIntrestPledgeAndTotalGive());
      this.billform.get('amount')!.valueChanges.subscribe(() => this.roiacess());
      this.billform.get('article')!.valueChanges.subscribe(() => this.roiacess());
      this.billform.get('amount')!.valueChanges.subscribe(() => this.presentvalue());
      this.billform.get('weight')!.valueChanges.subscribe(() => this.presentvalue());
      this.billform.get('article')!.valueChanges.subscribe(() => this.presentvalue());

        }

    private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();
      // Filter options based on customerName and map to an array of strings
      return this.options.filter(option => option.customerName.toLowerCase().includes(filterValue))
                         .map(filteredOption => filteredOption.customerName);
    }
    
    onSubmit(form:any) {
      if (this.billform.valid) {
      console.log('Form submitted')
      console.log(this.billform.value);

      this.router.navigate(["/login"])
      }
      
  }
    fetch() {
      this.http.get<Data[]>('http://localhost:8080/customers').subscribe(
        (resp) => {
          console.log(resp);
          this.options = resp.map(customer => ({
            ...customer,
            address: `${customer.street}, ${customer.district}, ${customer.country} - ${customer.pincode}`
          
          }));
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    }
  
    displayFn(customer: Data): string {
      return customer && customer.customerName ? customer.customerName : '';
    }   
    
  
    onCustomerSelected(customerName: string) {
      console.log('called')
      const selectedCustomer = this.options.find(option => option.customerName === customerName);
      if (selectedCustomer) {
        const address1 = `${selectedCustomer.street}, ${selectedCustomer.district}, ${selectedCustomer.country} - ${selectedCustomer.pincode}`;
        this.billform.patchValue({ adrress: address1 });
        console.log(address1)
        this.billform.patchValue({ customerid: selectedCustomer.id });
        this.billform.patchValue({ phone: selectedCustomer.id });
      }
    }
    updateAmountInWords(event: Event) {
      const inputElement = event.target as HTMLInputElement;
      const amount = inputElement.value;
  
      if (amount) {
        const amountValue = parseFloat(amount); // Convert input value to a number if needed
        const amountWords = this.convertAmountToWords(amountValue);
        this.billform.patchValue({ amountinwords: amountWords });
      } else {
        this.billform.patchValue({ amountinwords: '' }); // Handle case when amount is empty or invalid
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
          this.billform.patchValue({presentvalue:tot2})
        }
        else if (tot>amo){
          this.billform.patchValue({presentvalue:tot})
        }
      else if(art=='Silver'){
        const tot=wei*35
        if (tot<=amo){
          const tot2=amo+100
          this.billform.patchValue({presentvalue:tot2})
        }
        else if (tot>amo){
          this.billform.patchValue({presentvalue:tot})
        }


      }
      }
      



    }

    roiacess(){
      const art=this.billform.get('article')!.value;
      const amo=this.billform.get('amount')!.value;

      if (art==='Gold'){
        if(amo<10000){
          this.billform.patchValue({roi:36})
        }
        else if (amo>10000){
          this.billform.patchValue({roi:24})
        }
      }      
      else if (art==='Silver'){
        this.billform.patchValue({
          roi:48
        })
      }

    }
    calculateIntrestPledgeAndTotalGive() {
      const roi = this.billform.get('roi')!.value;
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
    interface Window {
  webkitSpeechRecognition: any;
}
