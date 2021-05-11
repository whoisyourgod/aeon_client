import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'yearMonth'})
export class YearMonthPipe implements PipeTransform {
    transform(value: string): string {
        //202110 => 2021/10
        if(value) {
            const year = value.substring(0,4)
            const month = value.substring(4)
            return `${year}/${month}`
        }
        return value;
    }
}