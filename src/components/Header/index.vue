<script setup lang="ts">
import { ref } from 'vue'
import { useDark, useToggle } from '@vueuse/core';
import { useAppStore, useUserStore } from '@/store';
import { useRoute } from 'vue-router';
import sDialog from '../s-dialog/index.vue'
import QR from '../dialog/index.vue'
import { Message } from '@arco-design/web-vue';
import Wxapp from '@/components/wxapp/index.vue'
import SvgIcon from "@components/SvgIcon/index.vue"
import wxappLogin from '../wxapp-login/index.vue'
import { pwd2Wxapp } from '@api/user/index'
const appStore = useAppStore()
const userStore = useUserStore()
const theme = computed(() => {
  return appStore.theme
})
const loading = ref(false)
const isDark = useDark({
  selector: 'body',
  attribute: 'arco-theme',
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: 'arco-theme',
  onChanged(dark) {
    appStore.toggleTheme(dark);
  },
})
const curPath = ref((toRaw(useRoute()).path))
const paths = reactive({
  list: [
    {
      name: '素材教程搜索',
      path: '/sucai',
      id: 1,
      text: ''
    },
    {
      name: '热门短视频',
      path: '/shorts',
      id: 2,
      text: '免费'
    }, {
      name: '积分充值',
      path: '/shop',
      id: 3,
      text: ''
    }, {
      name: '更多功能登录后查看',
      path: '',
      id: 4,
      text: ''
    }]
})
const visible = ref(false);
const stepsVisible = ref(false)
const loginCode = ref('');
const accode = ref('');
const pwd2WxappVisible = ref(false) // 卡密转移小程序权限
// const undoneTaskVisible = ref(false);
const openLogin = () => {
  visible.value = true;
}
if (localStorage.getItem('accode')) {
  accode.value = localStorage.getItem('accode') || ''
}
// 获取用户积分数量
const getUserNum = async () => {
  await userStore.getUserNum()
  console.log(userStore.isLoginAgain, 'isLoginAgain');
  setTimeout(() => {
    if (userStore.isLoginAgain) {
      alert('当前登录IP与上一次登录IP不一致，请重新登录！')
      userStore.logout()
    }
  }, 200);
}
if (!userStore.userIsLogin) {
  getUserNum()
  // paths.list.splice(2, 0, {
  //   name: '积分充值',
  //   path: '/shop',
  //   id: 3,
  //   text: ''
  // })
  paths.list.splice(3, 1, {
    name: '视频使用教程',
    path: '/help',
    id: 4,
    text: ''
  })
} else {
  visible.value = true;
}
const login = async (type) => {
  loading.value = true
  if (type === 1 && !loginCode.value) {
    Message.warning('请输入验证码！')
    return
  }
  if (type === 2 && !accode.value) {
    Message.warning('请输入卡密！')
    return
  }
  const params = {
    code: loginCode.value,
    acCode: accode.value,
    type: type
  }
  const inviteCode = localStorage.getItem('code')
  if (inviteCode) {
    params.inviteCode = inviteCode
    localStorage.removeItem('code')
  }
  const res = await userStore.login(params)
  Message.success('登录成功')
  localStorage.setItem('accode', accode.value)
  visible.value = false;
  loading.value = false
  // window.location.reload()
}
// 用户没有签到和观看广告
// setTimeout(() => {
//   if (!userStore.userIsLogin && (!userStore.adNum || !userStore.isSign)) {
//     undoneTaskVisible.value = true
//   }
// }, 6000);

const close = () => {
  loginCode.value = ''
}
// const task = () => {
//   if (!userStore.adNum || !userStore.isSign) {
//     undoneTaskVisible.value = false
//     stepsVisible.value = true
//   }
// }
const bindWxApp = () => {
  if (userStore.userIsLogin) {
    Message.warning('请先登录')
    return
  }
  stepsVisible.value = true
}
const logout = () => {
  userStore.logout()
  Message.success('退出成功')
}

// 卡密关联小程序
const bindPwd2Wxapp = () => {
  pwd2WxappVisible.value = true
}
// 卡密权限登录查询
const pwd2WxappConfirm = async (pwd) => {
  if (!pwd) {
    Message.warning('请输入卡密')
    return
  }
  const res = await pwd2Wxapp({ code: pwd })
  if (res.data) {
    Message.success(res.data)
    location.reload()
  }
}
</script>

