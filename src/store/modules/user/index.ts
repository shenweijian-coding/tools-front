import { defineStore } from 'pinia';
import {
    login as userLogin,
    logout as userLogout,
    getUserProfile,
    LoginData,
    getUserNum,
    mailLogin as mailLoginApi
} from '@/api/user/index';
import { setToken, clearToken } from '@/utils/auth';
import { UserState } from './types'

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        _id: '',
        create_time: undefined,
        num: 0,
        isSign: false,
        adNum: 0,
        auth: [],
        selSiteNum: 0,
        address: ''
    }),
    getters: {
        userProfile(state: UserState): UserState {
            return { ...state };
        },
        userIsLogin(state: UserState): boolean {
            return !state._id
        },
        userAddress(state) {
            return state.address
        },
        userNum(state: UserState): Number {
            return state.num
        }
    },
    actions: {
        // switchRoles() {
        //     return new Promise((resolve) => {
        //         this.role = this.role === 'user' ? 'user' : 'admin';
        //         resolve(this.role);
        //     })
        // },
        // 设置用户的信息
        setInfo(partial: Partial<UserState>) {
            this.$patch(partial);
        },
        // 重置用户信息
        resetInfo() {
            this.$reset();
        },
        // 获取用户信息
        async info() {
            const { data } = await getUserProfile();
            return data
            // this.setInfo(data);
        },
        async getUserNum() {
            const { data } = await getUserNum();
            if (!data) {
                this.logout()
            }
            this.setInfo(data)
        },
        // 扫码登录
        async newLogin(data: Partial<UserState>) {
            this.setInfo(data);
            setToken(data?._id)
            return data;
        },
        // 异步登录并存储token
        async login(loginForm: LoginData) {
            const { data } = await userLogin(loginForm);
            this.setInfo(data);
            setToken(data?._id)
            this.getUserNum()
            return data;
        },
        async mailLogin(loginForm) {
            const { data } = await mailLoginApi(loginForm);
            this.setInfo(data);
            setToken(data?._id)
            return data;
        },
        // Logout
        async logout() {
            // await userLogout();
            this.resetInfo();
            clearToken();
            // 路由表重置
            // location.reload();
        }
    }
})