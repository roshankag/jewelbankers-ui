import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {default as _rollupMoment} from 'moment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {OnInit} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe,CommonModule, RouterModule, ReactiveFormsModule,HttpClientModule,MatListModule,MatCardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})

export class HomeComponent implements OnInit {
  loginForm : FormGroup;
  public preciousMetals$: PreciousMetals = new PreciousMetals;
  constructor(private fb: FormBuilder, private router: Router,private http:HttpClient,) {
    this.loginForm= new FormGroup({
      username: new FormControl("",[Validators.required,Validators.maxLength(21)]),
      password: new FormControl("",[Validators.required,Validators.maxLength(21)])
    })
  }

  

  ngOnInit(){
    // this.fetch();
    this.fetch();
  }

  onSubmit(form:any) {
    if (this.loginForm.valid) {
    console.log('Form submitted')
    console.log(this.loginForm.value);
    this.router.navigate(['/login'])
    }
  }
  public  fetch(){
    this.http.get('http://127.0.0.1:8000/').subscribe(
      (resp:any)=>{
        console.log(resp);
        this.preciousMetals$ = resp;
      }
    )
  }
}
class PreciousMetals{
  gold_18k_price_per_gram:any;
  gold_22k_price_per_gram:any;
  gold_24k_price_per_gram:any;
  silver_price_per_gram:any;    
}

