<template>
  <div class="floor">
    <span>© 2024 小申同学。下载资源仅用学习交流，商用请前往对应官网<a href="/#/statement" target="_blank" style="color: #666;">《免责声明》</a>，本站不存储任何资源，下载的文件皆为网络搜集&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    <a href="https://beian.miit.gov.cn/" target="_blank">冀ICP备2022009685号</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <span id="runtime_span" style="color: #666;"></span>
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