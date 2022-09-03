<template>
  <div class="floor">
    <span>© 2022 小申同学。本站不存储任何资源，所下载的文件皆为网络搜集&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    <a href="https://beian.miit.gov.cn/" target="_blank">冀ICP备2022009685号-1</a>
    <span class="ml-6 cursor-pointer" @click="watchHelpVideo" title="解析千图教程">视频教程</span>
  </div>
  <sDialog v-model:visible="visible" width="1000px" title="视频教程">
    <Help></Help>
  </sDialog>
</template>
<script setup lang="ts">
import sDialog from '../s-dialog/index.vue'
import Help from '@/pages/help/index.vue'
const visible = ref(false)
const watchHelpVideo = () =>  {
  visible.value = true
}
</script>
<style lang="less">
.floor {
  // position: fixed;
  // bottom: 0;
  margin-top: 20px;
  width: 100%;
  height: 40px;
  text-align: center;
  color: #919499;
  font-size: 14px;
  // background-color: #fff;
}
</style>