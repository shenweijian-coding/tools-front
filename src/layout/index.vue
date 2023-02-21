<template>
  <Header></Header>
  <!-- <s-dialog v-if="notice" :visible="visible" width="600px" title="站内公告" @close="close">
    <p v-html="notice" style="line-height:22px">
    </p>
    <div slot="footer" class="footer"> -->
      <!-- <a-checkbox v-model="noTip">不再提示</a-checkbox> -->
      <!-- <a-button type="primary" size="mini" @click="handleRead">我知道了</a-button>
    </div>
  </s-dialog> -->
  <!-- <div class="top-tip_b" v-if="isClose && notice">
    <div class="tipBox">
      <span class="desc">
        <span>🎉</span>{{ notice }}
      </span>
      <icon-close class="close" @click="close" />
    </div>
  </div> -->
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
import { Notification } from '@arco-design/web-vue';

const notice = ref('')
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