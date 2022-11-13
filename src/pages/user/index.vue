<template>
  <div class="w-9/12 mt-2 m-auto bg-white p-2" style="min-height: 500px" v-loading="loading">
    <a-tabs default-active-key="1" :active-key="activeKey" position="left" size="large" type="line" style="height: 560px" @change="tabChange">
      <a-tab-pane key="1" title="基本信息">
        <BaseInfo :data="data.info" v-if="Object.keys(data.info).length" />
      </a-tab-pane>
      <a-tab-pane key="2" title="下载记录">
        <!-- 下载记录 -->
        <DownLog :data="data.info" v-if="Object.keys(data.info).length" />
      </a-tab-pane>
      <a-tab-pane key="3" title="赞助记录">
        <!-- 赞助记录 -->
        <Spon :payInfo="payInfo.info"></Spon>
      </a-tab-pane>
      <!-- <a-tab-pane key="4" title="邀请活动">
        邀请活动
        <Invite :inviteInfo="inviteInfo.info" @createInviteInfo="createInviteInfo"></Invite>
      </a-tab-pane> -->
      <a-tab-pane key="5" title="卡密激活">
        <!-- 卡密兑现 -->
        <CodeCash></CodeCash>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import BaseInfo from './base-info.vue'
import DownLog from './down-log.vue'
import Spon from './spon.vue'
import CodeCash from './code-cash.vue'
import Invite from './invite.vue'
import { useUserStore } from '@/store/modules/user/index'
import { getUserPayInfo, getInviteInfo } from '@api/user'
import { useRouter } from 'vue-router';
let router = useRouter()

const userStore = useUserStore();
const loading = ref(false);

let data = reactive({ info: {} });
let payInfo = reactive({ info: [] });
let inviteInfo = reactive({ info: {} });
const activeKey = ref('1');

if (toRaw(router).currentRoute.value.query.key) {
  activeKey.value = toRaw(router).currentRoute.value.query.key || '1'
}

(async () => {
  loading.value = true
  data.info = await userStore.info()
  console.log(data, 'res');
  loading.value = false
})()

const tabChange = async (type) => {
  activeKey.value = type
  loading.value = true
  if (type == 3) {
    if (!payInfo.info.length) {
      const res = await getUserPayInfo()
      payInfo.info = res.data || []
    }
  } else if (type == 4) {
    if (!inviteInfo.info.inviteCode) {
      const res = await getInviteInfo()
      inviteInfo.info = res.data || {}
    }
  }
  loading.value = false
}
const createInviteInfo = (data) => {
  inviteInfo.info = { ...inviteInfo.info, ...data }
}
</script>

<style lang="less">
.arco-tabs-nav-tab-list .arco-tabs-tab {
  line-height: 42px;
  font-size: 18px;
}
</style>