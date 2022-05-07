import request from '@/utils/http/axios'
import { get, post } from '@utils/http/axios'

export const getHomeInfo = async () => get<any>({ url: 'api/home' });

// export function getHomeInfo() {
//   return request({
//     url: '/home',
//     method: 'GET'
//   })
// }