import { User } from "./user";
export class Booking {
    constructor(obj?:any){
        this._id = obj ? obj._id : null;
        this.status = obj ? obj.status : null;
        this.eventType = obj ? obj.eventType : null;
        this.location = obj ? obj.location : null;
        this.proposedDateTime1 = obj ? obj.proposedDateTime1 : null;
        this.proposedDateTime2 = obj ? obj.proposedDateTime2 : null;
        this.proposedDateTime3 = obj ? obj.proposedDateTime3 : null;
        this.choosenDateTime = obj ? obj.choosenDateTime : null;
        this.reasonForRejection = obj ? obj.reasonForRejection : null;

        this.createdBy =  obj ? obj.createdBy : new User();
        this.createdDate =  obj ? obj.createdDate: new Date();
        this.updatedBy =  obj ? obj.updatedBy : new User();
        this.updatedDate =  obj ? obj.updatedDate : new Date();
    }
    _id:any;
    status: any;
    eventType: any;
    location: string;
    proposedDateTime1: Date;
    proposedDateTime2: Date;
    proposedDateTime3: Date;
    choosenDateTime: Date;
    reasonForRejection: string;

    createdBy: User;
    createdDate: Date;
    updatedBy: User;
    updatedDate: Date;
}