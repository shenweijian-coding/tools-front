import request from '@/utils/http/axios'
import { get, post } from '@utils/http/axios'

interface url {
  url?: string
  sid?: string
  vid?: string
}

export const getPlayUrl = async (isDown: Boolean,data: url) => post<any>({ url: 'api/play/1?isDown' + isDown, data })