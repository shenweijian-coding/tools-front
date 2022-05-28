import { defineStore } from 'pinia';
import {
    login as userLogin,
    logout as userLogout,
    getUserProfile,
    LoginData
} from '@/api/user/index';
import { setToken, clearToken } from '@/utils/auth';
import { UserState } from './types'

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        _id: '',
        ip: '',
        down_log: [],
        create_time: undefined,
        is_fans: false,
        email: ''
    }),
    getters: {
        userProfile(state: UserState): UserState {
            return { ...state };
        },
        userIsLogin(state: UserState): boolean {
            return !state._id
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
            const result = await getUserProfile();
            this.setInfo(result);
        },
        // 异步登录并存储token
        async login(loginForm: LoginData) {
            const {data} = await userLogin(loginForm);
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