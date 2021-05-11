import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { ErrorMessageInfo, FormInfo, GoodsInfoResponse, GroupInfoResponse, InitInfoResponse, OrderInfoCsvResponse, OrderInfoResponse, PersonInfoResponse } from "./models/model";

@Injectable()
export class MdService {
    http: HttpClient;
    private headers = new HttpHeaders().set("Ocp-Apim-Subscription-Key", "8b20ebe3b2e94770982946de0f485c11");
    baseUrl = environment.baseUrlForMd
    subject: Subject<string> = new Subject<string>();

    constructor(http: HttpClient) {
        this.http = http;
    }


    getMessage(message) {
        this.subject.next(message);
    }


    get(): Observable<any> {
        return this.subject.asObservable();
    }

    getPersonInfo(personId: string): Observable<PersonInfoResponse> {
        let params: HttpParams = new HttpParams({ fromString: `personId=${personId}` });

        return this.http.get<PersonInfoResponse>(this.baseUrl + `orderinfo/PersonInfo`, { params: params, headers: this.headers});
    }

    getGroupInfo(group1Code: string, group2Code: string, group3Code: string, group4Code: string): Observable<GroupInfoResponse> {

        let params: HttpParams = new HttpParams({ fromString: `group1Code=${group1Code}&group2Code=${group2Code}&group3Code=${group3Code}&group4Code=${group4Code}` });

        return this.http.get<GroupInfoResponse>(this.baseUrl + 'orderinfo/GroupInfo', { params: params, headers: this.headers });
    }

    getGoodsInfo(classification2CodeLog: string, classification3CodeLog: string): Observable<GoodsInfoResponse> {
        let params: HttpParams = new HttpParams({ fromString: `classification2CodeLog=${classification2CodeLog}&classification3CodeLog=${classification3CodeLog}` });

        return this.http.get<GoodsInfoResponse>(this.baseUrl + 'orderinfo/GoodsInfo', { params: params, headers: this.headers });
    }

    getInitInfo(janCodeCondition: string): Observable<InitInfoResponse> {
        let params: HttpParams = new HttpParams({ fromString: `janCodeCondition=${janCodeCondition}` });
        return this.http.get<InitInfoResponse>(this.baseUrl + 'orderinfo/InitInfo', { params: params, headers: this.headers });
    }

    getOrderInfoIMG(formInfo: FormInfo): Observable<OrderInfoResponse> {
        let params: HttpParams = new HttpParams({
            fromString: `kubenn1=${formInfo.kubenn1}&kubenn2=${formInfo.kubenn2}&kubenn3=${formInfo.kubenn3}&group1Code=${formInfo.group1Code}&group2Code=${formInfo.group2Code}&group3Code=${formInfo.group3Code}&group4Code=${formInfo.group4Code}&genCode=${formInfo.genCode}&storeGroupCode=${formInfo.storeGroupCode}&groupCode=${formInfo.groupCode}&bumonCode=${formInfo.bumonCode}&categoryCode=${formInfo.categoryCode}&janCode=${formInfo.janCode}&orderDateFrom=${formInfo.orderDateFrom}&orderDateTo=${formInfo.orderDateTo}&deliveryDateFrom=${formInfo.deliveryDateFrom}&deliveryDateTo=${formInfo.deliveryDateTo}`
        });

        return this.http.get<OrderInfoResponse>(this.baseUrl + 'orderinfo/OrderInfoImg', { params: params, headers: this.headers });
    }

    getOrderInfoCsv(formInfo: FormInfo): Observable<any> {

        let params: HttpParams = new HttpParams({
            fromString: `kubenn1=${formInfo.kubenn1}&kubenn2=${formInfo.kubenn2}&kubenn3=${formInfo.kubenn3}&group1Code=${formInfo.group1Code}&group2Code=${formInfo.group2Code}&group3Code=${formInfo.group3Code}&group4Code=${formInfo.group4Code}&genCode=${formInfo.genCode}&storeGroupCode=${formInfo.storeGroupCode}&groupCode=${formInfo.groupCode}&bumonCode=${formInfo.bumonCode}&categoryCode=${formInfo.categoryCode}&janCode=${formInfo.janCode}&orderDateFrom=${formInfo.orderDateFrom}&orderDateTo=${formInfo.orderDateTo}&deliveryDateFrom=${formInfo.deliveryDateFrom}&deliveryDateTo=${formInfo.deliveryDateTo}`
        });

        let options_: any = {
            observe: "response",
            responseType: "blob",
            withCredentials: true,
            charset: 'SJIS',
            params: params,
            headers: this.headers
        };

        return this.http.get(this.baseUrl + 'orderinfo/OrderInfoCsv', options_);
    }

    errorCheck(errorMessages: Map<string, string>, errorMessageInfo: ErrorMessageInfo): boolean {
        if (errorMessageInfo) {
            errorMessages.set(errorMessageInfo.errorCode, errorMessageInfo.errorMessage);
            return true;
        } else {
            errorMessages = new Map<string, string>();
            return false;
        }
    }
}

