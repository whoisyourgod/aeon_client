import { CreateCourseComponent } from './component/create-course/create-course.component';
import { CoursesListComponent } from './component/courses-list/courses-list.component';
import { CourseService } from './service/course/course.service';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ExampleRoutingModule } from './example-routing.module';
import { ExampleComponent } from './example.component';
import { AlertExComponent } from './component/alert/alert.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { MessageExComponent } from './component/message/message.component';
import { NzMessageModule } from 'ng-zorro-antd/message';



@NgModule({
  declarations: [ExampleComponent,CoursesListComponent, CreateCourseComponent,AlertExComponent,MessageExComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ExampleRoutingModule,
    NzModalModule,
    NzMessageModule,
    BrowserAnimationsModule
  ],
  providers: [CourseService],
  exports: [ExampleComponent,CoursesListComponent, CreateCourseComponent,AlertExComponent,MessageExComponent]
})
export class ExampleModule { }
