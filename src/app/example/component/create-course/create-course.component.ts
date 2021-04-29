import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import * as uuid from 'uuid';
import { Router } from '@angular/router';
import { CourseStore } from '../../store/course/course.store';
import { CourseService } from '../../service/course/course.service';
import { Course } from '../../store/course/course.model';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.sass']
})
export class CreateCourseComponent implements OnInit {

  createCourseSub: Subscription;

  constructor(private store: CourseStore, private courseService: CourseService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit(submittedForm) {
    console.log(submittedForm.value);

    if (submittedForm.invalid) {
      return;
    }

    const course: Course = {id: uuid.v4(), name: submittedForm.value.name, description: submittedForm.value.description};
    this.createCourseSub = this.courseService.createCourse(course).subscribe(result => {
      this.router.navigateByUrl('/courses');
    });
  }
}
