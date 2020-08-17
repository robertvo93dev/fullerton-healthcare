export class JwtResponse {
    constructor(obj?:any) {
        this._id = (obj != null && obj._id != null) ? obj._id : null;
        this.name = (obj != null && obj.name != null) ? obj.name : '';
        this.email = (obj != null && obj.email != null) ? obj.email : '';
        this.access_token = (obj != null && obj.access_token != null) ? obj.access_token : '';
    }
    _id: any;
    name: string;
    email: string;
    access_token: string;
}