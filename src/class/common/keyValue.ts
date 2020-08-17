export class KeyValue{
    constructor(obj?: KeyValue){
        this.key = obj ? obj.key : null;
        this.value = obj ? obj.value : null;
    }
    key: any;
    value: any;
}