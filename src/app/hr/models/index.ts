
export interface AttendanceInfoInput {
  personId: string;
  conmpanyId: string;
  functionId: string;
  menuKbn: string;
  teamId: string;
  groupId: string;
  targetPersonId: string;
  targetConmpanyId: string;
  targetMonth: string; //201202
  startDate: string; //2012-02-12
  endDate: string;
}

export interface AttendanceInfoResponse {
  data: {
    resultCode: string;
    attendanceInfoList: AttendanceInfo[];
    errorMessageList: ErrorMessageInfo[];
    commonInfo: CommonInfo;
  };
}

export interface UserInfoResponse {
  companyName: string;
  companyHombuName: string;
  jigyobuName: string;
  bstName: string;
  groupName: string;
  personCode: string;
  personName: string;
  resultCode: string;
  errorMessageList: ErrorMessageInfo[];
}

export interface ErrorMessageInfo {
  errorCode: string;
  errorMessage: string;
}

export interface AttendanceInfo {
  targetDate?: string;
  actualExecuteDate?: string;
  assignmentExecuteDate?: string;
  actualInfoList: ActualInfo[];
  assignmentInfoList: AssignmentInfo[];
  timeCardInfoList: TimeCardInfo[];
}

export interface ActualInfo {
  attStartTime: string;
  attEndTime: string;
  tgtdate: string;
  kinmuKaisu: string;
  attStartStatus: string;
  attEndStatus: string;
  dailyApprovalStatus: string;
  determinedKbn: string;
  modifyKind: string;
  privateoutN: string;
  overtimerestN: string;
  workinplanN: string;
  workoverplanN: string;
  approvalExecuteDate: string;
}

export interface AssignmentInfo {
  holidayId: string;
  holidayName: string;
  planStartTime: string;
  planEndTime: string;
  tgtdate: string;
  kinmuKaisu: string;
  approvalExecuteDate: string;
  holidayClassifyCode: string;
}

export interface TimeCardInfo {
  personId: string;
  tgtdate: string;
  scanSeq: string;
  enterBstId: string;
  attStartBstId: string;
  attEndBstId: string;
  leaveBstId: string;
  enterTime: string;
  attStTime: string;
  attEdTime: string;
  leaveTime: string;
  actualImportedFlag: string;
}

export interface CommonInfo {
  editableFlag: number;
  c004Value: string;
  c294Value: string;
  tempConfirmMark: string;
  confirmedMark: string;
  dispatchMark: string;
  hyphenMark: string;
  validPeriodList: period[];
  workingStartDate: string;
  retireDate: string;
  currentAttendanceYm: string;
  searchPossiblePeriod: Number;
}

export interface period {
  periodStart: string;
  periodEnd: string;
}