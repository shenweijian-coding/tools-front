import request from '@/utils/http/axios'
import { get, post } from '@utils/http/axios'

export const getHomeInfo = async () => get<any>({ url: 'home' });

export const getNoticeInfo = async () => get<any>({ url: 'home/notice' })

export const getGoodList = async () => get<any>({ url: 'home/getGoodList' })

export const createInvoice = async (data: Object) => post<any>({ url: 'pay/createInvoice', data })
