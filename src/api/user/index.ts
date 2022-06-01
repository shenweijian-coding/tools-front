// 权限问题后期增加
import { get, post } from '@utils/http/axios'
import { IResponse } from '@utils/http/axios/type'
import { ReqAuth, ReqParams, ResResult } from './types';
import { UserState } from '@/store/modules/user/types';
// import axios from 'axios';
interface LoginRes {
    token: string
}

export interface LoginData {
    code: string,
    ip: string
}

const getUserProfile = async () => get<any>({ url: 'api/user/info' });
const login = async (data: LoginData) => post<any>({ url: 'api/user/login', data });

const logout = async () => post<LoginRes>({ url: 'api/user/logout' });

export { getUserProfile, login, logout };