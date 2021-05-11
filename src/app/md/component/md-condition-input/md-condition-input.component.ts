import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { forkJoin, Observable, BehaviorSubject } from 'rxjs';
import { MdService } from '../../md.service';
import { Router } from '@angular/router';
import { ErrorMessageInfo, FormInfo, GoodsInfoResponse, GroupInfoResponse, InitInfoResponse } from '../../models/model';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import { debounceTime, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-md-condition-input',
  templateUrl: './md-condition-input.component.html',
  styleUrls: ['./md-condition-input.component.sass']
})
export class MddxConditionInputComponent implements OnInit {

  public loginError: Observable<any>;

  groupValidator = false;


  csvExportButtonDisableFlag: boolean = false;
  isSpinning = false;
  isSpinningCompany = false;
  isSpinningBusiness = false;
  isSpinningLargeArea = false;
  isSpinningSmallArea = false;
  isSpinningGroup = false;
  isSpinningBumon = false;
  isLoading = false;
  exportType1Options = [
    { label: '店舗発注', value: '2' },
    { label: '商品部発注', value: '1', checked: true }
  ];

  dateFormat = 'yyyy/MM/dd';

  orderInfo: any[];
  countInfo: any[];
  errorMessageSize: number;

  mddxForm = this.fb.group({
    organization: this.fb.group({
      company: [[]],
      businesstype: [[]],
      largearea: [[]],
      smallarea: [[]],
      storegroup: [[]],
      gen: [[]],
    }),
    commodity: this.fb.group({
      group: [[]],
      bumon: [[]],
      category: [[]],
      jan: [[]]
    }),
    duration: this.fb.group({
      orderDateFrom: [],
      orderDateTo: [],
      deliveryDateFrom: [],
      deliveryDateTo: [],
    }),
    exportType1: ['1'],
    exportType2: ['0'],
    exportType3: ['0']
  });

  companies = new Map<string, string>();
  businesstypes = new Map<string, string>()
  largeareas = new Map<string, string>();
  smallareas = new Map<string, string>();
  gens = new Map<string, string>();
  storegroups = new Map<string, string>();
  groups = new Map<string, string>();
  bumons = new Map<string, string>();
  categories = new Map<string, string>();
  jans = new Map<string, string>();
  errorMessageInfoForOrganization = new Map<string, string>();
  errorMessageInfoForCompany: ErrorMessageInfo;
  errorMessageInfoForBusiness: ErrorMessageInfo;
  errorMessageInfoForLargeArea: ErrorMessageInfo;
  errorMessageInfoForSmallArea: ErrorMessageInfo;
  errorMessageInfoForCommodity = new Map<string, string>();
  errorMessageInfoForPerson = new Map<string, string>();
  errorMessageInfoForGroup: ErrorMessageInfo;
  errorMessageInfoForBumon: ErrorMessageInfo;
  errorMessageInfo = new Map<string, string>();

  companyControl = this.mddxForm.get('organization').get('company');
  businessTypeControl = this.mddxForm.get('organization').get('businesstype');
  largeAreaControl = this.mddxForm.get('organization').get('largearea');
  smallAreaControl = this.mddxForm.get('organization').get('smallarea');
  genControl = this.mddxForm.get('organization').get('gen');
  storeGroupCodeControl = this.mddxForm.get('organization').get('storegroup');
  groupControl = this.mddxForm.get('commodity').get('group');
  bumonControl = this.mddxForm.get('commodity').get('bumon');
  categoryControl = this.mddxForm.get('commodity').get('category');
  janControl = this.mddxForm.get('commodity').get('jan');
  orderDateFromControl = this.mddxForm.get('duration').get('orderDateFrom');
  orderDateToControl = this.mddxForm.get('duration').get('orderDateTo');
  deliveryDateFromControl = this.mddxForm.get('duration').get('deliveryDateFrom');
  deliveryDateToControl = this.mddxForm.get('duration').get('deliveryDateTo');

  companySearchChange$ = new BehaviorSubject([]);
  businessSearchChange$ = new BehaviorSubject([]);
  largeAreaSearchChange$ = new BehaviorSubject([]);
  smallAreaSearchChange$ = new BehaviorSubject([]);
  groupSearchChange$ = new BehaviorSubject([]);
  bumonSearchChange$ = new BehaviorSubject([]);
  janCodeSearchChange$ = new BehaviorSubject('');

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private mdApiService: MdService,
    private router: Router) { }

  ngOnInit() {
    this.isSpinning = true;
    this.mdApiService.get().subscribe((res) => {
      this.errorMessageInfoForPerson = res;
    })

    forkJoin(
      this.mdApiService.getGroupInfo('', '', '', ''),
      this.mdApiService.getGoodsInfo('', ''),
      this.mdApiService.getInitInfo('')
    ).subscribe(res => {
      if (this.mdApiService.errorCheck(this.errorMessageInfoForOrganization, res[0].data.errorMessageInfo)) {
        this.isSpinning = false;
      }
      if (res[0].data.groupInfoList) {
        res[0].data.groupInfoList.forEach(x => {
          this.companies.set(x.group1Code, x.group1Name);
        });
      }

      if (this.mdApiService.errorCheck(this.errorMessageInfoForCommodity, (res[1].data.errorMessageInfo))) {
        this.isSpinning = false;
      }
      if (res[1].data.classificationList) {
        res[1].data.classificationList.forEach(x => {
          this.groups.set(x.classification2CodeLog, x.classification2NameKanjiLog);
        });
      }

      if (this.mdApiService.errorCheck(this.errorMessageInfo, (res[2].data.errorMessageInfo))) {
        this.isSpinning = false;
      }
      if (res[2].data.storeGroupInfoList) {
        res[2].data.storeGroupInfoList.forEach(x => {
          this.storegroups.set(x.storeGroupCode, x.storeGroupName);
        });
      }
      if (res[2].data.goodsBaseInfoList) {
        res[2].data.goodsBaseInfoList.forEach(x => {
          this.jans.set(x.janCode, x.janName);
        });
      }

      if ((!this.errorMessageInfoForOrganization.size && (this.companyControl.value as string[]).length) || (this.businessTypeControl.value as string[]).length) {
        this.businessTypeControl.enable();
      } else {
        this.businessTypeControl.disable();
      }
      if ((!this.errorMessageInfoForOrganization.size && (this.businessTypeControl.value as string[]).length) || (this.largeAreaControl.value as string[]).length) {
        this.largeAreaControl.enable();
      } else {
        this.largeAreaControl.disable();
      }
      if ((!this.errorMessageInfoForOrganization.size && (this.largeAreaControl.value as string[]).length) || (this.smallAreaControl.value as string[]).length) {
        this.smallAreaControl.enable();
      } else {
        this.smallAreaControl.disable();
      }
      if ((!this.errorMessageInfoForOrganization.size && (this.smallAreaControl.value as string[]).length) || (this.genControl.value as string[]).length) {
        this.genControl.enable();
      } else {
        this.genControl.disable();
      }
      if ((!this.errorMessageInfoForCommodity.size && (this.groupControl.value as string[]).length) || (this.bumonControl.value as string[]).length) {
        this.bumonControl.enable();
      } else {
        this.bumonControl.disable();
      }
      if ((!this.errorMessageInfoForCommodity.size && (this.bumonControl.value as string[]).length) || (this.categoryControl.value as string[]).length) {
        this.categoryControl.enable();
      } else {
        this.categoryControl.disable();
      }
      this.isSpinning = false;
      this.prepareEvents();
    });
  }

  mergeMessage() {
    if (this.errorMessageInfoForCompany) {
      if (!this.errorMessageInfoForOrganization.has(this.errorMessageInfoForCompany.errorCode)) {
        this.errorMessageInfoForOrganization.set(this.errorMessageInfoForCompany.errorCode, this.errorMessageInfoForCompany.errorMessage)
      }
    }

    if (this.errorMessageInfoForBusiness) {
      if (!this.errorMessageInfoForOrganization.has(this.errorMessageInfoForBusiness.errorCode)) {
        this.errorMessageInfoForOrganization.set(this.errorMessageInfoForBusiness.errorCode, this.errorMessageInfoForBusiness.errorMessage)
      }
    }

    if (this.errorMessageInfoForLargeArea) {
      if (!this.errorMessageInfoForOrganization.has(this.errorMessageInfoForLargeArea.errorCode)) {
        this.errorMessageInfoForOrganization.set(this.errorMessageInfoForLargeArea.errorCode, this.errorMessageInfoForLargeArea.errorMessage)
      }
    }

    if (this.errorMessageInfoForSmallArea) {
      if (!this.errorMessageInfoForOrganization.has(this.errorMessageInfoForSmallArea.errorCode)) {
        this.errorMessageInfoForOrganization.set(this.errorMessageInfoForSmallArea.errorCode, this.errorMessageInfoForSmallArea.errorMessage)
      }
    }

    if (this.errorMessageInfoForGroup) {
      if (!this.errorMessageInfoForCommodity.has(this.errorMessageInfoForGroup.errorCode)) {
        this.errorMessageInfoForCommodity.set(this.errorMessageInfoForGroup.errorCode, this.errorMessageInfoForGroup.errorMessage)
      }
    }

    if (this.errorMessageInfoForBumon) {
      if (!this.errorMessageInfoForCommodity.has(this.errorMessageInfoForBumon.errorCode)) {
        this.errorMessageInfoForCommodity.set(this.errorMessageInfoForBumon.errorCode, this.errorMessageInfoForBumon.errorMessage)
      }
    }
  }

  onCompanySelected(companyCode: string[]) {
    this.isSpinningCompany = true;
    this.companySearchChange$.next(companyCode);
  }

  onBusinessTypeSelected(businessTypeCode: string[]) {
    this.isSpinningBusiness = true;
    this.businessSearchChange$.next(businessTypeCode);
  }

  onLargeAreasSelected(largeAreaCode: string[]) {
    this.isSpinningLargeArea = true;
    this.largeAreaSearchChange$.next(largeAreaCode);
  }

  onSmallAreasSelected(smallAreaCode: string[]) {
    this.isSpinningSmallArea = true;
    this.smallAreaSearchChange$.next(smallAreaCode);
  }

  onGroupSelected(groupCode: string[]) {
    this.isSpinningGroup = true;
    this.groupValidator = false;
    this.groupSearchChange$.next(groupCode);
  }

  onBumonSelected(bumonCode: string[]) {
    this.isSpinningBumon = true;
    this.bumonSearchChange$.next(bumonCode);
  }

  onJanCodeSelected(janCodeCondition: string) {
    this.isLoading = true;
    this.jans = new Map<string, string>();
    this.janCodeSearchChange$.next(janCodeCondition);
  }

  onExportType3Changed(type: string) {
    this.csvExportButtonDisableFlag = type === "1";
  }

  csvExport() {
    if (this.mddxForm.get('exportType2').value === "1" && !this.groupControl.value.length) {
      this.groupValidator = true;
    } else {
      this.groupValidator = false;
      this.isSpinning = true;
      this.mdApiService.getOrderInfoCsv(this.getFormInfo()).subscribe((result: any) => {
        var blob = new Blob([result.body]);
        this.isSpinning = false;
        FileSaver.saveAs(blob, `Md_keppin_${moment().format('YYYYMMDDHHmmss')}.csv`);
      });
    }
  }


  submitForm() {
    if (this.mddxForm.get('exportType2').value === "1" && !this.groupControl.value.length) {
      this.groupValidator = true;
    } else {
      this.groupValidator = false;
      this.isSpinning = true;
      const formInfo = this.getFormInfo();
      this.mdApiService.getOrderInfoIMG(formInfo).subscribe(res => {
        const errorMessage = res.data.errorMessageInfo;
        if (this.mddxForm.get('exportType2').value == '0') {
          this.orderInfo = res.data.goodsDisplayList;
          this.router.navigate(['/md/orderInfoResult'], { state: { orderInfo: this.orderInfo, errorMessage: errorMessage, formInfo: formInfo } }).then(() => {
            this.isSpinning = false;
          });
        } else {
          this.countInfo = res.data.countDisplayList;
          this.router.navigate(['/md/orderInfoCountDiaplay'], { state: { countInfo: this.countInfo, errorMessage: errorMessage, formInfo: formInfo } }).then(() => {
            this.isSpinning = false;
          });
        }
      },
        err => {
          this.isSpinning = false;
        }
      )
    }
  }

  getFormInfo(): FormInfo {
    const kubenn1 = this.mddxForm.get('exportType1').value.filter(x => x.checked).map(x => x.value) as string[];
    const kubenn2 = this.mddxForm.get('exportType2').value as string;
    const kubenn3 = this.mddxForm.get('exportType3').value as string;
    const group1Code = this.companyControl.value as string[];
    const group2Code = this.businessTypeControl.value as string[];
    const group3Code = this.largeAreaControl.value as string[];
    const group4Code = this.smallAreaControl.value as string[];
    const genCode = this.genControl.value as string[];
    const storeGroupCode = this.storeGroupCodeControl.value as string[];
    const groupCode = this.groupControl.value as string[];
    const bumonCode = this.bumonControl.value as string[];
    const categoryCode = this.categoryControl.value as string[];
    const janCode = this.janControl.value as string[];
    const orderDateFrom = this.orderDateFromControl.value === null ? '' : moment(this.orderDateFromControl.value as Date).format('YYYYMMDD');
    const orderDateTo = this.orderDateToControl.value === null ? '' : moment(this.orderDateToControl.value as Date).format('YYYYMMDD');
    const deliveryDateFrom = this.deliveryDateFromControl.value === null ? '' : moment(this.deliveryDateFromControl.value as Date).format('YYYYMMDD');
    const deliveryDateTo = this.deliveryDateToControl.value === null ? '' : moment(this.deliveryDateToControl.value as Date).format('YYYYMMDD');

    const result: FormInfo = {
      kubenn1: kubenn1,
      kubenn2: kubenn2,
      kubenn3: kubenn3,
      group1Code: group1Code,
      group2Code: group2Code,
      group3Code: group3Code,
      group4Code: group4Code,
      genCode: genCode,
      storeGroupCode: storeGroupCode,
      groupCode: groupCode,
      bumonCode: bumonCode,
      categoryCode: categoryCode,
      janCode: janCode,
      orderDateFrom: orderDateFrom,
      orderDateTo: orderDateTo,
      deliveryDateFrom: deliveryDateFrom,
      deliveryDateTo: deliveryDateTo
    };

    if (kubenn2 === '0') {
      result.kubenn1 = _(kubenn1).replace('0', '2').replace('3', '1').split(',');
    } else {
      result.kubenn1 = _(kubenn1).replace('2', '0').replace('1', '3').split(',');
    }

    return result;
  }

  orderDateValidator(): boolean {
    const orderDateFrom = this.orderDateFromControl.value === null ? '' : moment(this.orderDateFromControl.value as Date).format('YYYYMMDD');
    const orderDateTo = this.orderDateToControl.value === null ? '' : moment(this.orderDateToControl.value as Date).format('YYYYMMDD');

    if (!orderDateFrom || !orderDateTo) {
      return false;
    }
    return ((orderDateFrom > orderDateTo));
  }

  deliveryDateValidator(): boolean {
    const deliveryDateFrom = this.deliveryDateFromControl.value === null ? '' : moment(this.deliveryDateFromControl.value as Date).format('YYYYMMDD');
    const deliveryDateTo = this.deliveryDateToControl.value === null ? '' : moment(this.deliveryDateToControl.value as Date).format('YYYYMMDD');

    if (!deliveryDateFrom || !deliveryDateTo) {
      return false;
    }
    return ((deliveryDateFrom > deliveryDateTo));
  }

  exportType1Validator(): boolean {
    return this.mddxForm.get('exportType1').value.every(x => !x.checked);
  }

  groupValidatorCheck() {
    if (this.mddxForm.get('exportType2').value === "0") {
      this.groupValidator = false;
    }
  }

  private prepareEvents() {
    this.janCodeSearchChange$.pipe(debounceTime(1000))
      .pipe(switchMap(janCodeCondition => this.mdApiService.getInitInfo(janCodeCondition)))
      .subscribe((res: InitInfoResponse) => {
        if (res.data.goodsBaseInfoList) {
          res.data.goodsBaseInfoList.forEach(x => {
            this.jans.set(x.janCode, x.janName);
          });
        }
        this.isLoading = false;
      });

    this.groupSearchChange$.pipe(debounceTime(2000))
      .pipe(switchMap(groupCode => this.mdApiService.getGoodsInfo(groupCode.join(','), '')))
      .subscribe((res: GoodsInfoResponse) => {
        this.errorMessageInfoForCommodity.clear();
        this.bumons.clear();
        this.errorMessageInfoForGroup = res.data.errorMessageInfo;
        if (res.data && res.data.classificationList && res.data.classificationList.length > 0 && !this.errorMessageInfoForGroup && this.groupControl.value.length > 0) {
          this.bumonControl.enable();
        } else {
          this.bumonControl.disable();
        }

        if (res.data.classificationList) {
          res.data.classificationList.forEach(x => {
            this.bumons.set(x.classification3CodeLog, x.classification3NameKanjiLog);
          });
          if (this.bumonControl.value && this.bumonControl.value.length > 0) {
            let selectedValues = [];
            this.bumonControl.value.forEach(v => {
              if (this.bumons && this.bumons.has(v)) {
                selectedValues.push(v);
              }
            });
            this.bumonControl.setValue(selectedValues);
          }
        } else {
          this.bumons.clear();
          this.bumonControl.setValue([]);
        }
        this.mergeMessage();
        this.isSpinningGroup = false;
      });

    this.bumonSearchChange$.pipe(debounceTime(2000))
      .pipe(switchMap(bumonCode => this.mdApiService.getGoodsInfo('', bumonCode.join(','))))
      .subscribe((res: GoodsInfoResponse) => {
        this.errorMessageInfoForCommodity.clear();
        this.categories.clear();
        this.errorMessageInfoForBumon = res.data.errorMessageInfo;
        if (res.data && res.data.classificationList && res.data.classificationList.length > 0 && !this.errorMessageInfoForBumon && this.bumonControl.value.length > 0) {
          this.categoryControl.enable();
        } else {
          this.categoryControl.disable();
        }
        if (res.data.classificationList) {
          res.data.classificationList.forEach(x => {
            this.categories.set(x.classification4CodeLog, x.classification4NameKanjiLog);
          });
          if (this.categoryControl.value && this.categoryControl.value.length > 0) {
            let selectedValues = [];
            this.categoryControl.value.forEach(v => {
              if (this.categories && this.categories.has(v)) {
                selectedValues.push(v);
              }
            });
            this.categoryControl.setValue(selectedValues);
          }
        } else {
          this.categories.clear();
          this.categoryControl.setValue([]);
        }
        this.mergeMessage();
        this.isSpinningBumon = false;
      });

    this.companySearchChange$.pipe(debounceTime(2000))
      .pipe(switchMap(companyCode => this.mdApiService.getGroupInfo(companyCode.join(','), '', '', '')))
      .subscribe((res: GroupInfoResponse) => {
        this.errorMessageInfoForOrganization.clear();
        this.businesstypes.clear();
        this.errorMessageInfoForCompany = res.data.errorMessageInfo;
        if (res.data && res.data.groupInfoList && res.data.groupInfoList.length > 0 && !this.errorMessageInfoForCompany && this.companyControl.value.length > 0) {
          this.businessTypeControl.enable();
        } else {
          this.businessTypeControl.disable();
        }

        if (res.data.groupInfoList) {
          res.data.groupInfoList.forEach(x => {
            this.businesstypes.set(x.group2Code, x.group2Name);
          });
          if (this.businessTypeControl.value && this.businessTypeControl.value.length > 0) {
            let selectedValues = [];
            this.businessTypeControl.value.forEach(v => {
              if (this.businesstypes && this.businesstypes.has(v)) {
                selectedValues.push(v);
              }
            });
            this.businessTypeControl.setValue(selectedValues);
          }
        } else {
          this.businesstypes.clear();
          this.businessTypeControl.setValue([]);
        }
        this.mergeMessage();
        this.isSpinningCompany = false;
      });

    this.businessSearchChange$.pipe(debounceTime(2000))
      .pipe(switchMap(businessTypeCode => this.mdApiService.getGroupInfo('', businessTypeCode.join(','), '', '')))
      .subscribe((res: GroupInfoResponse) => {
        this.errorMessageInfoForOrganization.clear();
        this.largeareas.clear();
        this.errorMessageInfoForBusiness = res.data.errorMessageInfo;
        if (res.data && res.data.groupInfoList && res.data.groupInfoList.length > 0 && !this.errorMessageInfoForBusiness && this.businessTypeControl.value.length > 0) {
          this.largeAreaControl.enable();
        } else {
          this.largeAreaControl.disable();
        }

        if (res.data.groupInfoList) {
          res.data.groupInfoList.forEach(x => {
            this.largeareas.set(x.group3Code, x.group3Name);
          });
          if (this.largeAreaControl.value && this.largeAreaControl.value.length > 0) {
            let selectedValues = [];
            this.largeAreaControl.value.forEach(v => {
              if (this.largeareas && this.largeareas.has(v)) {
                selectedValues.push(v);
              }
            });
            this.largeAreaControl.setValue(selectedValues);
          }
        } else {
          this.largeareas.clear();
          this.largeAreaControl.setValue([]);
        }
        this.mergeMessage();
        this.isSpinningBusiness = false;
      });

    this.largeAreaSearchChange$.pipe(debounceTime(2000))
      .pipe(switchMap(largeAreaCode => this.mdApiService.getGroupInfo('', '', largeAreaCode.join(','), '')))
      .subscribe((res: GroupInfoResponse) => {
        this.errorMessageInfoForOrganization.clear();
        this.smallareas.clear();
        this.errorMessageInfoForLargeArea = res.data.errorMessageInfo;
        if (res.data && res.data.groupInfoList && res.data.groupInfoList.length > 0 && !this.errorMessageInfoForLargeArea && this.largeAreaControl.value.length > 0) {
          this.smallAreaControl.enable();
        } else {
          this.smallAreaControl.disable();
        }

        if (res.data.groupInfoList) {
          res.data.groupInfoList.forEach(x => {
            this.smallareas.set(x.group4Code, x.group4Name);
          });
          if (this.smallAreaControl.value && this.smallAreaControl.value.length > 0) {
            let selectedValues = [];
            this.smallAreaControl.value.forEach(v => {
              if (this.smallareas && this.smallareas.has(v)) {
                selectedValues.push(v);
              }
            });
            this.smallAreaControl.setValue(selectedValues);
          }
        } else {
          this.smallareas.clear();
          this.smallAreaControl.setValue([]);
        }
        this.mergeMessage();
        this.isSpinningLargeArea = false;
      });

    this.smallAreaSearchChange$.pipe(debounceTime(2000))
      .pipe(switchMap(smallAreaCode => this.mdApiService.getGroupInfo('', '', '', smallAreaCode.join(','))))
      .subscribe((res: GroupInfoResponse) => {
        this.errorMessageInfoForOrganization.clear();
        this.gens.clear();
        this.errorMessageInfoForSmallArea = res.data.errorMessageInfo;
        if (res.data && res.data.groupInfoList && res.data.groupInfoList.length > 0 && !this.errorMessageInfoForSmallArea && this.smallAreaControl.value.length > 0) {
          this.genControl.enable();
        } else {
          this.genControl.disable();
        }

        if (res.data.groupInfoList) {
          res.data.groupInfoList.forEach(x => {
            this.gens.set(x.genCode, x.genName);
          });
          if (this.genControl.value && this.genControl.value.length > 0) {
            let selectedValues = [];
            this.genControl.value.forEach(v => {
              if (this.gens && this.gens.has(v)) {
                selectedValues.push(v);
              }
            });
            this.genControl.setValue(selectedValues);
          }
        } else {
          this.gens.clear();
          this.genControl.setValue([]);
        }
        this.mergeMessage();
        this.isSpinningSmallArea = false;
      })
  }
}
