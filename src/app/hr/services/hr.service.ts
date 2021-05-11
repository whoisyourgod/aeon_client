import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AttendanceInfo, AttendanceInfoResponse, UserInfoResponse } from "../models";

@Injectable({
  providedIn: "root",
})
export class HrService {
  private getHeaders = new HttpHeaders().set("Ocp-Apim-Subscription-Key", "8b20ebe3b2e94770982946de0f485c11");
  private postHeaders = new HttpHeaders().set("Content-type", "application/json").append("Ocp-Apim-Subscription-Key", "8b20ebe3b2e94770982946de0f485c11");
  baseUrl = environment.baseUrlForHr
  constructor(private http: HttpClient) { }

  getAttendanceInfo(
    personId: string,
    conmpanyId: string,
    teamId: string,
    functionId: string,
    menuKbn: string,
    groupId: string,
    targetPersonId: string,
    targetConmpanyId: string,
    targetMonth: string, //201202
    startDate: string, //2012-02-12
    endDate: string
  ): Observable<AttendanceInfoResponse> {
    const url = this.baseUrl + `attendancerecords/getAttendanceInfo`;

    let params: HttpParams = new HttpParams()
      .set("personId", personId)
      .set("conmpanyId", conmpanyId)
      .set("teamId", teamId)
      .set("functionId", functionId)
      .set("menuKbn", menuKbn)
      .set("groupId", groupId)
      .set("targetPersonId", targetPersonId)
      .set("targetConmpanyId", targetConmpanyId)
      .set("targetMonth", targetMonth)
      .set("startDate", startDate)
      .set("endDate", endDate);

    return this.http.get<AttendanceInfoResponse>(url, { params:params, headers: this.getHeaders});
  }

  updateAttendanceRecords(data: any) {
    console.log(JSON.stringify(data));
    const url = this.baseUrl + `attendancerecords/updateAttendanceRecords/`;
    return this.http.post<any>(url, JSON.stringify(data), { headers: this.postHeaders })
  }

  getUserInfo(targetPersonId: string, targetConmpanyId: string, startDate: string, endDate: string): Observable<UserInfoResponse> {
    const url = this.baseUrl + `attendancerecords/UserInfo`;
    let params: HttpParams = new HttpParams()
      .set("personId", targetPersonId)
      .set("companyId", targetConmpanyId)
      .set("startDate", startDate)
      .set("endDate", endDate);
    return this.http.get<UserInfoResponse>(url, { params:params, headers: this.getHeaders });
  }

}
