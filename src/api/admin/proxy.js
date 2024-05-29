import { get, post } from '@utils/http/axios'

export const getProduct = async (data) => post({ url: 'proxy/getPackageList', data });

export const createCode = async (data) => post({ url: 'proxy/createCode', data })

export const getBalance = async (data) => get({ url: 'proxy/getBalance' })

// 获取卡密列表
export const getCodeList = async(data) => post({ url: 'proxy/getCodeList', data })