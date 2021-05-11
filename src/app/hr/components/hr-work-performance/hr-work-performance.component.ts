import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { ActualInfo, AssignmentInfo, AttendanceInfo, CommonInfo, UserInfoResponse } from '../../models';
import { HrService } from '../../services';
import { ErrorMessageInfo } from '../../models/index';

@Component({
  selector: 'app-hr-work-performance',
  templateUrl: './hr-work-performance.component.html',
  styleUrls: ['./hr-work-performance.component.sass'],
})
export class HrWorkPerformanceComponent implements OnInit, OnDestroy {
  isSpinning: boolean = false;

  sub: Subscription;
  params$: Observable<any>;
  inputParems: any;
  targetMonth: number;
  nzNoResult: string;

  commonInfo: CommonInfo;

  greenFlag: string;

  disabledFlag: boolean;
  monthActionFlag: boolean;

  // 私用外出実績時間
  privateoutNCount: string;
  //残業内休憩時間
  overtimerestNConur: string;
  //計画内労働時間
  workinplanNConur: string;
  //計画外労働時間
  workoverplanNConur: string;
  userInfo: UserInfoResponse

  listOfAttendanceData: any;
  errorMessageInfo = new Map<string, string>();

  listOfUpdateAttendanceData: AttendanceInfo[];
  selectedData = new Map<string, AttendanceInfo>();

  mapOfCheckedId: { [key: string]: boolean } = {};

  constructor(
    private service: HrService,
    private route: ActivatedRoute,
    private router: Router,
    private modal: NzModalService,
  ) { }

  ngOnInit(): void {
    this.isSpinning = true;
    this.monthActionFlag = false;

    this.params$ = this.route.queryParamMap.pipe(
      filter((params) => params != null)
    );


    this.sub = this.params$
      .pipe(
        map((params) => (this.inputParems = params.params)),
        tap((_) => console.log(this.inputParems)),
        switchMap((params) => forkJoin(
          this.getUserInfo(params),
          this.getServiceCommon(params)
        )))
      .subscribe((res) => {
        if (res && res[0].data) {
          this.isSpinning = false;
          this.userInfo = res[0].data;
        } else {
          this.isSpinning = false;
        }

        if (
          res &&
          res[1].data &&
          res[1].data.attendanceInfoList &&
          res[1].data.attendanceInfoList.length > 0 &&
          res[1].data.resultCode == "success"
        ) {
          this.isSpinning = false;
          this.listOfAttendanceData = res[1].data.attendanceInfoList;
          this.commonInfo = res[1].data.commonInfo;
          this.disabledFlag = Boolean(this.commonInfo.editableFlag);
          this.targetMonth = Number.parseInt(this.inputParems.targetMonth);
          this.calcTimeCount();
        } else {
          this.router.navigate(['/error'], { queryParams: { err: res[1].data.errorMessageList.errorMessage } });
          this.isSpinning = false;
        }
      });
  }

  getUserInfo(params: any): Observable<any> {
    return this.service.getUserInfo(
      params.targetPersonId,
      params.targetConmpanyId,
      params.startDate,
      params.endDate);
  }

  // 共通サービスメソッド
  getServiceCommon(params: any): Observable<any> {
    return this.service.getAttendanceInfo(
      params.personId,
      params.conmpanyId,
      params.teamId,
      params.functionId,
      params.menuKbn,
      params.groupId,
      params.targetPersonId,
      params.targetConmpanyId,
      params.targetMonth,
      params.startDate,
      params.endDate
    );
  }

  //最新レコード取得
  reloadAttendanceInfoList(params: any) {
    console.log(params);
    this.monthActionFlag = false;
    this.isSpinning = true;
    this.getServiceCommon(params).subscribe((res) => {
      if (res && res.data && res.data.attendanceInfoList.length > 0 && res.data.resultCode == "success") {
        this.isSpinning = false;
        this.listOfAttendanceData = res.data.attendanceInfoList;
        this.commonInfo = res.data.commonInfo;
        this.disabledFlag = Boolean(this.commonInfo.editableFlag);
        this.calcTimeCount();
      } else {
        this.router.navigate(['/error'], { queryParams: { err: res.data.errorMessageList.errorMessage } });
        this.isSpinning = false;
      }
    });
  }

