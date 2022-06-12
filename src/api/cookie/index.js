import request from '@/utils/http/axios'
import { get, post } from '@utils/http/axios'

export const getCookies = async () => get({ url: 'cookie' });

export const saveCookies = async (data) => post({ url: 'cookie/save', data})