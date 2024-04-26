<script setup>
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
import { pwd2Wxapp, handleBindEmail } from '@api/user/index'
import { sendMail } from '@api/home/index'
// const appStore = useAppStore()
const userStore = useUserStore()
// const theme = computed(() => {
//   return appStore.theme
// })
const loading = ref(false)
// const isDark = useDark({
//   selector: 'body',
//   attribute: 'arco-theme',
//   valueDark: 'dark',
//   valueLight: 'light',
//   storageKey: 'arco-theme',
//   onChanged(dark) {
//     appStore.toggleTheme(dark);
//   },
// })
const curPath = ref((toRaw(useRoute()).path))
const paths = reactive({
  list: [
    {
      name: '资源搜索',
      path: '/sucai',
      id: 1,
      text: ''
    },
    {
      name: '书签插件',
      path: '/plugin',
      id: 3,
      text: '推荐'
    }
    // {
    //   name: '邀请送分',
    //   path: '/invite',
    //   id: 2,
    //   text: ''
    // },
    // {
    //   name: '使用帮助',
    //   path: '/help',
    //   id: 4,
    //   text: ''
    // }
  ]
})
const visible = ref(false);
const stepsVisible = ref(false)
const loginCode = ref('');
const accode = ref('');
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
  paths.list.push({
    name: '站内商店',
    path: '/shop',
    id: 3,
    text: ''
  })
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
  visible.value = false;
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

var pattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/;
const sendMailAddress = ref()
const sendYzm = ref()
const disabledSendMail = ref(false)
const handleSendMail = async() => {
  if(!sendMailAddress.value) {
    Message.warning('请填写邮箱')
    return
  }
  if(!pattern.test(sendMailAddress.value)) {
    Message.warning('邮箱格式有误')
    return
  }
  const res = await sendMail({ mail: sendMailAddress.value })
  Message.success(res.data)
  disabledSendMail.value = true
  setTimeout(() => {
    disabledSendMail.value = false
  }, 10000);
}
const mailLogin = async () => {
  if(!sendMailAddress.value || !sendYzm.value) {
    Message.warning('请填写邮箱和验证码')
    return
  }
  if(!pattern.test(sendMailAddress.value)) {
    Message.warning('邮箱格式有误')
    return
  }
  const res = await userStore.mailLogin({
    mail: sendMailAddress.value,
    code: sendYzm.value
  })
  Message.success('登录成功')

  visible.value = false;
  loading.value = false
  window.location.reload()
}

const mailVisible = ref(false)
if(!userStore.userIsLogin && !userStore.email) {
  mailVisible.value = true
}
const emailBindId = async() => {
  if(!sendMailAddress.value || !sendYzm.value) {
    Message.warning('请填写')
    return
  }
  if(!pattern.test(sendMailAddress.value)) {
    Message.warning('邮箱格式有误')
    return
  }
  const res = await handleBindEmail({
    mail: sendMailAddress.value,
    code: sendYzm.value
  })
  mailVisible.value = false
  userStore.logout()
  Message.success(res.data + '请重新登陆')
}
</script>

<template>
  <header class="antialiased bg-white Male text-slate-500">
    <div
      class="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 bg-white/95 supports-backdrop-blur:bg-white/60">
      <div class="mx-auto max-w-8xl">
        <div class="px-4 py-4 border-b border-slate-900/10 lg:px-8 lg:border-0">
          <div class="relative flex items-center justify-between text-2xl sm:text-2xl font-blimone">
            <!-- <router-link
              to="/"
              class="mr-3 flex-none w-[2.0625rem] md:w-auto leading-6 dark:text-slate-200"
            > -->
            <a href="/"><img class="h-8" src="@/assets/images/logo.png" alt="logo" /></a>
            <!-- </router-link> -->
            <div class="relative flex items-center justify-between lg:w-full">
              <nav class="hidden text-sm font-semibold leading-6 text-slate-700 lg:flex">
                <ul class="flex space-x-14">
                  <template v-for="it in paths.list" :key="it.id">
                    <li class="ml-14"
                      :class="curPath === it.path ? 'border-b-4 rounded-sm border-blue-400 text-blue-500' : ''">
                      <router-link v-if="!it.target" :to="it.path" class="hover:text-blue-500">{{ it.name }}
                      </router-link>
                      <a v-else :href="it.path" :target="it.target" class="hover:text-blue-500">{{ it.name }}</a>
                    </li>
                  </template>
                </ul>
              </nav>
              <nav class="text-sm font-semibold leading-6 text-slate-700">
                <ul class="flex space-x-10">
                  <li class="flex items-center">
                    <span v-if="userStore.userIsLogin" @click="openLogin" class="cursor-pointer hover:text-blue-500">
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
  <s-dialog :visible="visible" width="300px" @close="close" title="">
    <div>
      <a-tabs default-active-key="1">
        <!-- <a-tab-pane key="0" title="小程序登录">
          <wxappLogin @login="visible = false"></wxappLogin>
        </a-tab-pane> -->

        <a-tab-pane key="1" title="邮箱登陆">
          <div class="flex">
            <a-input placeholder="请输入邮箱" button-text="发送" v-model="sendMailAddress" search-button></a-input>
            <a-button @click="handleSendMail" type="primary" :disabled="disabledSendMail">发送</a-button>
          </div>
          <a-input placeholder="请输入发送的邮箱验证码" class="mt-l" v-model="sendYzm"></a-input>
          <a-button type="primary" class="w-100 mt-l" @click="mailLogin">登陆</a-button>
        </a-tab-pane>
        <!-- <a-tab-pane key="2" title="卡密登录">
          <a-input-search placeholder="卡密yyy-xxx-jjj" button-text="卡密登录" v-model="accode" search-button @search="login(2)">
          </a-input-search>
        </a-tab-pane> -->
      </a-tabs>
    </div>
  </s-dialog>
  <s-dialog :visible="stepsVisible" title="免费获取积分" width="400px" @close="stepsVisible = false">
    <Wxapp></Wxapp>
  </s-dialog>

  <s-dialog :visible="mailVisible" title="邮箱绑定" width="400px" @close="mailVisible = false" :closeOnClickOverlay="false">
    <div class="flex">
      <a-input placeholder="请输入邮箱" button-text="发送"  v-model="sendMailAddress" search-button></a-input>
      <a-button @click="handleSendMail" type="primary">发送</a-button>
    </div>
    <a-input placeholder="请输入发送的邮箱验证码" class="mt-l" v-model="sendYzm"></a-input>
    <a-button type="primary" class="w-100 mt-l" @click="emailBindId">绑定邮箱</a-button>
    <p class="text-m mt-m text-bold">*后续可能无法扫码登陆，防止权限丢失，请提前绑定邮箱</p>
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
