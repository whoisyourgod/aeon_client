import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AttendanceInfoInput } from '../hr/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  dateFormat = 'yyyy/MM/dd';
  monthFormat = 'yyyy/MM';
  MdForm = this.fb.group({
    personId: ["488798"],
  })

  HrForm = this.fb.group({
    personId: ["Person_4251"],
    conmpanyId: ["Company_4"],
    teamId: ["Group_Z10889"],
    functionId: ["CA630"],
    menuKbn: ["MENU_MANAGEMENT"],
    groupId: ["Group_139481"],
    targetPersonId: ["Person_5989"],
    targetConmpanyId: ["Company_4"],
    targetMonth: ["2019/08"],
    startDate: ["2019/07/21"],
    endDate: ["2019/08/20"]
  })

  constructor(private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
  }

  monthClick($event) {
    if (this.HrForm.get('targetMonth').value) {
      const setstartDate = moment($event).subtract(1, 'month').set('date', 21);
      const setendDate = moment($event).set('date', 20);
      this.HrForm.get('startDate').setValue(setstartDate.toDate());
      this.HrForm.get('endDate').setValue(setendDate.toDate());
    } else {
      this.HrForm.get('startDate').setValue('');
      this.HrForm.get('endDate').setValue('');
    }
  }

  getFormInfo(): AttendanceInfoInput {
    const personId = this.HrForm.get('personId').value as string;
    const conmpanyId = this.HrForm.get('conmpanyId').value as string;
    const functionId = "CA630";
    const menuKbn = this.HrForm.get('menuKbn').value as string;
    const teamId = this.HrForm.get('teamId').value as string;
    const groupId = this.HrForm.get('groupId').value as string;
    const targetPersonId = this.HrForm.get('targetPersonId').value as string;
    const targetConmpanyId = this.HrForm.get('targetConmpanyId').value as string;
    const targetMonth = this.HrForm.get('targetMonth').value === '' ? '' : moment(this.HrForm.get('targetMonth').value as Date).format('YYYYMM');
    const startDate = this.HrForm.get('startDate').value === null ? '' : moment(this.HrForm.get('startDate').value as Date).format('YYYY/MM/DD');
    const endDate = this.HrForm.get('endDate').value === null ? '' : moment(this.HrForm.get('endDate').value as Date).format('YYYY/MM/DD');

    const result: AttendanceInfoInput = {
      personId: personId,
      conmpanyId: conmpanyId,
      functionId: functionId,
      menuKbn: menuKbn,
      teamId: teamId,
      groupId: groupId,
      targetPersonId: targetPersonId,
      targetConmpanyId: targetConmpanyId,
      targetMonth: targetMonth,
      startDate: startDate,
      endDate: endDate
    }
    return result;
  }


  submitForHr() {
    console.log(this.getFormInfo());
    this.router.navigate(['/work'], { queryParams: { personId: this.getFormInfo().personId, conmpanyId: this.getFormInfo().conmpanyId, functionId: this.getFormInfo().functionId, menuKbn: this.getFormInfo().menuKbn, teamId: this.getFormInfo().teamId, groupId: this.getFormInfo().groupId, targetPersonId: this.getFormInfo().targetPersonId, targetConmpanyId: this.getFormInfo().targetConmpanyId, targetMonth: this.getFormInfo().targetMonth, startDate: this.getFormInfo().startDate, endDate: this.getFormInfo().endDate } })
  }

  submitForMd() {
    this.router.navigate(['/md'], { queryParams: { personId: this.MdForm.get('personId').value as string } })
  }

}
