import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MddxConditionInputComponent } from './component/md-condition-input/md-condition-input.component';
import { MddxOrderInfoResultComponent } from './component/md-order-info-result/md-order-info-result.component';
import { MddxOrderInfoCountDiaplayComponent } from './component/md-order-info-count-display/md-order-info-count-diaplay.component';
import { MddxComponent } from './md.component';


const routes: Routes = [{
  path: 'md', component: MddxComponent,
  children: [
    { path: '', redirectTo: 'conditionInput', pathMatch: 'full' },
    { path: 'conditionInput', component: MddxConditionInputComponent, data: { reload: true } },
    { path: 'orderInfoResult', component: MddxOrderInfoResultComponent },
    { path: 'orderInfoCountDiaplay', component: MddxOrderInfoCountDiaplayComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MddxRoutingModule { }
