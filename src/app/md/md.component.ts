import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { MdService } from './md.service';
import { PersonInfo } from './models/model';

@Component({
  selector: 'app-md',
  templateUrl: './md.component.html',
  styleUrls: ['./md.component.sass']
})
export class MddxComponent implements OnInit {
  title = 'clientapp';
  isSpinning: any = false;
  personInfoExc: PersonInfo;
  personId: string;
  errorMessageInfo = new Map<string, string>();

  subject: Subject<any> = new Subject<any>();
  
  constructor(private route: ActivatedRoute,
    private mdApiService: MdService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((res) => {
      this.personId = res.personId;
    })

    this.mdApiService.getPersonInfo(this.personId).subscribe(res => {
      this.isSpinning = true;
      if (this.mdApiService.errorCheck(this.errorMessageInfo, (res.data.errorMessageInfo))) {
        this.isSpinning = false;
        this.mdApiService.getMessage(this.errorMessageInfo);
        return;
      }
      this.personInfoExc = res.data.personInfo;
      this.isSpinning = false;

      
    })
  }
}