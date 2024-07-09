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
import {AuthService} from '../auth.service';
import { NgxToastNotifyService } from 'ngx-toast-notify';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})

export class HomeComponent implements OnInit {
  loginForm : FormGroup;
  public preciousMetals$: PreciousMetals = new PreciousMetals;
  constructor(private fb: FormBuilder, private router: Router,private http:HttpClient,private authService: AuthService,  private toastr: NgxToastNotifyService) {
    this.loginForm= new FormGroup({
      username: new FormControl("",[Validators.required,Validators.maxLength(21)]),
      password: new FormControl("",[Validators.required,Validators.maxLength(21)])
    })
  }

  login(form:any) {
    this.authService.signIn(this.loginForm.value.username, this.loginForm.value.password).subscribe(
      response => {
        console.log('Login successful', response);
        this.toastr.showToast("Login successful", "success", "top-left");
        console.log(response.roles);
        
        console.log(response.roles.filter((item: string) => item == "ROLE_ADMIN")>0);
        console.log(response.roles.filter((item: string) => item == "ROLE_USER"));
        
        if(response.roles.filter((item: string) => item == "ROLE_ADMIN").length>0){
          this.router.navigate(['/admin-dashboard']);
        }else if(response.roles.filter((item: string) => item == "ROLE_USER").length>0){
          this.router.navigate(['/addcustomer']);
        }
      },
      error => {
        console.error('Login failed', error);
        this.toastr.showToast(error?.error?.message || 'Error', "danger", "top-left");
      }
    );
  }

  ngOnInit(){
    console.log(this.authService.getUserData());
    
    if(this.authService.getUserData().accessToken && this.authService.getUserData().roles?.includes('ROLE_ADMIN')){
      this.router.navigate(['/login'])
    }
    // this.fetch();
    // this.fetch();
  }

  onSubmit(form:any) {
    if (this.loginForm.valid) {
    console.log('Form submitted')
    console.log(this.loginForm.value);
    // this.router.navigate(['/login'])
    }
  }
  public  fetch(){
    this.http.get('http://localhost:8080/users').subscribe(
      (resp:any)=>{
        console.log(resp);
        // this.preciousMetals$ = resp;
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

