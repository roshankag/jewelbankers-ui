import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(router:Router){}
  
}
