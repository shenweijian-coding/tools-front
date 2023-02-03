import request from '@/utils/http/axios'
import { get, post } from '@utils/http/axios'

export const getCookies = async () => get({ url: 'admin/getCookies' });

export const saveCookies = async (data) => post({ url: 'admin/saveCookies', data})