<template>
  <Header></Header>
  <s-dialog v-if="notice" :visible="visible" width="600px" title="站内公告" @close="visible = false">
    <p v-html="notice" style="line-height:22px">
    </p>
    <div slot="footer" class="footer">
      <a-checkbox v-model="isOk" @change="checkboxChange">知道了，不再弹出</a-checkbox>
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
const isOk = ref(false)

if (localStorage.getItem('token')) {
  getNoticeInfo().then(res => {
    const isnotice = localStorage.getItem('nonotice')
    console.log(isnotice, '111');
    
    if (res.data && res.data.info && !isnotice) {
      setTimeout(() => {
        visible.value = true
      }, 500);
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
const checkboxChange = (val) => {
  window.localStorage.setItem('nonotice', val)
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