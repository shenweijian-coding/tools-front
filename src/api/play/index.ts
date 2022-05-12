import request from '@/utils/http/axios'
import { get, post } from '@utils/http/axios'

interface url {
  url?: string
  sid?: string
  vid?: string
}
interface params {
  sid: string,
  vid: string
}
export const getPlayUrl = async (data: url) => post<any>({ url: 'api/play/1', data })

export const getDownFile = async (data: params) => post<any>({ url: 'api/play/2', data })
