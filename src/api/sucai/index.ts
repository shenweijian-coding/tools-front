import request from '@/utils/http/axios'
import { get, post } from '@utils/http/axios'

interface url {
  url: string
  option?: object
}

interface code{
  code: string
}
export const getPngUrl = async (data: url) => post<any>({ url: 'sucai', data })

export const getInfo = async () => get<any>({ url: 'sucai/info' })

export const checkInfo = async (data:code) => post<any>({ url: 'user/check', data})