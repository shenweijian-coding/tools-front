export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
    _id: string;
    auth: Object;
    create_time: any;
    isAdmin?: Boolean;
    num: Number;
    isSign: Boolean;
    adNum: Number;
    selSiteNum: Number;
    address:String
}
