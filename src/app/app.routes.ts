import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { PledgeComponent } from './pledge/pledge.component';
import { RedeemComponent } from './redeem/redeem.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { SettingComponent } from './setting/setting.component';
import { SearchComponent } from './search/search.component';


export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: '', component:HomeComponent},
    {path: 'pledge', component:PledgeComponent},
    {path: 'redeem', component: RedeemComponent},
    {path: 'addcustomer', component: AddCustomerComponent},
    {path: 'setting', component: SettingComponent},
    {path:'Search', component: SearchComponent  }


];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }