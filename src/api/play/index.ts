import request from '@/utils/http/axios'
import { get, post } from '@utils/http/axios'

interface url {
  url: string
}
interface params {
  sid: string,
  vid: string
}
interface shorts {
  link: string,
  timestamp: number
}
export const getPlayUrl = async (data: url) => post<any>({ url: 'play/1', data })

// 虎课
export const getHuKeUrl = async (data: url) => post<any>({ url: 'play/3', data })

export const getClassList = async () => get<any>({url: 'play/list'})

export const getDownFile = async (data: params) => post<any>({ url: 'play/2', data })

export const getHukeFile = async (data: params) => post<any>({ url: 'play/4', data })

export const getShortsUrl = async(data: shorts) => post<any>({ url: 'wxapp/analyze', data })