  // 時間合計
  calcTimeCount() {
    let countArrPrivateoutN = [];
    let countHourPrivateoutN = [];
    let countMinutePrivateoutN = [];

    let countArrOvertimerestN = [];
    let countHourOvertimerestN = [];
    let countMinuteOvertimerestN = [];

    let countArrWorkinplanN = [];
    let countHourWorkinplanN = [];
    let countMinuteWorkinplanN = [];

    let countArrWorkoverplanN = [];
    let countHourWorkoverplanN = [];
    let countMinuteWorkoverplanN = [];

    this.listOfAttendanceData.length > 0 &&
      this.listOfAttendanceData.forEach((record: AttendanceInfo) => {
        if (record != null && record.actualInfoList != null) {
          if (record.actualInfoList.length == 1) {
            record.actualInfoList[0].privateoutN != '' &&
              record.actualInfoList[0].privateoutN != null &&
              countArrPrivateoutN.push(record.actualInfoList[0].privateoutN);

            record.actualInfoList[0].overtimerestN != '' &&
              record.actualInfoList[0].overtimerestN != null &&
              countArrOvertimerestN.push(
                record.actualInfoList[0].overtimerestN
              );

            record.actualInfoList[0].workinplanN != '' &&
              record.actualInfoList[0].workinplanN != null &&
              countArrWorkinplanN.push(record.actualInfoList[0].workinplanN);

            record.actualInfoList[0].workoverplanN != '' &&
              record.actualInfoList[0].workoverplanN != null &&
              countArrWorkoverplanN.push(
                record.actualInfoList[0].workoverplanN
              );
          }
          if (record.actualInfoList.length > 1) {
            record.actualInfoList.forEach((mrecord) => {
              mrecord.privateoutN != '' &&
                mrecord.privateoutN != null &&
                countArrPrivateoutN.push(mrecord.privateoutN);
              mrecord.overtimerestN != '' &&
                mrecord.overtimerestN != null &&
                countArrOvertimerestN.push(mrecord.overtimerestN);
              mrecord.workinplanN != '' &&
                mrecord.workinplanN != null &&
                countArrWorkinplanN.push(mrecord.workinplanN);
              mrecord.workoverplanN != '' &&
                mrecord.workoverplanN != null &&
                countArrWorkoverplanN.push(mrecord.workoverplanN);
            });
          }
        }
      });
    this.privateoutNCount = this.calcTimeCountCommon(
      countArrPrivateoutN,
      countHourPrivateoutN,
      countMinutePrivateoutN
    );
    this.overtimerestNConur = this.calcTimeCountCommon(
      countArrOvertimerestN,
      countHourOvertimerestN,
      countMinuteOvertimerestN
    );
    this.workinplanNConur = this.calcTimeCountCommon(
      countArrWorkinplanN,
      countHourWorkinplanN,
      countMinuteWorkinplanN
    );
    this.workoverplanNConur = this.calcTimeCountCommon(
      countArrWorkoverplanN,
      countHourWorkoverplanN,
      countMinuteWorkoverplanN
    );
  }

  calcTimeCountCommon(
    countArr: string[],
    countHour: any[],
    countMinute: any[]
  ): string {
    let countTargetHour: string;
    let countTargetMinute: string;
    let countFinalHour: string;
    let countFinalMinute: string;

    if (countArr.length > 0) {
      countArr.forEach((item) => {
        if (item != null) {
          countHour.push(Number.parseInt(item.split(':')[0]));
          countMinute.push(Number.parseInt(item.split(':')[1]));
        }
      });
      countTargetHour = this.sum(countHour);
      countTargetMinute = this.sum(countMinute);

      countFinalHour = countTargetHour + Math.floor(Number.parseInt(countTargetMinute) / 60);


      countFinalMinute = (Number.parseInt(countTargetMinute) % 60).toString();
      if (countFinalMinute.length < 2) {
        countFinalMinute = '0' + countFinalMinute;
      }

      return `${countFinalHour}:${countFinalMinute}`;
    }
  }

