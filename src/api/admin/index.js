import request from '@/utils/http/axios'
import { get, post } from '@utils/http/axios'

export const getCookies = async () => get({ url: 'admin/getCookies' });

export const saveCookies = async (data) => post({ url: 'admin/saveCookies', data })

export const getUserById = async (data) => post({ url: 'admin/getUserById', data })

export const updateUserInfo = async (data) => post({ url: 'admin/updateUserInfo', data })

export const getCodeByType = async (data) => post({ url: 'admin/getCodeByType', data })

export const createAccodeApi = async (data) => post({ url: 'admin/createAccode', data})

export const saveWebConfig = async (data) => post({ url: 'admin/saveWebConfig', data})
export const getWebConfig = async () => get({ url: 'admin/getWebConfig'})

export const getProduct = async () => get({ url: 'admin/getProduct'})
export const createProductApi = async (data) => post({ url: 'admin/createProduct', data})
export const delProduct = async (data) => post({ url: 'admin/delProduct', data})
export const addWeb = async (data) => post({ url: 'admin/addWeb', data})