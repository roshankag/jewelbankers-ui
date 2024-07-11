import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { PledgeComponent } from './pledge/pledge.component';
import { RedeemComponent } from './redeem/redeem.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { SettingComponent } from './setting/setting.component';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {AsyncPipe} from '@angular/common';
import { FormsModule,FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';
import { AddUserDialogComponent } from './admin-dashboard/add-user-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LogoutComponent } from './logout/logout.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';


export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'logout', component: LogoutComponent},
    {path: 'forget', component: ForgotPasswordComponent},
    {path: '', component:HomeComponent},
    {path: 'pledge', component:PledgeComponent},
    {path: 'redeem', component: RedeemComponent},
    {path: 'addcustomer', component: AddCustomerComponent},
    {path: 'setting', component: SettingComponent},
    {path: 'admin-dashboard', component: AdminDashboardComponent},
    {path: 'reset-password', component: NewPasswordComponent},

];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        ToastrModule.forRoot(),
        MatCardModule,
        ReactiveFormsModule,
        MatListModule,
        CommonModule,
        AsyncPipe,
        AgGridModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatCheckboxModule   
    ],
    exports: [RouterModule],
    providers: [provideHttpClient(
        withInterceptorsFromDi(),
    ),
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true,
    },],
    declarations: [HomeComponent,AdminDashboardComponent,AddUserDialogComponent,ForgotPasswordComponent,NewPasswordComponent]
  })
  export class AppRoutingModule { 
  
  }