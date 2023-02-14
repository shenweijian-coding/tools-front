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
                banner: [],
                bgImg: '',
                carmiAddress: ''
            }
        }),
        getters: {},
        actions: {
            getWebConfig() {
                 getWebConfig().then(res => {
                     this.$patch({ webConfig: res.data })
                     this.setBgImg()
                })
            },
            setBgImg() {
                if (this.$state.webConfig?.bgImg) {
                    document.body.style.backgroundImage = "url(" + this.$state.webConfig?.bgImg + ")"
                }else {
                    document.body.style.backgroundColor = '#000'
                }
            }
        }
    }
)

export function useAppOutsideStore() {
    return useAppStore(piniaStore)
}