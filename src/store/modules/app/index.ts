import { defineStore } from 'pinia'
import piniaStore from '@/store/index'
import { AppState } from './types';
import { getWebConfig, getWebList } from '@/api/home';

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
                logo: '',
                carmiAddress: ''
            },
            webMap: null
        }),
        getters: {},
        actions: {
            getWebConfig() {
                 getWebConfig().then(res => {
                     const _v = localStorage.getItem('_v')
                     if(res.data.version != _v) {
                        localStorage.setItem('_v', res.data.version)
                        window.location.reload()
                     }
                     this.$patch({ webConfig: res.data })
                     this.setBgImg()
                })
                // if(!this.$state.webMap) {
                //     this.getWebList()
                // }
            },
            async getWebList() {
                getWebList().then(res => {
                    const webMap = {}
                    res.data.forEach(it => {
                        webMap[it.id] = it.name
                    });
                    this.$patch({ webMap: webMap })
                })
            },
            setBgImg() {
                if (this.$state.webConfig?.bgImg) {
                    document.getElementsByClassName('app-header-box')[0].style.backgroundImage = "url(" + this.$state.webConfig?.bgImg + ")"
                    document.getElementsByClassName('app-header-box')[0].style.backgroundRepeat = "no-repeat"
                    document.getElementsByClassName('app-header-box')[0].style.backgroundSize = "cover"

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