import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { MdService } from '../../md.service';
import { PersonInfo } from '../../models/model';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

 @Input('personInfoExc') personInfoExc: PersonInfo;

  constructor(private http: HttpClient,
    private mdApiService: MdService) { }

  ngOnInit() {
   
  }
}