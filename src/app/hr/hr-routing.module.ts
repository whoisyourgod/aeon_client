import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HrWorkPerformanceComponent } from './components';


const routes: Routes = [
  {path: 'work', component: HrWorkPerformanceComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrRoutingModule { }
