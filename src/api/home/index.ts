import request from '@/utils/http/axios'
import { get, post } from '@utils/http/axios'

export const getHomeInfo = async () => get<any>({ url: 'home' });

export const getWebConfig = async () => get<any>({ url: 'home/config' })

export const getGoodList = async () => get<any>({ url: 'home/getGoodList' })

export const getWebList = async () => get<any>({ url: 'home/getWebList' })

export const createInvoice = async (data: Object) => post<any>({ url: 'pay/createInvoice', data })

export const checkInvoice = async (data: Object) => post<any>({ url: 'pay/checkInvoice', data })
