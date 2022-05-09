<script setup lang="ts">
import HLSCore from '@cloudgeek/playcore-hls'
import { getPlayUrl } from '@api/play'
import { Message } from '@arco-design/web-vue';
import useLoading from '../../hooks/loading'

const { loading, setLoading } = useLoading();

  const videoSource =  [{
    src: '',
    resolution: 360,
  }]
  const cover = ref("https://cn.vuejs.org/images/logo.svg")
  const title = ref("vue")
  const url = ref()
  const getPlay = async () => {
    setLoading(true)
    if(!url.value) {
      Message.warning('Url不能为空！')
      return
    }
    try {
      const res = await getPlayUrl({ url: url.value })
      Message.success('success')
      console.log(res, 'res');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }
</script>
<template>
  <div class="container mx-auto px-60 mt-6 w-full h-full">
    <div for="" class="text-3xl text-center mb-4">vue3+vite</div>
    <vue3-video-player :core="HLSCore" :cover="cover" :src="videoSource" :title="title"></vue3-video-player>
    <div class="mt-4">
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