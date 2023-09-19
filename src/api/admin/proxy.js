import { get, post } from '@utils/http/axios'

export const getProduct = async (data) => post({ url: 'proxy/getPackageList', data });

export const createCode = async (data) => post({ url: 'proxy/createCode', data })