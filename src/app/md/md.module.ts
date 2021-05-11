import { NgModule } from '@angular/core'
import { MddxConditionInputComponent } from './component/md-condition-input/md-condition-input.component';
import { HeaderComponent } from './layout/header/header.component';
import { MddxComponent } from './md.component';
import { MddxSiderComponent } from './layout/md-sider/md-sider.component';
import { MddxOrderInfoResultComponent } from './component/md-order-info-result/md-order-info-result.component';
import { MdService } from './md.service';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from '../simple-reuse-strategy';
import { MddxOrderInfoCountDiaplayComponent } from './component/md-order-info-count-display/md-order-info-count-diaplay.component';
import { SharedModule } from '../shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler } from '../app-error-handler';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    MddxConditionInputComponent,
    MddxOrderInfoResultComponent,
    HeaderComponent,
    MddxComponent,
    MddxSiderComponent,
    MddxOrderInfoCountDiaplayComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorHandler, multi: true },
    MdService,
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }
  ]
})
export class MddxModule { }
