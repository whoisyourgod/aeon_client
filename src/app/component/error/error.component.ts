import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'aeon-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.sass']
})
export class ErrorComponent implements OnInit {

  message: any;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((res) => {
      this.message = res.err;
    })
  }
}
