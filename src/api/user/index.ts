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
const mailLogin = async (data) => post<any>({ url: 'user/mailLogin', data });

const logout = async () => post<LoginRes>({ url: 'user/logout' });

const getUserNum = async () => get<any>({ url: 'user/getUserNum' });

const getBindWxapp = async () => get<any>({ url: 'user/getBindWxapp' });

const getUserPayInfo = async () => get<any>({ url: 'user/getUserPayInfo' });

const codeConvert = async (data) => post<any>({ url: 'user/codeConvert', data });

//权限转移
export const pwd2Wxapp = async (data) => post<any>({ url: 'user/pwd2Wxapp', data });

export const getInviteInfo = async () => get<any>({ url: 'user/getInviteInfo' })

export const createInviteCode = async () => get<any>({ url: 'user/createInviteCode' })

export const getDownLog = async (data) => post<any>({ url: 'user/getUserDownLog', data })

export const getLoginStatus = async (data) => get<any>({url: 'wxappv1/wxApploginStatus?loginCode=' + data})

export const handleBindEmail = async (data) => post<any>({ url: 'user/bindEmail', data })

export const getAddress = async () => get<any>({ url: 'user/getAddress' })

export { getUserProfile, login, logout, getUserNum, getBindWxapp, getUserPayInfo, codeConvert, mailLogin };