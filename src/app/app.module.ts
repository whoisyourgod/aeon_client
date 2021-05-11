import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler } from './app-error-handler';
import { ErrorComponent } from './component/error/error.component';
import { NzResultModule } from 'ng-zorro-antd/result';

import { registerLocaleData } from '@angular/common';
import ja from '@angular/common/locales/ja';
registerLocaleData(ja);

import { NZ_I18N, ja_JP } from 'ng-zorro-antd/i18n';
import { MddxModule } from './md/md.module';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { HrModule } from './hr/hr.module';
import { LoginComponent } from './login/login.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    LoginComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    NzLayoutModule,
    NzResultModule,
    MddxModule,
    NzMessageModule,
    HrModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorHandler, multi: true },
    { provide: NZ_I18N, useValue: ja_JP },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
