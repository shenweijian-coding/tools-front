<template>
  <div class="floor">
    <span>© 2022 小申同学。本站不存储任何资源，所下载的文件皆为网络搜集&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    <a href="https://beian.miit.gov.cn/" target="_blank">冀ICP备2022009685号-1</a>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <a-popover>
      <span class="cursor-pointer">联系站长</span>
      <template #content>
        <!-- <span>QQ号：1834638245</span><br> -->
        <img src="@/assets/images/QR.jpg" alt="二维码">
      </template>
    </a-popover>
  </div>
</template>
<script setup lang="ts">
</script>
<style lang="less">
  .floor {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
    text-align: center;
    color: #919499;
    font-size: 14px;
    // background-color: #fff;
  }
</style>