import { User } from "./user";
export class EventType {
    constructor(obj?:any){
        this._id = obj ? obj._id : null;
        this.name = obj ? obj.name : null;

        this.createdBy =  obj ? obj.createdBy : new User();
        this.createdDate =  obj ? obj.createdDate: new Date();
        this.updatedBy =  obj ? obj.updatedBy : new User();
        this.updatedDate =  obj ? obj.updatedDate : new Date();
    }
    _id:any;
    name: string;

    createdBy: User;
    createdDate: Date;
    updatedBy: User;
    updatedDate: Date;
}