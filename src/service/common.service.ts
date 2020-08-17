export class CommonService {

    /**
     * convert date type to string base on format
     * @param date date
     * @param format format ex: yyyyMMdd or yyyyMMdd HHmmmSS ..etc
     */
    convertDateToStringByFormat(date: Date, format: string): string {
        let result: string = '';
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        result = format.replace('yyyy', year.toString())
            .replace('MM', this.fixedFormatTwoDigit(month))
            .replace('dd', this.fixedFormatTwoDigit(day))
            .replace('HH', this.fixedFormatTwoDigit(hour))
            .replace('mmm', this.fixedFormatTwoDigit(minute))
            .replace('SS', this.fixedFormatTwoDigit(second));
        return result;
    }

    /**
     * return the number with two fixed digits
     * @param number source number
     */
    fixedFormatTwoDigit(number: number): string {
        let result: string = '';
        result = number < 10 ? ('0' + number.toString()) : number.toString();
        return result;
    }
}