<template>
  <div class="slide-box">
    <ul class="slide-list">
      <li title="小程序">
        <a-popover position="left">
          <span>
            <icon-qrcode class="icon" />
            <span class="icon-tip">小程序</span>
          </span>
          <template #content>
            <img src="@/assets/images/wxapp.jpg" alt="二维码" style="width:200px;height:200px">
          </template>
        </a-popover>
      </li>
      <li title="微信群">
        <a-popover position="left">
          <span>
            <icon-scan class="icon" />
            <span class="icon-tip">微信群</span>
          </span>

          <template #content>
            <img src="https://tools1998.top/image/wx-qun.jpg" alt="二维码" style="width:200px;height:200px">
          </template>
        </a-popover>
      </li>
      <!-- <li title="微信号">
        <a-popover position="left">
          <span>
            <icon-user class="icon" />
            <span class="icon-tip">微信</span>

          </span>
          <template #content>
            <img src="@/assets/images/wx.png" alt="二维码" style="width:200px;height:200px">
          </template>
        </a-popover>
      </li> -->
    </ul>
  </div>
</template>

<script setup lang="ts">
import { IconScan, IconUser, IconQrcode } from '@arco-design/web-vue/es/icon';
</script>
<style lang="less" scoped>
.slide-box {
  width: 48px;
  height: 186px;
  padding: 12px 0;
  top: 38%;
  right: 0;
  position: absolute;
  background: #fff;
  box-shadow: 0 3px 7px 0 rgb(0 0 0 / 10%);
  z-index: 9999;
  border-radius: 12px 0 0 12px;

  .slide-list {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;

    li {
      cursor: pointer;
      text-align: center;
    }

    li:hover {
      .icon, .icon-tip{
        color: #165dff;
      }
    }
  }

  .icon-tip {
    font-size: 12px;
    display: inline-block;
    color: #919499;
  }

  .icon {
    font-size: 26px;
    color: #c3c3c3;
  }
}

@media screen and(max-width: 1300px) {
  .slide-box {
    display: none;
  }
}
</style>