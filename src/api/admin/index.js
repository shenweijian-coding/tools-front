import { get, post } from '@utils/http/axios'

export const getCookies = async () => get({ url: 'admin/getCookies' });

export const saveCookies = async (data) => post({ url: 'admin/saveCookies', data })
export const saveMoreCookieApi = async (data) => post({ url: 'admin/saveMoreCookie', data })

export const getUserById = async (data) => post({ url: 'admin/getUserById', data })

export const updateUserInfo = async (data) => post({ url: 'admin/updateUserInfo', data })

export const getCodeByType = async (data) => post({ url: 'admin/getCodeByType', data })

export const deleteCodeApi = async (data) => post({ url: 'admin/deleteCode', data })

export const createAccodeApi = async (data) => post({ url: 'admin/createAccode', data})

export const saveWebConfig = async (data) => post({ url: 'admin/saveWebConfig', data})
export const getWebConfig = async () => get({ url: 'admin/getWebConfig'})

export const getProduct = async () => get({ url: 'admin/getProduct'})
export const createProductApi = async (data) => post({ url: 'admin/createProduct', data})
export const delProduct = async (data) => post({ url: 'admin/delProduct', data})
export const addWeb = async (data) => post({ url: 'admin/addWeb', data})
export const delWeb = async (data) => post({ url: 'admin/delWeb', data })
export const getCacheByWeb = async (data) => post({ url: 'admin/getCacheByWeb', data })
export const deleteCacheApi = async(data) => post({url: 'admin/deleteCacheByName', data})
export const updateCache = async(data) => post({url: 'admin/updateCache', data})
// 获取第三方权限
export const getOtherCookieApi = async (data) => post({ url: 'admin/getOtherAuth', data })

export const getWebDownLog = async (data) => post({ url: 'admin/getWebDownLog', data })
export const getAddressByIp = async (data) => get({ url: 'admin/getAddressByIp?ip=' + data })

export const addBlackIpApi = async(data) => post({ url: 'admin/addBlackIp', data })
export const getQtWaitList = async(data) => post({ url: 'admin/getQtWaitList', data })
export const delQtWait = async(data) => post({ url: 'admin/delQtWait', data })
export const signQtWait = async(data) => post({ url: 'admin/signQtWait', data })

export const sucaiIsCache = async(data) => post({ url: 'sucai/sucaiIsCache', data})