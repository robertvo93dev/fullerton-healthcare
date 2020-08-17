export class User {
    constructor(obj?: any){
        this._id        = (obj && obj._id)?         obj._id : null;
        this.email      = (obj && obj.email)?       obj.email : '';
        this.password   = (obj && obj.password)?    obj.password : '';
        this.firstName  = (obj && obj.firstName)?   obj.firstName : '';
        this.lastName   = (obj && obj.lastName)?    obj.lastName : '';
        this.role       = (obj && obj.role)?        obj.role : '';
        this.token      = (obj && obj.token)?       obj.token : '';
        this.isAdmin    = false;
        this.isHr       = false;
    }
    _id: any;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: any;
    token: string;
    isAdmin: boolean;
    isHr: boolean;
}