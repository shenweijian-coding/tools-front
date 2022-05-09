import request from '@/utils/http/axios'
import { get, post } from '@utils/http/axios'

interface url {
  url: string
}

export const getPlayUrl = async (data: url) => post<any>({ url: 'api/play/1', data })