import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoursesListComponent } from './component/courses-list/courses-list.component';
import { CreateCourseComponent } from './component/create-course/create-course.component';
import { ExampleComponent } from './example.component';


const routes: Routes = [{
  path:'example',
  component:ExampleComponent,
  children:[
    {
      path: 'courses',
      component: CoursesListComponent
    },
    {path: 'create-course', component: CreateCourseComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExampleRoutingModule { }
