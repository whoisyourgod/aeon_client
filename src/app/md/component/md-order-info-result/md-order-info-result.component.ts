import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import * as FileSaver from 'file-saver';
import { MdService } from '../../md.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-md-order-info-result',
  templateUrl: './md-order-info-result.component.html',
  styleUrls: ['./md-order-info-result.component.sass']
})
export class MddxOrderInfoResultComponent implements OnInit {
  sortValue: string | null = null;
  sortName: string | null = null;
  formInfo: any;
  errorMessageInfo = new Map<string, string>();
  orderInfo: any[]
  listOfDisplayData: any[] = [];
  isSpinning: boolean

  isNumReg = /^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/;

  constructor(private route: ActivatedRoute,
    private mdApiService: MdService) { }

  ngOnInit() {
    this.route.paramMap.pipe(map(() => window.history.state)).subscribe(res => {
      if (res.errorMessage) {
        this.errorMessageInfo.set(res.errorMessage.errorCode, res.errorMessage.errorMessage);
      }
      this.orderInfo = res.orderInfo;
      this.formInfo = res.formInfo;
      if (this.orderInfo) {
        this.listOfDisplayData = [...this.orderInfo];
      }
    })
  }

  sort(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.listOfDisplayData = [...this.orderInfo];
    if (this.sortName && this.sortValue) {
      if (this.sortValue === 'ascend') {
        this.listOfDisplayData = _(this.orderInfo)
          .orderBy(e => {
            const value = e[this.sortName];
            if (this.isNumReg.test(value)) {
              return parseFloat(value)
            }
            return value;
          }, 'asc')
          .value();
      }
      else if (this.sortValue === 'descend') {
        this.listOfDisplayData = _(this.orderInfo)
          .orderBy(e => {
            const value = e[this.sortName];
            if (this.isNumReg.test(value)) {
              return parseFloat(value)
            }
            return value;
          }, 'desc')
          .value();
      }
    }
  }

  csvExport() {
    this.isSpinning = true;
    this.mdApiService.getOrderInfoCsv(this.formInfo).subscribe((result: any) => {
      var blob = new Blob([result.body]);
      this.isSpinning = false;
      FileSaver.saveAs(blob, `Md_keppin_${moment().format('YYYYMMDDHHmmss')}.csv`);
    });
  }

  goBack() {
    window.history.back();
  }
}
