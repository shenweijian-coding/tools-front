<script setup lang="ts">
import { ref } from 'vue'
import { useDark, useToggle } from '@vueuse/core';
import { useAppStore, useUserStore } from '@/store';
import { useRoute } from 'vue-router';
import sDialog from '../s-dialog/index.vue'
// import QR from '../dialog/index.vue'
import { Message } from '@arco-design/web-vue';
import Wxapp from '@/components/wxapp/index.vue'
import SvgIcon from "@components/SvgIcon/index.vue"
import wxappLogin from '../wxapp-login/index.vue'
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
      name: '素材搜索',
      path: '/sucai',
      id: 1,
      text: ''
    },{
      name: '邀请送分',
      path: '/invite',
      id: 2,
      text: '热'
    },{
      name: '在线充值',
      path: '/shop',
      id: 3,
      text: ''
    }, {
      name: '视频教程',
      path: '/help',
      id: 4,
      text: ''
  }]
})
const loginVisible = ref(false);
const stepsVisible = ref(false)

const loginInfo = reactive({
  loginType: 1, // 1 卡密登录 0 二维码登录
  cdkey: ''
})

const openLogin = () => {
  loginVisible.value = true;
}
if (localStorage.getItem('cdkey')) {
  loginInfo.cdkey = localStorage.getItem('cdkey') || ''
}
// 获取用户积分数量
const getUserNum = async () => {
  await userStore.getUserNum()
  setTimeout(() => {
    if (userStore.isLoginAgain) {
      alert('当前登录IP与上一次登录IP不一致，请重新登录！')
      userStore.logout()
    }
  }, 200);
}
if (!userStore.userIsLogin) {
  getUserNum()
}

const login = async () => {
  if (!loginInfo.cdkey) {
    Message.warning('请输入卡密！')
    return
  }
  const params = {
    cdkey: loginInfo.cdkey,
    type: loginInfo.loginType
  }

  loading.value = true
  await userStore.login(params)
  localStorage.setItem('cdkey', loginInfo.cdkey)
  loginVisible.value = false;
  loading.value = false
  Message.success('登录成功')
}

const close = () => {
  loginInfo.cdkey = ''
  loginInfo.loginType = 1
}

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
                            <router-link to="/shop">在线充值</router-link>
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
  <s-dialog v-model:visible="loginVisible" width="400px" @close="close" :closeOnClickOverlay="true">
    <a-button class="margin-auto flex" type="text" @click="loginInfo.loginType = Number(!loginInfo.loginType)">切换 {{ loginInfo.loginType === 1 ? '微信扫码' : '卡密' }} 登录</a-button>
    <div v-if="loginInfo.loginType == 0" class="mt-m">
      <wxappLogin @login="loginVisible = false"></wxappLogin>
    </div>
    <a-input-search class="mt-m" v-else placeholder="卡密 AAA-BBB-CCC-DDD" button-text="卡密登录" v-model="loginInfo.cdkey" search-button @search="login"></a-input-search>
  </s-dialog>

  <s-dialog v-model:visible="stepsVisible" title="免费获取积分" width="400px">
    <Wxapp></Wxapp>
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
