<script setup>
import { getHuKeUrl } from '@/api/play'
import { Message } from '@arco-design/web-vue';
const getPlay = async(url) => {
  const { data } = await getHuKeUrl({ url: url.value })
  if (data.can_play) {
    window.open(data.videoUrl, '_blank')
  } else {
    Message.error('当前资源搜索失败，请咨询站长！')
  }
}
</script>

<template>
<div class="page-design app-page appView">
  <div v-loading="loading">
    <div class="app-header-box">
      <h1 class="app-heade-title">虎课教程资源搜索</h1>
      <div class="app-header-input">
        <Input @getPlay="getPlay"/>
      </div>
    </div>
  </div>
  <div class="app-page-doc">
    <h1 class="doc-title">使用虎课必读</h1>
    <div class="doc-item">
      <p class="item-title"><span>方式一：</span>使用浏览器插件观看</p> 
      <div class="item-tips" style="color: rgb(85, 85, 85);">使用前请查看对应的教程，或点击列表图标查看链接格式，并严格按照格式提交链接。</div> 
      <div style="background-color: rgb(235, 235, 235); height: 1px; margin: 16px auto 0px;"></div>
    </div>
    <div class="doc-item">
      <p class="item-title"><span>方式二：</span>浏览器进行配置观看</p> 
      <div class="item-tips" style="color: rgb(85, 85, 85);">使用前请查看对应的教程，或点击列表图标查看链接格式，并严格按照格式提交链接。</div> 
      <div style="background-color: rgb(235, 235, 235); height: 1px; margin: 16px auto 0px;"></div>
    </div>
  </div>
  </div>
</template>
<style lang="less">
  .app-page {
  width: 95%;
  max-width: 1300px;
  margin: 24px auto auto;
    .app-header-box{
      display: block;
      border-radius: 8px;
      height: 260px;
      background-color: #d3ddee;
      -webkit-box-shadow: 0 0 10px 0 rgb(0 0 0 / 24%);
      box-shadow: 0 0 10px 0 rgb(0 0 0 / 24%);
      text-shadow: 0 0 10px rgb(0 0 82 / 0%);
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: cover;
      text-align: center;
      .app-heade-title {
        color: #f0f1f5;
        font-size: 28px;
        padding: 60px 0 8px;
      }
      .app-header-input{
        width: 96%;
        margin: auto;
        max-width: 700px;
      }
  }
  .app-page-doc {
    background-color: hsla(0,0%,100%,.3411764705882353);
    border-radius: 4px;
    margin-top: 24px;
    padding: 10px 16px 16px 16px;
    .doc-title {
      text-align: center;
      font-size: 20px;
      margin-bottom: 24px;
    }
    .doc-item {
      margin: auto;
      max-width: 960px;
      padding: 16px;
      .item-title {
        font-size: 13px;
        padding-bottom: 8px;
    }
    .item-tips {
        font-size: 12px;
    }
  } 
  }
}
.app-header-box{
  background-image: url(https://pic1.zhimg.com/v2-8b9226cb502a89da2c4464d611a8ba9c_r.jpg);
}
</style>