  sum(arr: string[]) {
    return eval(arr.join('+'));
  }

  //実績確定
  save() {
    this.errorMessageInfo.clear();
    this.listOfUpdateAttendanceData = [];
    this.selectedData.forEach((key) => {
      this.listOfUpdateAttendanceData.push(key);
    });
    console.log(JSON.stringify(this.listOfUpdateAttendanceData));

    if (this.listOfUpdateAttendanceData.length == 0) {
      this.modal.warning({
        nzTitle: '対象が選択されていないため、実績確定が出来ません。',
        nzOkText: 'OK',
      });
    } else {
      console.log(this.listOfUpdateAttendanceData);
      this.isSpinning = true;
      let postData;
      let attendanceInfoList = this.listOfUpdateAttendanceData;
      let loginInfo = { "personId": `${this.inputParems.personId}`, "conmpanyId": `${this.inputParems.conmpanyId}` };
      let targetInfo = { "targetPersonId": `${this.inputParems.targetPersonId}`, "targetConmpanyId": `${this.inputParems.targetConmpanyId}`, "targetMonth": `${this.inputParems.targetMonth}`, "teamId": `${this.inputParems.teamId}`, "startDate": `${this.inputParems.startDate}`, "endDate": `${this.inputParems.endDate}` };
      postData = { loginInfo, attendanceInfoList, targetInfo };
      this.service.updateAttendanceRecords(postData)
        .subscribe((res) => {
          if (res != null && res.code == 200) {
            const resData = res.data;
            if (resData != null) {
              if (resData.resultCode == "error" && resData.errorMessageList.length > 0) {
                if (resData.errorMessageList[0].messageType == "W1") {
                  this.isSpinning = false;
                  this.modal.error({
                    nzTitle: `${resData.errorMessageList[0].messageInfo}`,
                    nzOkText: 'OK',
                  });
                } else if (resData.errorMessageList[0].messageType == "W3") {
                  this.isSpinning = false;
                  this.errorMessageInfo.set(resData.errorMessageList[0].messageId, resData.errorMessageList[0].messageInfo);
                }

              } else {
                this.isSpinning = false;
                this.reloadAttendanceInfoList(this.inputParems);
              }
            }
          }
        });
    }
  }

  //選択たレコード
  selectedItems(ev: Event, data: AttendanceInfo, index: string): void {
    if (ev) {
      this.selectedData.set(index, data);
    } else {
      this.selectedData.delete(index);
    }
    console.log(this.selectedData);
  }

  //前月　202110
  prevMonthClick(): void {
    if (this.monthActionFlag) {
      this.modal.confirm({
        nzTitle: '<i>登録が実行されていません。変更内容が失われますがよろしいですか？</i>',
        nzContent: '',
        nzOkText: 'OK',
        nzCancelText: 'キャンセル',
        nzOnOk: (() => { this.prevMonth(); })
      });
    } else {
      this.prevMonth();
    }

  }

  prevMonth() {
    this.errorMessageInfo.clear();
    this.targetMonth--;
    let year = this.targetMonth.toString().substring(0, 4);
    let month = this.targetMonth.toString().substring(4);

    if (Math.abs(Number.parseInt(month)) == 0) {
      year = (Number.parseInt(year) - 1).toString();
      month = '12';
      const newTargetMonth = `${year}${month}`;
      this.targetMonth = Number.parseInt(newTargetMonth);
    }
    const newInputParems = JSON.parse(JSON.stringify(this.inputParems));
    newInputParems.targetMonth = this.targetMonth.toString();
    if (Number.parseInt(month) - 1 >= 10) {
      newInputParems.startDate = year + '/' + (Number.parseInt(month) - 1) + '/' + '21';
    } else if (Number.parseInt(month) == 1) {
      newInputParems.startDate = (Number.parseInt(year) - 1) + '/12' + '/' + '21';
    } else {
      newInputParems.startDate = year + '/0' + (Number.parseInt(month) - 1) + '/' + '21';
    }

    newInputParems.endDate = year + '/' + month + '/' + '20';
    this.reloadAttendanceInfoList(newInputParems);
  }

