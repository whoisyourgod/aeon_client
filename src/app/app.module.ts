import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { ExampleModule } from './example/example.module';
import { fakeBackendProvider } from './fake-backend';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler } from './app-error-handler';
import { ErrorComponent } from './component/error/error.component';
import { NzResultModule } from 'ng-zorro-antd/result';

import { registerLocaleData } from '@angular/common';
import ja from '@angular/common/locales/ja';
registerLocaleData(ja);

import { NZ_I18N, ja_JP } from 'ng-zorro-antd/i18n';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ExampleModule,
    NzLayoutModule,
    NzResultModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorHandler, multi: true },
    { provide: NZ_I18N, useValue: ja_JP },
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
