<script setup lang="ts">
import { ref } from 'vue'
import { useDark, useToggle } from '@vueuse/core';
import { useAppStore, useUserStore } from '@/store';
import { useRoute } from 'vue-router';
import { Modal } from '@arco-design/web-vue';
import sDialog from '../s-dialog/index.vue'
import QR from '../dialog/index.vue'
import { Message } from '@arco-design/web-vue';
import Wxapp from '@/components/wxapp/index.vue'

const appStore = useAppStore()
const userStore = useUserStore()
const theme = computed(() => {
  return appStore.theme
})

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
  list: [{
    name: '素材搜索',
    path: '/sucai',
    id: 1,
    text: ''
  }, {
    name: '虎课网',
    path: '/huke',
    id: 2,
    text: ''
  }, {
    name: '视达网',
    path: '/shida',
    id: 3,
    text: '免费'
  }, {
    name: '短视频搜索',
    path: '/shorts',
    id: 4,
    text: '免费'
  }, {
    name: '站内商店',
    path: '/shop',
    id: 5,
    text: ''
  }]
})
const visible = ref(false);
const stepsVisible = ref(false)
const loginCode = ref('');
const undoneTaskVisible = ref(false);
const openLogin = () => {
  visible.value = true;
}

// 获取用户积分数量
const getUserNum = () => {
  userStore.getUserNum()
}
getUserNum()
const login = async () => {
  if (!loginCode.value) {
    Message.warning('请输入验证码！')
    return
  }
  const res = await userStore.login({ code: loginCode.value })
  Message.success('登录成功')
  window.location.reload()
}
// 用户没有签到和观看广告
if (!userStore.userIsLogin && (!userStore.adNum || !userStore.isSign)) {
  undoneTaskVisible.value = true
}

const close = () => {
  loginCode.value = ''
}
const task = () => {
  if (!userStore.adNum || !userStore.isSign) {
    undoneTaskVisible.value = false
    stepsVisible.value = true
  }
}
const bindWxApp = () => {
  stepsVisible.value = true
}
</script>

<template>
  <header class="antialiased bg-white Male text-slate-500 dark:text-slate-400 dark:bg-slate-900">
    <div
      class="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent">
      <div class="mx-auto max-w-8xl">
        <div class="px-4 py-4 border-b border-slate-900/10 lg:px-8 lg:border-0 dark:border-slate-300/10">
          <div class="relative flex items-center text-2xl sm:text-2xl font-blimone">
            <!-- <router-link
              to="/"
              class="mr-3 flex-none w-[2.0625rem] md:w-auto leading-6 dark:text-slate-200"
            > -->
            <a href="/"><img class="h-8" src="@/assets/images/logo.png" alt="logo" /></a>
            <!-- </router-link> -->
            <div class="relative flex items-center justify-between hidden w-full lg:flex">
              <nav class="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">
                <ul class="flex space-x-14">
                  <template v-for="it in paths.list" :key="it.id">
                    <li class="ml-16"
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
                <ul class="flex space-x-8">
                  <li>
                    <span v-if="userStore.userIsLogin" @click="openLogin"
                      class="cursor-pointer hover:text-blue-500 dark:hover:text-blue-400">
                      登录</span>
                    <span v-else>
                      <span>剩余积分：{{ userStore.userNum }}</span>&nbsp;
                      <a-button type="outline" size="mini" shape="round" status="success" @click="bindWxApp">免费获取
                      </a-button>
                      <a-divider direction="vertical"></a-divider>&nbsp;&nbsp;
                      <router-link to="/user" class="cursor-pointer hover:text-blue-500">用户中心</router-link>
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
  <s-dialog v-model:visible="visible" width="300px" @close="close">
    <div>
      <a-input-search placeholder="请输入5位验证码" button-text="登录" v-model="loginCode" search-button @search="login">
      </a-input-search>
      <QR tip="验证码" v-if="visible" style="margin-top: 12px" />
    </div>
  </s-dialog>
  <s-dialog v-model:visible="stepsVisible" @close="close" title="教你如何免费获取积分，下载全站素材" width="460px">
    <Wxapp></Wxapp>
  </s-dialog>
  <s-dialog v-model:visible="undoneTaskVisible" @close="close" title="提示:您今日还未领取免费积分" width="380px">
    <span>1. 小程序每日签到领取积分</span>&nbsp;&nbsp;&nbsp;&nbsp;<a-tag style="cursor: pointer;" :color="userStore.isSign ? '#86909c' : '#7816ff'"
      @click="task">{{ userStore.isSign ? '已完成' : '未完成' }}</a-tag>
    <br>
    <br>
    <span>2. 小程序观看广告领取积分</span>&nbsp;&nbsp;&nbsp;&nbsp;<a-tag style="cursor: pointer;" :color="userStore.adNum ? '#86909c' : '#7816ff'"
      @click="task">{{ userStore.adNum ? '已完成' : '未完成' }}</a-tag>
    <a-divider></a-divider>
    <p style="font-size:12px;">积分可用于全站素材下载服务,赶快来免费领取吧！</p>
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
