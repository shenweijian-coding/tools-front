import request from '@/utils/http/axios'
import { get, post } from '@utils/http/axios'

interface url {
  url: string
  option?: object
}

export const getPngUrl = async (data: url) => post<any>({ url: 'api/sucai', data })

export const getInfo = async () => get<any>({ url: 'api/sucai/info' })