  //次月
  nextMonthClick(): void {
    if (this.monthActionFlag) {
      this.modal.confirm({
        nzTitle: '<i>登録が実行されていません。変更内容が失われますがよろしいですか？</i>',
        nzContent: '',
        nzOkText: 'OK',
        nzCancelText: 'キャンセル',
        nzOnOk: (() => { this.nextMonth(); })
      });
    } else {
      this.nextMonth();
    }
  }

  nextMonth() {
    this.errorMessageInfo.clear();
    this.targetMonth++;
    let year = this.targetMonth.toString().substring(0, 4);
    let month = this.targetMonth.toString().substring(4);

    if (Math.abs(Number.parseInt(month)) > 12) {
      year = (Number.parseInt(year) + 1).toString();
      month = '01';
      const newTargetMonth = `${year}${month}`;
      this.targetMonth = Number.parseInt(newTargetMonth);
    }
    const newInputParems = JSON.parse(JSON.stringify(this.inputParems));
    newInputParems.targetMonth = this.targetMonth.toString();
    if (Number.parseInt(month) - 1 >= 10) {
      newInputParems.startDate = year + '/' + (Number.parseInt(month) - 1) + '/' + '21';
    } else if (Number.parseInt(month) == 1) {
      newInputParems.startDate = (Number.parseInt(year) - 1) + '/12' + '/' + '21';
    } else {
      newInputParems.startDate = year + '/0' + (Number.parseInt(month) - 1) + '/' + '21';
    }
    newInputParems.endDate = year + '/' + month + '/' + '20';
    this.reloadAttendanceInfoList(newInputParems);
  }

  monthDisabled(params: string): boolean {
    let currentAttendanceYm = this.commonInfo.currentAttendanceYm;
    let searchPossiblePeriod: any = this.commonInfo.searchPossiblePeriod;
    let currentY = currentAttendanceYm.split("/")[0];
    let currentM = currentAttendanceYm.split("/")[1];
    let currentYM;
    let yy = new Date().getFullYear()
    let mm = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)
    let nowYM = yy + '' + mm;

    let _month;
    if (mm <= searchPossiblePeriod) {
      currentM = (Number(currentM) + 12).toString();
      currentY = (Number(currentY) - 1).toString()
    }
    currentYM = Number(currentY + currentM);
    _month = currentYM - searchPossiblePeriod