<template>
  <header class="antialiased bg-white Male text-slate-500 dark:text-slate-400 dark:bg-slate-900">
    <div
      class="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent">
      <div class="mx-auto max-w-8xl">
        <div class="px-4 py-4 border-b border-slate-900/10 lg:px-8 lg:border-0 dark:border-slate-300/10">
          <div class="relative flex items-center justify-between text-2xl sm:text-2xl font-blimone">
            <!-- <router-link
              to="/"
              class="mr-3 flex-none w-[2.0625rem] md:w-auto leading-6 dark:text-slate-200"
            > -->
            <a href="/"><img class="h-8" src="@/assets/images/logo.png" alt="logo" /></a>
            <!-- </router-link> -->
            <div class="relative flex items-center justify-between lg:w-full">
              <nav class="hidden text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200 lg:flex">
                <ul class="flex space-x-14">
                  <template v-for="it in paths.list" :key="it.id">
                    <li class="ml-14"
                      :class="curPath === it.path ? 'border-b-4 rounded-sm border-blue-400 text-blue-500' : ''">
                      <a-badge v-if="it.text" :text="it.text"
                        :dotStyle="{ height: '16px', fontSize: '12px', lineHeight: '16px' }" :offset="[12, -4]">
                        <router-link :to="it.path" class="hover:text-blue-500 dark:hover:text-blue-400">{{ it.name }}
                        </router-link>
                      </a-badge>
                      <router-link v-else :to="it.path" class="hover:text-blue-500 dark:hover:text-blue-400">{{
                          it.name
                      }}
                      </router-link>
                    </li>
                  </template>
                </ul>
              </nav>
              <nav class="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">
                <ul class="flex space-x-10">
                  <li class="flex items-center">
                    <span class="flex items-center mr-2 cursor-pointer hover:bg-gray-50" @click="bindWxApp">
                      <SvgIcon name="svg-jifen" style="width: 20px;" class="mr-1" />
                      <span style="color:#caa36e">免费得积分</span>
                    </span>
                    <a-divider direction="vertical"></a-divider>
                    <span v-if="userStore.userIsLogin" @click="openLogin"
                      class="cursor-pointer hover:text-blue-500 dark:hover:text-blue-400">
                      登录</span>
                    <span v-else class="flex items-center">

                      <a-dropdown trigger="hover">
                        <span class="cursor-pointer hover:text-blue-500">用户中心</span>
                        <template #content>
                          <a-doption>
                            <router-link to="/user">个人中心</router-link>
                          </a-doption>
                          <a-doption>
                            <router-link to="/shop">积分购买</router-link>
                          </a-doption>
                          <a-doption @click="bindPwd2Wxapp">
                            关联卡密
                          </a-doption>
                          <a-doption @click="logout">退出账号</a-doption>
                        </template>
                      </a-dropdown>
                    </span>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  <s-dialog v-model:visible="visible" width="300px" @close="close" title="微信扫码登录">
    <div>
      <!-- <a-tabs default-active-key="2"> -->
      <wxappLogin @login="visible = false"></wxappLogin>
      <!-- <a-tab-pane key="1" title="微信登录"> -->
      <!-- <a-input-search placeholder="请输入5位验证码" button-text="验证码登录" v-model="loginCode" search-button @search="login(1)">
          </a-input-search>
          <QR tip="验证码" v-if="visible" style="margin-top: 12px" /> -->
      <!-- </a-tab-pane>
        <a-tab-pane key="2" title="卡密登录">
          <a-input-search placeholder="卡密yyy-xxx-jjj" button-text="卡密登录" v-model="accode" search-button @search="login(2)">
          </a-input-search>
        </a-tab-pane> -->
      <!-- </a-tabs> -->
    </div>
  </s-dialog>
  <s-dialog v-model:visible="stepsVisible" title="免费获取积分" width="400px">
    <Wxapp></Wxapp>
  </s-dialog>
  <s-dialog v-model:visible="pwd2WxappVisible" title="账号权限转移" width="400px">
    <span>为统一登录方式，之前卡密登录的用户，将卡密输入下方提交，卡密账号权限即可转移至当前账号，之后直接使用微信扫码即可自动登录</span>
    <a-divider></a-divider>
    <a-input-search placeholder="卡密yyy-xxx-jjj" button-text="提交" v-model="accode" search-button
      @search="pwd2WxappConfirm">
    </a-input-search>
  </s-dialog>
</template>

<style lang="less">
.prose {
  color: #334155;
  font-size: 0.875em;
  font-variant-ligatures: none;

  code {
    color: #0f172a;
    font-family: Fira Code VF, ui-monospace, SFMono-Regular, Menlo, Monaco,
      Consolas, Liberation Mono, Courier New, monospace;

    &::before {
      content: "`";
    }

    &::after {
      content: "`";
    }
  }

  &.dark\:prose-dark {
    color: #94a3b8;

    code {
      color: #e2e8f0;
    }
  }
}
</style>
