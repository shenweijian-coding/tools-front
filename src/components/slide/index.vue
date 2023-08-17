<template>
  <div class="slide-box">
    <ul class="slide-list">
      <li title="小程序送积分">
        <a-popover position="left">
          <span>
            <icon-qrcode class="icon" />
            <span class="icon-tip">小程序</span>
          </span>
          <template #content>
            <img src="https://pic.imgdb.cn/item/64d886bc1ddac507cca14726.jpg" alt="二维码" style="width:200px;height:200px">
          </template>
        </a-popover>
      </li>
      <li title="拉进微信群">
        <a-popover position="left">
          <span>
            <icon-scan class="icon" />
            <span class="icon-tip">微信号</span>
          </span>

          <template #content>
            <img src="https://pic.imgdb.cn/item/6300a79b16f2c2beb1ccc2d1.png" alt="二维码" style="width:200px;height:200px">
          </template>
        </a-popover>
      </li>
      <li title="微信公众号送卡密">
        <a-popover position="left">
          <span>
            <icon-scan class="icon" />
            <span class="icon-tip">送卡密</span>
          </span>

          <template #content>
            <img src="https://pic1.imgdb.cn/item/6300a80616f2c2beb1ccf790.jpg" alt="二维码" style="width:200px;height:200px">
          </template>
        </a-popover>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { IconScan, IconUser, IconQrcode } from '@arco-design/web-vue/es/icon';
</script>
<style lang="less" scoped>
.slide-box {
  width: 48px;
  height: 220px;
  padding: 12px 0;
  top: 60%;
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