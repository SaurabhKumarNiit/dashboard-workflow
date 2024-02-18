import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterInterfaceComponent } from './register-interface/register-interface.component';

const routes: Routes = [
  {path:'',component:DashboardComponent},
  {path:'home',component:DashboardComponent},
  // {path:'login',component:LoginInterfaceComponent},
  {path:'register',component:RegisterInterfaceComponent},
  // {path:'booking',component:BookingComponent},
  // {path:'event',component:EventDashboardComponent},
  // {path:'display-details',component:DisplayCustomerDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
