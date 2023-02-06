import { defineStore } from 'pinia'
import piniaStore from '@/store/index'
import { AppState } from './types';
import { getWebConfig } from '@/api/home';

export const useAppStore = defineStore(
    // 唯一ID
    'app',
    {
        state: () => ({
            webConfig: {
                notice: '',
                footer: '',
                banner: []
            }
        }),
        getters: {},
        actions: {
            getWebConfig() {
                 getWebConfig().then(res => {
                    this.$patch({ webConfig: res.data })
                })
            }
        }
    }
)

export function useAppOutsideStore() {
    return useAppStore(piniaStore)
}