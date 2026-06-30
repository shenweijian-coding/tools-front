<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store';
import { useRoute } from 'vue-router';
import sDialog from '../s-dialog/index.vue'
import { Message } from '@arco-design/web-vue';
import { IconDown } from '@arco-design/web-vue/es/icon';
import { useAppStore } from '@/store';
import selSites from './sel-sites.vue'
import { sendMail } from '@api/home/index'

import myVideo from './video.vue'
const appStore = useAppStore()
const userStore = useUserStore()
const loading = ref(false)
const route = useRoute()

const curPath = computed(() => route.path)
const paths = reactive({
  list: [
    {
      name: '素材搜索',
      path: '/sucai',
      id: 1,
      text: ''
    },
    {
      name: '下载记录',
      path: '/user?key=2',
      id: 2,
      text: ''
    }]
})
var pattern = /^([0-9a-zA-Z_\.\-\u4e00-\u9fa5])+\@([0-9a-zA-Z_\.\-\])+\.([a-zA-Z]{2,8})$/;
const loginVisible = ref(false);
const videoVisible = ref(false)
const sendMailAddress = ref()
const disabledSendMail = ref(false)
const sendYzm = ref()

const loginInfo = reactive({
  cdkey: '',
})

const openLogin = () => {
  loginVisible.value = true;
}
if (localStorage.getItem('cdkey')) {
  loginInfo.cdkey = localStorage.getItem('cdkey') || ''
}
// 发送邮箱
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

  loginVisible.value = false;
  loading.value = false
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
  loginVisible.value = false
}

const logout = () => {
  userStore.logout()
  Message.success('退出成功')
}
</script>

<template>
  <header class="site-header">
    <div class="site-nav">
      <a href="/" class="brand" aria-label="返回首页">
        <img v-if="appStore.$state?.webConfig?.logo" :src="appStore.$state?.webConfig?.logo" alt="logo" />
        <span v-else>素材工具箱</span>
      </a>

      <nav class="nav-links">
        <template v-for="it in paths.list" :key="it.id">
          <router-link v-if="!it.target" :to="it.path" class="nav-link"
            :class="{ active: it.path.indexOf(curPath) !== -1 }">
            {{it.name}}
          </router-link>
          <a v-else :href="it.path" :target="it.target" class="nav-link">{{it.name}}</a>
        </template>
      </nav>

      <div class="nav-actions">
        <template v-if="!userStore.userIsLogin">
          <div class="quota-pill">
            <span class="quota-label">剩余次数</span>
            <strong>{{ userStore.$state.num >= 0 ? userStore.$state.num : 0 }}</strong>
            <span v-if="userStore.$state.numDeadDate" class="quota-date">{{ userStore.$state.numDeadDate }}</span>
          </div>
        </template>
        <button v-if="userStore.userIsLogin" class="login-btn" @click="openLogin">登录</button>
        <a-dropdown v-else trigger="hover">
          <button class="user-btn">
            <span>用户中心</span>
            <icon-down />
          </button>
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
      </div>
    </div>
  </header>
  <s-dialog :visible="loginVisible" width="420px" title="登录" @close="close" :closeOnClickOverlay="true">
    <!-- <a-button type="text" @click="toggleLogin">切换 卡密/微信扫码 登录</a-button> -->
    <!-- <a-tabs default-active-key="1"> -->
      <!-- <a-tab-pane key="1" title="邮箱登陆">
        <div class="flex">
          <a-input placeholder="请输入邮箱" button-text="发送" v-model="sendMailAddress" search-button></a-input>
          <a-button @click="handleSendMail" type="primary" :disabled="disabledSendMail">发送</a-button>
        </div>
        <a-input placeholder="请输入发送的邮箱验证码" class="mt-l" v-model="sendYzm"></a-input>
        <a-button type="primary" class="w-100 mt-l" @click="mailLogin">登陆</a-button>
      </a-tab-pane> -->
      <!-- <a-tab-pane key="2" title="卡密登录"> -->
        <div class="login-dialog-shell">
          <div class="login-dialog-head">
            <h3>卡密登录</h3>
            <p>输入卡密后即可使用素材搜索服务</p>
          </div>
          <a-input-search class="login-code-input" placeholder="卡密 AAA-BBB-CCC-DDD" button-text="登录"
            v-model="loginInfo.cdkey" search-button @search="login"></a-input-search>
        </div>
      <!-- </a-tab-pane> -->
    <!-- </a-tabs> -->
  </s-dialog>
  <!-- 自选站点 -->
  <sel-sites></sel-sites>
  <!-- <myVideo :videoVisible="videoVisible" @close="videoVisible = false"></myVideo> -->
