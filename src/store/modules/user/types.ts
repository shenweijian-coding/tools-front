export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
    _id: string;
    down_log: Array<object>;
    ip: string;
    create_time: any;
    is_fans: Boolean,
    email: string;
    isAdmin?: Boolean;
    num: Number;
    isSign: Boolean;
    isLoginAgain: Boolean;
    adNum: Number;
    eNum: Number;
    expireDate: any,
    address: String
}
