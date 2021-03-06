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

const getUserProfile = async () => get<any>({ url: 'user/info' });
const login = async (data: LoginData) => post<any>({ url: 'user/login', data });

const logout = async () => post<LoginRes>({ url: 'user/logout' });

const getUserNum = async () => get<any>({ url: 'user/getUserNum' });

const getBindWxapp = async () => get<any>({ url: 'user/getBindWxapp' });

export { getUserProfile, login, logout, getUserNum, getBindWxapp };