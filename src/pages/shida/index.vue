<script setup lang="ts">
import { getPlayUrl } from '@api/play'
import { Message } from '@arco-design/web-vue';
import useLoading from '../../hooks/loading'
import { videoPlay } from 'vue3-video-play'

const { loading, setLoading } = useLoading();

  const options =  reactive({
  width: '800px', //播放器高度
  // height: '450px', //播放器高度
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
  const url = ref()
  const isDown = ref(false)
  const downParams = { vid: '', sid: '' }
  const getPlay = async () => {
    setLoading(true)
    if(!url.value) {
      Message.warning('Url不能为空！')
      return
    }
    try {
      const { data } = await getPlayUrl(false, { url: url.value })
      Message.success('success')
      console.log(data, 'res');
      options.poster = data.cover
      options.src = data.playUrl
      if(data.isDown) {
        isDown.value = data.isDown
        downParams.vid = data.vid
        downParams.sid = data.sid
      }
      // cover.value = res.cover
      // videoSource.src = res.url
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }
  const downFile = async () => {
      const { data } = await getPlayUrl(true, downParams)
      console.log(data);
      window.open()
  }
</script>
<template>
  <div class="container mx-auto px-60 mt-6 w-full h-full">
    <div for="" class="text-3xl text-center mb-4">vue3+vite</div>
    <!-- <videoPlay type="m3u8" v-bind="options" ></videoPlay> -->
    <div class="mt-4 text-center">
      <a-button type="outline" class="mb-2" @click="downFile">下载素材+课堂源文件</a-button>
      <a-input-search
        :loading="loading"
        placeholder="请复制链接"
        v-model="url"
        button-text="解析"
        search-button
        @search="getPlay"
        size="large"/>
    </div>
  </div>
</template>
<style>
@import 'vue3-video-play/dist/style.css';

</style>