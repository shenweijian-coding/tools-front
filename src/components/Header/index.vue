<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store';
import { useRoute } from 'vue-router';
import sDialog from '../s-dialog/index.vue'
import { Message } from '@arco-design/web-vue';

const userStore = useUserStore()

const loading = ref(false)

const curPath = ref((toRaw(useRoute()).path))
const paths = reactive({
  list: [
    {
      name: '素材搜索',
      path: '/sucai',
      id: 1,
      text: ''
    }, {
      name: '在线充值',
      path: '/shop',
      id: 3,
      text: ''
    }]
})
const loginVisible = ref(false);

const loginInfo = reactive({
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
}

const logout = () => {
  userStore.logout()
  Message.success('退出成功')
}

</script>

<template>
  <header class="antialiased Male text-slate-500">
    <div
      class="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 bg-white/30 supports-backdrop-blur:bg-white/60">
      <div class="mx-auto max-w-8xl">
        <div class="px-4 py-4 border-b border-slate-900/10 lg:px-8 lg:border-0">
          <div class="relative flex items-center justify-between text-2xl sm:text-2xl font-blimone">
            <a href="/"><img class="h-8" src="@/assets/images/logo.png" alt="logo" /></a>
            <div class="relative flex items-center justify-between lg:w-full">
              <nav class="hidden text-sm font-semibold leading-6 text-white/80 lg:flex">
                <ul class="flex space-x-14">
                  <template v-for="it in paths.list" :key="it.id">
                    <li class="ml-14"
                      :class="curPath === it.path ? 'border-b-4 rounded-sm border-white text-white' : ''">
                      <router-link :to="it.path" class="hover:text-white">{{it.name}}</router-link>
                    </li>
                  </template>
                </ul>
              </nav>
              <nav class="text-sm font-semibold leading-6 text-white dark:text-slate-200">
                <ul class="flex space-x-10">
                  <li class="flex items-center">
                    <span class="flex items-center mr-2">
                      <span>全站积分：{{ userStore.$state.num }}</span>
                    </span>
                    <a-divider direction="vertical"></a-divider>
                    <span v-if="userStore.userIsLogin" @click="openLogin" class="cursor-pointer text-white/80 hover:text-white">
                      登录
                    </span>
                    <span v-else class="flex items-center">
                      <a-dropdown trigger="hover">
                        <span class="cursor-pointer hover:text-white text-white/80">用户中心</span>
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
    <a-input-search class="mt-m" placeholder="卡密 AAA-BBB-CCC-DDD" button-text="卡密登录" v-model="loginInfo.cdkey" search-button @search="login"></a-input-search>
    <div class="get-code">
      <a href="" class="">没有卡密，去获取→</a>
    </div>
  </s-dialog>
</template>

<style lang="less" scoped>
.get-code{
  margin-top: 20px;
  color: rgb(142, 142, 142);
  display: flex;
  justify-content: end;
  &:hover{
    color: #1653ff;
  }
}
</style>
