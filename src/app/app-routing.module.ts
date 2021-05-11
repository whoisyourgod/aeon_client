import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent } from './component/error/error.component';
import { HrWorkPerformanceComponent } from './hr';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {path: 'login', component: LoginComponent},
  {path:'error',component:ErrorComponent},
  {
    path: '',
    loadChildren: () => import('./md/md.module').then(m => m.MddxModule)
  },
  // {
  //   path: 'hr',
  //   loadChildren: () => import('./hr/hr.module').then(m => m.HrModule)
  // },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
