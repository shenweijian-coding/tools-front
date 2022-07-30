<template>
  <Header></Header>
  <s-dialog v-model:visible="visible" width="600px" title="站内公告" @close="close">
    <p v-html="notice" style="line-height:22px">
    </p>
    <div slot="footer" class="footer">
      <!-- <a-checkbox v-model="noTip">不再提示</a-checkbox> -->
      <a-button type="primary" size="mini" @click="handleRead">我知道了</a-button>
    </div>
  </s-dialog>
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

const notice = ref('')
const noTip = ref(false)
const visible = ref(true)
getNoticeInfo().then(res => {
  notice.value = res.data
})
const getNotice = async () => {
  const res = await getNoticeInfo()
  notice.value = res.data
}
// if (localStorage.getItem('noTip') !== '1') {
getNotice()
// }
const handleRead = () => {
  // if (noTip.value) { // 勾选了
  //   localStorage.setItem('noTip', '1')
  // }
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