    if (this.targetMonth <= _month && params == 'prev') {
      return true
    } else if (this.targetMonth >= Number(nowYM) && params == 'next') {
      return true
    }
    return false;
  }


  clear(): void {
    this.modal.confirm({
      nzTitle: '<i>画面上のデータを初期状態に戻します。よろしいですか？</i>',
      nzContent: '',
      nzOkText: 'OK',
      nzCancelText: 'キャンセル',
      nzOnOk: (() => {
        this.errorMessageInfo.clear();
        this.ngOnInit();
      })
    });
  }


  bgColorLogic(data: AttendanceInfo, index: number): string {

    let actualInfoList: ActualInfo;
    if (data != null && data.actualInfoList.length > 0) {
      // 実績実行時間
      actualInfoList = data.actualInfoList[index];
      const actualExecuteDate = data.actualExecuteDate;
      if (actualExecuteDate != null) {
        if (actualInfoList.modifyKind != null && actualInfoList.modifyKind != 'OnlineModifiedToday') {
          return this.commonInfo.c294Value;
        } else {
          // 計画実行時間
          const assignmentExecuteDate = data.assignmentExecuteDate;
          if (assignmentExecuteDate != null) {
            if (this.getDateTime(actualExecuteDate) > this.getDateTime(assignmentExecuteDate)) {
              return this.commonInfo.c294Value;
            } else {
              return this.commonInfo.c004Value;
            }
          } else {
            return this.commonInfo.c294Value;
          }
        }
      } else {
        if (actualInfoList.modifyKind != null && actualInfoList.modifyKind == 'OnlineModifiedToday') {
          return this.commonInfo.c004Value;
        }
      }
    }

    return '';
  }

  StrToDate(datestr: string): Date {
    return new Date(datestr);
  }

  dailyApprovalStatus(data: AttendanceInfo, index: number): string {
    if (data != null && data.actualInfoList != null && data.actualInfoList.length > 0) {
      if (data.actualInfoList[index].dailyApprovalStatus == 'Registration') {
        return this.commonInfo.tempConfirmMark;
      } else if (data.actualInfoList[index].dailyApprovalStatus == 'HighApproval') {
        return this.commonInfo.confirmedMark;
      } else {
        return '';
      }
    }
  }

  planStartEndTime(data: AttendanceInfo, index: number): string {
    if (data != null) {
      if (data.assignmentInfoList != null && data.assignmentInfoList.length > 0) {
        if (data.assignmentInfoList[index] != null) {
          const planStartTime = this.trims(data.assignmentInfoList[index].planStartTime);
          const planEndTime = this.trims(data.assignmentInfoList[index].planEndTime);

          if (data.assignmentInfoList[index].holidayId != '' && data.assignmentInfoList[index].holidayClassifyCode != '0010') {
            return data.assignmentInfoList[index].holidayName;
          } else {
            if (planStartTime != '' && planEndTime != '') {
              return this.formatPlanDate(planStartTime) + '~' + this.formatPlanDate(planEndTime);
            }
          }
        }
      } else {
        const tgtdate = data.targetDate;
        if (this.getDateTime(tgtdate) < this.getDateTime(this.commonInfo.workingStartDate) ||
          this.getDateTime(tgtdate) > this.getDateTime(this.commonInfo.retireDate)) {
          return this.commonInfo.hyphenMark;
        }
        if (!this.isDateBetween(tgtdate)) {
          return this.commonInfo.dispatchMark;
        }
      }
    }
    return '';
  }

  tgtdateLabel(data: AttendanceInfo, index: number): boolean {
    if (data != null) {
      if (data.actualInfoList != null && data.actualInfoList.length > 0) {
        if (this.getDateTime(data.actualInfoList[index].tgtdate) < this.getDateTime(this.commonInfo.workingStartDate)) {
          return true;
        }
      }
    }
    return false;
  }

  isDateBetween(tgtdate: string): boolean {
    if (this.commonInfo.validPeriodList) {
      for (let i = 0; i < this.commonInfo.validPeriodList.length; i++) {
        if (this.getDateTime(tgtdate) > this.getDateTime(this.commonInfo.validPeriodList[i].periodStart) && this.getDateTime(tgtdate) < this.getDateTime(this.commonInfo.validPeriodList[i].periodEnd)) {
          return true;
        }
      }
      return false;
    }
  }

  formatPlanDate(strDate: string) {
    if (strDate != '') {
      return strDate.slice(0, 5)
    }
  }

  getDateTime(strDate: string) {
    if (strDate != null && this.trims(strDate) != '') {
      strDate = strDate.replace(/_/g, "/");
      var date = new Date(strDate);
      return date.getTime();
    }
  }

  trims(str) {
    if (str != null) {
      return str.replace(/[ ]/g, "");
    }
  }

  disabledLinmuKaisuFlag(data: AttendanceInfo, index: number): boolean {
    if (data != null) {
      if (data.actualInfoList != null && data.actualInfoList.length > 0) {
        if (data.assignmentInfoList[index] == null && data.actualInfoList[index].kinmuKaisu != null) {
          return true;
        }
      }
    }
    return false;
  }

  monthChange() {
    this.monthActionFlag = true;
    console.log(this.monthActionFlag);

  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
