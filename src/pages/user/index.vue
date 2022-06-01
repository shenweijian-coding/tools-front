<template>
<div class="w-9/12 mt-2 m-auto bg-white p-2" style="min-height: 500px" v-loading="loading">
  <a-tabs default-active-key="1" position="left" size="large" type="line" style="height: 560px">
   <a-tab-pane key="1" title="基本信息">
     <BaseInfo :data="data.info" v-if="Object.keys(data.info).length"/>
   </a-tab-pane>
   <a-tab-pane key="2" title="下载记录">
     <!-- 下载记录 -->
     <DownLog :data="data.info" v-if="Object.keys(data.info).length"/>
   </a-tab-pane>
 </a-tabs>
</div>
</template>

<script setup>
import BaseInfo from './base-info.vue'
import DownLog from './down-log.vue'
import { useUserStore } from '@/store/modules/user/index'
const userStore = useUserStore();
const loading = ref(false);
let data = reactive({ info: {} });
(async() => {
  loading.value = true
  data.info = await userStore.info()
  console.log(data, 'res');
  loading.value = false
})()
</script>

<style lang="less">
.arco-tabs-nav-tab-list .arco-tabs-tab{
  line-height: 42px;
  font-size: 18px;
}
</style>