</template>

<style lang="less" scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  justify-content: center;
  padding: 12px 18px;
  background: rgba(248, 250, 252, 0.88);
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  backdrop-filter: blur(18px);
}

.site-nav {
  width: min(1180px, 100%);
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  padding: 0 18px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 8px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}

.brand {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  min-width: 118px;
  color: #111827;
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;

  img {
    max-width: 140px;
    height: 34px;
    object-fit: contain;
  }
}

.nav-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: 1;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  height: 38px;
  padding: 0 16px;
  border-radius: 8px;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.18s ease;

  &:hover {
    color: #0f766e;
    background: #f1f5f9;
  }

  &.active {
    color: #fff;
    background: #111827;
    box-shadow: 0 10px 24px rgba(17, 24, 39, 0.16);
  }
}

.nav-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex: 0 0 auto;
}

.quota-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid rgba(20, 184, 166, 0.22);
  border-radius: 8px;
  background: #ecfdf5;
  color: #0f766e;
  font-size: 13px;
  white-space: nowrap;

  strong {
    color: #064e3b;
    font-size: 16px;
  }
}

.quota-label,
.quota-date {
  color: #64748b;
}

.login-btn,
.user-btn {
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 16px;
  border: 0;
  border-radius: 8px;
  background: #111827;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    background: #0f766e;
    transform: translateY(-1px);
  }
}

.login-dialog-shell {
  padding: 8px 2px 14px;
}

.login-dialog-head {
  margin-bottom: 18px;

  h3 {
    margin: 0;
    color: #111827;
    font-size: 22px;
    line-height: 1.25;
    font-weight: 800;
  }

  p {
    margin: 8px 0 0;
    color: #6b7280;
    font-size: 14px;
    line-height: 1.6;
  }
}

.login-code-input {
  width: 100%;
  height: 52px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);

  :deep(.arco-input-wrapper) {
    height: 52px;
    padding-left: 16px;
    background: #fff;
    border: 1px solid rgba(17, 24, 39, 0.14);
  }

  :deep(.arco-input-wrapper:hover),
  :deep(.arco-input-wrapper.arco-input-focus) {
    border-color: #111827;
    box-shadow: none;
  }

  :deep(.arco-input) {
    color: #111827;
    font-size: 15px;
  }

  :deep(.arco-input::placeholder) {
    color: #9ca3af;
  }

  :deep(.arco-input-append) {
    background: transparent;
    border: 0;
  }

  :deep(.arco-input-append button) {
    min-width: 92px;
    height: 52px;
    border: 0;
    border-radius: 0;
    background: #111827;
    color: #fff;
    font-weight: 700;
  }

  :deep(.arco-input-append button:hover) {
    background: #000;
  }
}

.get-code{
  margin-top: 20px;
  color: rgb(142, 142, 142);
  display: flex;
  justify-content: end;
  &:hover{
    color: #1653ff;
  }
}

@media (max-width: 860px) {
  .site-nav {
    min-height: auto;
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
    padding: 14px;
  }

  .brand {
    justify-content: center;
  }

  .nav-links {
    width: 100%;
    justify-content: space-between;
    gap: 8px;
  }

  .nav-link {
    flex: 1;
    justify-content: center;
    padding: 0 8px;
  }

  .nav-actions {
    width: 100%;
    justify-content: space-between;
  }

  .quota-pill {
    max-width: calc(100% - 112px);
    overflow: hidden;
  }

  .quota-date {
    display: none;
  }
}
</style>
