import { defineStore } from 'pinia'
import piniaStore from '@/store/index'
import { AppState } from './types';

export const useAppStore = defineStore(
    // 唯一ID
    'app',
    {
        state: () => ({
            webList: []
        }),
        getters: {},
        actions: {
        },
    }
)

export function useAppOutsideStore() {
    return useAppStore(piniaStore)
}