<template>
  <div class="floor">
    <span>© 2022 小申同学。本站不存储任何资源，所下载的文件皆为网络搜集&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    <a href="https://beian.miit.gov.cn/" target="_blank">冀ICP备2022009685号-1</a>&nbsp;&nbsp;&nbsp;
    <a href="https://www.tools1998.top" target="_blank">曹操极速代下平台</a>
  </div>
</template>
<script setup lang="ts">

const visible = ref(false)
const watchHelpVideo = () =>  {
  visible.value = true
}
</script>
<style lang="less">
.floor {
  margin-top: 20px;
  width: 100%;
  height: 40px;
  text-align: center;
  color: #919499;
  font-size: 14px;
  // background-color: #fff;
}
</style>