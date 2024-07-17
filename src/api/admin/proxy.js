import { get, post } from '@utils/http/axios'

export const getProduct = async (data) => post({ url: 'proxy/getPackageList', data });

export const createCode = async (data) => post({ url: 'proxy/createCode', data })

export const getBalance = async (data) => get({ url: 'proxy/getBalance' })

// 获取卡密列表
export const getCodeList = async(data) => post({ url: 'proxy/getCodeList', data })
export const saveBanner = async(data) => post({ url: 'proxy/saveConfig', data })
export const updateUserBlack = async(data) => post({ url: 'proxy/updateUserBlack', data })
export const getUserInfoByProxy = async(data) => post({ url: 'proxy/getUserInfoByProxy', data })
export const getUserDownByProxy = async(data) => post({ url: 'proxy/getUserDownByProxy', data })
export const replaceCodeToNew = async(data) => post({ url: 'proxy/replaceCodeToNew', data })