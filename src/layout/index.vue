<template>
  <Header></Header>
  <s-dialog v-if="notice" :visible="visible" width="600px" title="站内公告" @close="close">
    <p v-html="notice" style="line-height:22px">
    </p>
    <div slot="footer" class="footer">
      <a-button type="primary" size="mini" @click="handleRead">我知道了</a-button>
    </div>
  </s-dialog>
  <router-view></router-view>
  <floor></floor>
  <Slide></Slide>
</template>

<script setup lang="ts">
import Header from "@components/Header/index.vue"
import Floor from "@components/floor/index.vue"
import Slide from '@/components/slide/index.vue'
import { getNoticeInfo } from '@/api/home/index'
import sDialog from '@/components/s-dialog/index.vue'

const notice = ref('')
const visible = ref(false)
const version = localStorage.getItem('_v')

if (localStorage.getItem('token')) {
  getNoticeInfo().then(res => {
    if (res.data && res.data.info) {
      visible.value = true
      notice.value = res.data.info
      
      // 版本管理
      if(version != res.data.version) {
        localStorage.setItem('_v', res.data.version)
        window.location.reload()
      }
    }
  })
}
const handleRead = () => {
  visible.value = false
}
const close = () => {

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