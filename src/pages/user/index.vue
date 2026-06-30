<template>
  <div class="user-center w-9/12 mt-2 m-auto bg-white" v-loading="loading">
    <a-tabs v-model:active-key="activeKey" position="left" size="large" type="line" class="user-center-tabs"
      @change="tabChange">
      <a-tab-pane key="1" title="基本信息">
        <BaseInfo :data="data.info" />
      </a-tab-pane>
      <a-tab-pane key="2" title="下载记录">
        <!-- 下载记录 -->
        <DownLog :data="downLogList.info" @pageChange="getDownList"/>
      </a-tab-pane>
      <a-tab-pane key="3" title="支付记录">
        <!-- 赞助记录 -->
        <Spon :payInfo="payInfo.info"></Spon>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import BaseInfo from './base-info.vue'
import DownLog from './down-log.vue'
import Spon from './spon.vue'
import { useUserStore } from '@/store/modules/user/index'
import { getUserPayInfo, getDownLog } from '@api/user'
import { useRoute } from 'vue-router';
const route = useRoute()

const userStore = useUserStore();
const loading = ref(false);

let data = reactive({ info: {} });
let payInfo = reactive({ info: [] });
let downLogList = reactive({ info: [] });

const activeKey = ref('1');

const getDownList = async (page = 1) => {
  loading.value = true
  const res = await getDownLog({ page })
  downLogList.info = res.data
  loading.value = false
}

const syncActiveKey = async (key) => {
  const nextKey = String(key || '1')
  activeKey.value = nextKey
  if (nextKey === '2') {
    await getDownList()
  }
}

watch(
  () => route.query.key,
  (key) => {
    syncActiveKey(key)
  },
  { immediate: true }
)

(async () => {
  loading.value = true
  data.info = await userStore.info()
  loading.value = false
})()

const tabChange = async (type) => {
  activeKey.value = String(type)
  loading.value = true
  if (activeKey.value === '2') {
    await getDownList()
  } else if (activeKey.value === '3') {
    if (!payInfo.info.length) {
      const res = await getUserPayInfo()
      payInfo.info = res.data.filter(o => o.type) || []
    }
  }
  loading.value = false
}


</script>

<style lang="less">
.user-center {
  min-height: 560px;
  padding: 18px;
  border: 1px solid #eef0f5;
  border-radius: 8px;
  box-shadow: 0 10px 28px rgba(27, 21, 64, 0.06);
}

.user-center-tabs {
  min-height: 560px;
}

.user-center-tabs .arco-tabs-content {
  padding-left: 20px;
}

.user-center-tabs .arco-tabs-nav-tab-list .arco-tabs-tab {
  line-height: 42px;
  font-size: 16px;
  color: #4e5969;
}

.user-center-tabs .arco-tabs-nav-tab-list .arco-tabs-tab-active {
  color: rgb(var(--primary-6));
  font-weight: 600;
}
</style>
