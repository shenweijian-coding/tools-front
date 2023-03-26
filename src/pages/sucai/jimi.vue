<template>
  <s-dialog :visible="visible" title="云端解析下载中，请耐心等待加载完成，根据文件大小情况而定" width="44%" @close="close">
    <div class="flex">
      <img v-if="info.image" :src="info.image" alt="图片" style="width: 140px">
      <div class="ml-m" v-if="info.title">
        <div style="max-width: 300px">素材标题：<span>{{ info.title }}</span></div>
        <div class="mt-l" v-if="info.file_size">文件大小：<span>{{ info.file_size }}</span></div>
        <div class="mt-l" v-if="info.extension">文件类型：<span>{{ info.extension }}</span></div>
        <div class="mt-l" v-if="info.path">
          <a :href="info.path" target="_blank" referrerpolicy="no-referrer">
            <a-button type="primary">点我 立即下载</a-button>
          </a>
        </div>
      </div>
      <div class="ml-m align-center flex flex-col jc-center">
        <a-progress type="circle" :percent="info.progress / 100" size="large" />
        <div class="mt-m ">云端下载进度 请等待</div>
      </div>
    </div>
  </s-dialog>
</template>

<script setup>
import sDialog from '@/components/s-dialog/index.vue'
import { getJimiInfoApi } from '@/api/sucai/index'
const emit = defineEmits(['close'])
const props = defineProps({
  visible: {
    type: Boolean,
  },
  file: {
    type: String
  },
  url: {
    type: String
  }
})

const info = reactive({
  "title": "",
  "image": "",
  "file_size": "",
  "extension": "",
  "progress": 0,
  "path": "",
})


let timer = setInterval(async () => {
  const res = await getJimiInfo()
  if (res.data) {
    info.title = res.data.title
    info.image = res.data.image
    info.file_size = res.data.file_size
    info.extension = res.data.extension
    info.progress = res.data.progress
    if (res.data.status == 1) {
      info.path = res.data.path
      clearInterval(timer)
    }
  } else {
    clearInterval(timer)
  }
}, 3000);


const getJimiInfo = async () => {
  const res = await getJimiInfoApi(props.file, props.url)
  return res
}
const close = () => {
  emit('close')
}
</script>