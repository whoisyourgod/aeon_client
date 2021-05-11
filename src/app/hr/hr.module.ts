import { NgModule } from "@angular/core";
import { HrRoutingModule } from "./hr-routing.module";
import { SharedModule } from "../shared/shared.module";
import { YearMonthPipe } from "./pipes";
import { MonthDayPipe } from "./pipes/monthDay.pipe";
import { HrWorkPerformanceComponent } from "./components";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ErrorHandler } from "../app-error-handler";

@NgModule({
  declarations: [
    HrWorkPerformanceComponent,
    YearMonthPipe,
    MonthDayPipe,
  ],
  imports: [HrRoutingModule, SharedModule],
  exports: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorHandler, multi: true },
  ]
})
export class HrModule { }
