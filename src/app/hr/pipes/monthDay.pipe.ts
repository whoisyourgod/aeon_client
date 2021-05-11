import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "monthDay" })
export class MonthDayPipe implements PipeTransform {
  transform(value: string): string {
    //2021/10/21 => 10/21(日)
    if (value) {
      const month = value.split("/")[1];
      const day = value.split("/")[2];
      let date = this.getDate(value);
      const week = this.getweekday(date);
      return `${month}/${day}(${week})`;
    }
    return value;
  }

  getDate(strDate: string) {
    strDate = strDate.replace(/-/g,"/");
    var date = new Date(strDate);    
    return date;
  }

  getweekday(date: Date) {
    var weekArray = new Array("日", "月", "火", "水", "木", "金", "土");
    var week = weekArray[new Date(date).getDay()];
    return week;
  }
}
