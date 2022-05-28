<template>
<div class="w-9/12 mt-4 m-auto bg-white h-5/6 p-2" style="min-height: 600px">
  <a-tabs default-active-key="1" position="left" size="large" type="line">
   <a-tab-pane key="1" title="基本信息">
     <BaseInfo />
   </a-tab-pane>
   <a-tab-pane key="2" title="下载记录">
     <!-- 下载记录 -->
     <DownLog />
   </a-tab-pane>
 </a-tabs>
</div>
</template>

<script setup>
import BaseInfo from './base-info.vue'
import DownLog from './down-log.vue'
import { useUserStore } from '@/store/modules/user/index'
const userStore = useUserStore()
userStore.info()
</script>

<style lang="less">
.arco-tabs-nav-tab-list .arco-tabs-tab{
  line-height: 42px;
  font-size: 18px;
}
</style>