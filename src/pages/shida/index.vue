<script setup>
import { getPlayUrl, getDownFile, getClassList } from '@api/play'
import { Message } from '@arco-design/web-vue';
import { videoPlay } from 'vue3-video-play'
import Header from "@components/Header/index.vue"
import Input from '@components/Input/index.vue'
import { IconPlayCircle } from '@arco-design/web-vue/es/icon';

  const options =  reactive({
    width: 'auto', //播放器高度
    height: '500px', //播放器高度
    color: "#409eff", //主题色
    title: '', //视频名称
    src: "", //视频源
    muted: false, //静音
    webFullScreen: false,
    speedRate: ["0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
    autoPlay: false, //自动播放
    loop: false, //循环播放
    mirror: false, //镜像画面
    ligthOff: false,  //关灯模式
    volume: 0.3, //默认音量大小
    control: true, //是否显示控制
    poster: '',
    controlBtns:['audioTrack', 'speedRate', 'volume', 'setting', 'pip', 'pageFullScreen', 'fullScreen'] //显示所有按钮,
  })
  // const url = ref()
  const loading = ref(false)
  const listLoading = ref(false)
  const isDown = ref(false)
  const title = ref('')
  const visible = ref(false)
  const curDownUrl = ref('')
  let downParams = { vid: '', sid: '' }
  const classList = reactive({
    list: []
  })
  listLoading.value = true
  getClassList().then(res => {
    console.log(res, 'res');
    classList.list = res.data
    listLoading.value = false
  })
  const reset = () => {
    downParams = { vid: '', sid: '' }
    isDown.value = false
    curDownUrl.value = ''
  }
  const getPlay = async (url) => {
    loading.value = true
    reset()
    if(!url.value) {
      Message.warning('Url不能为空！')
      return
    }
    try {
      const { data } = await getPlayUrl({ url: url.value })
      Message.success('success')
      console.log(data, 'res');
      data.playUrl && (visible.value = true)
      options.poster = data.cover
      options.src = data.playUrl
      options.title = data.title
      title.value = data.title
      if(data.isDown) {
        isDown.value = data.isDown
        downParams.vid = data.vid
        downParams.sid = data.sid
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false
    }
  }
  const downFile = async () => {
    if(curDownUrl.value) {
      window.open(curDownUrl.value)
    }else {
      const { data } = await getDownFile(downParams)
      console.log(data);
      window.open(data)
    }
  }
  const playCurVideo = (item) => {
    reset()
    options.poster = item.img
    options.src = item.videoUrl
    title.value = item.title
    if(item.downUrl) {
      isDown.value = true
       curDownUrl.value = item.downUrl
    }
    visible.value = true
  }
</script>
<template>
  <a-modal 
  v-model:visible="visible"
  width="60%"
  :title="title"
  :mask-closable="false"
  :footer="false"
  :unmount-on-close="true">
    <videoPlay class="w-full" type="m3u8" v-bind="options" ></videoPlay>
    <div class="mt-2 text-right">
      <a-button v-if="isDown" type="primary" status="" @click="downFile" >下载素材+课堂源文件</a-button>
    </div>
  </a-modal>
<div class="page-design app-page appView">
  <div v-loading="loading">
    <div class="app-header-box">
      <h1 class="app-heade-title">视达教程资源搜索</h1>
      <div class="app-header-input">
        <Input @getPlay="getPlay"/>
      </div>
    </div>
  </div>
  <div class="app-video-list" >
    <div class="audioProject recommendClass" style="padding-top: 40px;">
      <div class="layout">
        <div class="audioTitle">
          <div class="titleh4">推荐教程</div>
          <a href="https://shida66.com/" target="_blank" class="titleMore">更多&gt;</a>
          <span class="rspan">共<b>10000+</b>套教程</span>
        </div>
        <div style="min-height: 200px;" v-loading="listLoading">
          <div class=" box_content">
            <div class="content_new">
               <ul class="list-2">
                 <div v-for="(it, i) in classList.list" :key="i" target="_blank">
                    <li class="video_item" @click="playCurVideo(it)">
                      <div class="c_img">
                          <img :src="it.img" class="lazy">
                          <div class="overlay">
                              <icon-play-circle style="color:#ddd; font-size: 40px;"/>
                          </div>
                      </div>
                      <div class="c_info">
                        <h6>
                            <span class="landmark ps">{{it.type}}</span><span class="caption">{{it.title}}</span>
                        </h6>
                        <div class="statistics">
                            <span>{{it.intro}}</span>
                        </div>
                    </div>
                    </li>
                  </div>
                </ul>
              </div>
            </div>
          </div>
      </div>
  </div>
  </div>
</div>
</template>
<style scoped lang="less">
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
  .app-video-list{
    .audioTitle {
        margin-bottom: 30px;
        height: 24px;
        line-height: 24px;
        .titleh4 {
          display: inline-block;
          font-size: 24px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: rgba(51,51,51,1);
          line-height: 24px;
      }
      .titleMore {
        float: right;
        display: inline-block;
        width: 50px;
        height: 22px;
        border: 1px solid rgba(224,224,224,1);
        border-radius: 4px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(102,102,102,1);
        text-align: center;
        line-height: 20px;
        margin-top: 1px;
      }
      .rspan {
        float: right;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(102,102,102,1);
        margin-right: 16px;
    }
    }
    .content_new ul{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      li{
        width: 296px;
        display: inline-block;
        cursor: pointer;
      }
    }
  .video_item .c_img {
      width: 100%;
      height: 100%;
      border-radius: 6px 6px 0 0;
      background: #ccc;
      position: relative;
      overflow: hidden;
  }
  .video_item {
    .c_info{
      width: 100%;
      background: rgba(255,255,255,1);
      border-radius: 0 0 6px 6px;
      padding: 15px;
      h6 {
      width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      .caption {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51,51,51,1);
        line-height: 19px;
      }
      }
    }
    .c_img .overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 0;
      left: 0;
      border-radius: 6px 6px 0 0;
      -webkit-transition: all .3s ease-out;
      transition: all .3s ease-out;
      opacity: 0;
      background: #ccc;
      filter: alpha(opacity=0);
    }
    &:hover{
      box-shadow: 0 7px 13px 0 rgb(181 181 181 / 27%);
      border-radius: 0 0 6px 6px;
      .c_img .overlay {
        opacity: 1;
        background: rgba(0,0,0,.3);
      }
    }
  }
  .landmark {
      display: inline-block;
      padding: 0 4px;
      height: 18px;
      border-radius: 3px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(255,255,255,1);
      text-align: center;
      line-height: 18px;
      margin-right: 3px;
  }
  .ps {
    background: rgba(0,174,255,1);
  }
  li {
      color: #333;
      background-color: transparent;
      text-decoration: none;
      -webkit-transition: all .2s;
      transition: all .2s;
    }
  }
}
.app-header-box{
  background-image: url(https://pic4.zhimg.com/v2-533002f6b59fd769aada9c3ff873a437_r.jpg);
}
</style>