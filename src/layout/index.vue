<template>
  <Header></Header>
  <router-view></router-view>
  <floor></floor>
</template>

<script setup lang="ts">
import Header from "@components/Header/index.vue"
import Floor from "@components/floor/index.vue"
import { getNoticeInfo } from '@/api/home/index'
import { Notification } from '@arco-design/web-vue';

const visible = ref(false)
if (localStorage.getItem('token')) {
  // visible.value = true
  getNoticeInfo().then(res => {
    // notice.value = res.data
    if (res.data) {
      res.data.forEach(it => {
        Notification.info({
          content: it,
          closable: true,
          duration: 60000,
          position: 'topLeft'
        })
      });
    }
  })
}
</script>

<style lang="less">
.footer {
  margin-top: 20px;
  text-align: right;

  button {
    margin-left: 22px;
  }
}
</style>