import request from '@/utils/http/axios'
import { get, post } from '@utils/http/axios'


export const getFontsByName = async (data) => post({ url: 'font/getFontsByName', data})
export const getFontBase64 = async (data) => post({ url: 'font/getFontBase64', data})
export const downloadFile = async (data) => post({ url: 'font/downloadFile', data})
export const getCodeInfo = async (data) => post({ url: 'font/getCodeInfo', data})
export const getFontList = async (data) => post({ url: 'font/getFontList', data})
export const downloadFont = async (data) => post({ url: 'font/downloadFont',data })