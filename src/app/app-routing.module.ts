import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent } from './component/error/error.component';
import { ExampleComponent } from './example/example.component';

const routes: Routes = [
  { path: 'example', component: ExampleComponent },
  { path: 'error', component: ErrorComponent },
  // otherwise redirect to example
  { path: '**', redirectTo: 'example' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
