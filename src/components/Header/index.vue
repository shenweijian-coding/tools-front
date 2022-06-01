<script setup>
import SvgIcon from '../SvgIcon/index.vue'
import { ref } from 'vue'
import { useDark, useToggle } from '@vueuse/core';
import { useAppStore, useUserStore } from '@/store';
import { useRoute } from 'vue-router';
import { Modal } from '@arco-design/web-vue';
import QR from '../dialog/index.vue'
import { Message } from '@arco-design/web-vue';
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
    id: 1
  },{
    name: '虎课播放',
    path: '/huke',
    id: 2
  },{
    name: '视达播放',
    path: '/shida',
    id: 3
  }]
})
const visible = ref(false);
const loginCode = ref('');
const openLogin = () => {
  visible.value = true;
}
const login = async () => {
  console.log(loginCode.value, '111');
  if(!loginCode.value) {
    Message.warning('请输入验证码！')
  }
  const res = await userStore.login({ code: loginCode.value, ip: returnCitySN["cip"] })
    Message.success('登录成功')
    window.location.reload()
}
const close = () => {
  loginCode.value = ''
}
</script>

<template>
  <header class="antialiased bg-white Male text-slate-500 dark:text-slate-400 dark:bg-slate-900">
    <div
      class="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent"
    >
      <div class="mx-auto max-w-8xl">
        <div
          class="px-4 py-4 border-b border-slate-900/10 lg:px-8 lg:border-0 dark:border-slate-300/10"
        >
          <div class="relative flex items-center text-2xl sm:text-2xl font-blimone">
            <!-- <router-link
              to="/"
              class="mr-3 flex-none w-[2.0625rem] md:w-auto leading-6 dark:text-slate-200"
            > -->
            <img class="h-8" src="@/assets/images/logo.png" alt="">
            <!-- </router-link> -->
            <div class="relative items-center hidden flex justify-between lg:flex w-full">
              <nav class="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">
                <ul class="flex space-x-14">
                  <template v-for="it in paths.list" :key="it.id">
                  <li class="ml-16" :class="curPath === it.path ? 'border-b-4 rounded-sm border-blue-400 text-blue-500' : ''">
                    <router-link
                      :to="it.path"
                      class="hover:text-blue-500 dark:hover:text-blue-400"
                    >{{it.name}}</router-link>
                  </li>
                  </template>
                </ul>
              </nav>
              <nav class="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">
                <ul class="flex space-x-8">
                  <li>
                    <span
                    v-if="userStore.userIsLogin"
                      @click="openLogin"
                      class="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer"
                    >登录</span>
                    <span v-else class="cursor-pointer hover:text-blue-500">
                      <router-link to="/user">用户中心</router-link>
                      <!-- <a-space size="large">
                      <a-dropdown trigger="hover">
                        <span>用户中心</span>
                        <template #content>
                          <a-doption>Option 1</a-doption>
                          <a-doption>Option 2</a-doption>
                          <a-doption>Option 3</a-doption>
                        </template>
                      </a-dropdown></a-space> -->
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
  <a-modal v-model:visible="visible" :closable="false" width="300px" :footer="false" @close="close">
      <a-input-search placeholder="请输入5位验证码" button-text="登录" v-model="loginCode" search-button @search="login"></a-input-search>
      <a-popover position="right">
        <span style="float:right;font-size:12px;color:#919499;cursor: pointer;">获取验证码？</span>
        <template #content>
          <QR />
        </template>
      </a-popover>
  </a-modal>
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
