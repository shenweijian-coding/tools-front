<template>
  <Header></Header>
  <router-view></router-view>
  <floor></floor>
  <!-- <s-dialog :visible="isShowNotice" width="56%" title="公告" @close="isShowNotice = false">
    <p v-html="appStore.$state.webConfig.notice"></p>
  </s-dialog> -->
</template>

<script setup>
import Header from "@components/Header/index.vue"
import Floor from "@components/floor/index.vue"
import sDialog from '@/components/s-dialog/index.vue'
import { useAppStore } from '@/store';
const appStore = useAppStore()
const isShowNotice = ref(false)
appStore.getWebConfig()
// setTimeout(() => {
//   isShowNotice.value = !!appStore.$state.webConfig?.notice
// }, 1000);

</script>