import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ReactiveFormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { MddxRoutingModule } from '../md/md-routing.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    MddxRoutingModule,
    NzLayoutModule,
    NzMenuModule,
    NzGridModule,
    NzRadioModule,
    NzCardModule,
    NzSelectModule,
    NzFormModule,
    NzDatePickerModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzCheckboxModule,
    NzSpinModule,
    NzTableModule
  ],
  exports:[
    CommonModule,
    FormsModule,
    HttpClientModule,
    MddxRoutingModule,
    NzLayoutModule,
    NzMenuModule,
    NzGridModule,
    NzRadioModule,
    NzCardModule,
    NzSelectModule,
    NzFormModule,
    NzDatePickerModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzCheckboxModule,
    NzSpinModule,
    NzTableModule,
    NzIconModule,
    NzModalModule
  ]
})
export class SharedModule { }
