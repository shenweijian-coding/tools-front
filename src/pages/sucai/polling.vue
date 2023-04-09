<template>
  <s-dialog :visible="visible" title="云端下载中" width="40%" @close="close">
    <div class="flex jc-center">
      <!-- <img v-if="info.image" :src="info.image" alt="图片" style="width: 140px"> -->
      <!-- <div class="ml-m" v-if="info.title">
        <div style="max-width: 300px">素材标题：<span>{{ info.title }}</span></div>
        <div class="mt-l" v-if="info.file_size">文件大小：<span>{{ info.file_size }}</span></div>
        <div class="mt-l" v-if="info.extension">文件类型：<span>{{ info.extension }}</span></div>
      </div> -->
      <div class="ml-m align-center flex flex-col jc-center">
        <a-progress type="circle" :percent="info.progress / 100" size="large" />
        <div class="mt-l">部分网站使用云端下载，待云端下载完成，您即可开始下载，请耐心等待！</div>
        <div class="mt-l" v-if="info.path">
          <a-button @click="copyUrl(info.path)" class="mr-2">复制下载链接</a-button>&nbsp;
          <a :href="info.path" target="_blank" referrerpolicy="no-referrer">
            <a-button type="primary">立即下载</a-button>
          </a>
        </div>
      </div>
    </div>
  </s-dialog>
</template>

<script setup>
import sDialog from '@/components/s-dialog/index.vue'
import { getPathByfile } from '@/api/sucai/index'
const emit = defineEmits(['close', 'complete'])
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
  const res = await pollingInfo()
  if (res.data) {
    info.title = res.data.title
    // info.image = res.data.image
    // info.file_size = res.data.file_size
    // info.extension = res.data.extension
    info.progress = res.data.progress
    if (res.data.link && res.data.progress == 100) {
      emit('complete', res.data.link)
      info.path = res.data.link
      clearInterval(timer)
    }
  } else {
    clearInterval(timer)
  }
}, 1500);


const pollingInfo = async () => {
  const res = await getPathByfile(props.file, props.url)
  return res
}
const close = () => {
  clearInterval(timer)
  emit('close')
}

const copyUrl = (copyText) => {
  var textareaC = document.createElement('textarea');
  textareaC.setAttribute('readonly', 'readonly'); //设置只读属性防止手机上弹出软键盘
  textareaC.value = copyText;
  document.body.appendChild(textareaC); //将textarea添加为body子元素
  textareaC.select();
  var res = document.execCommand('copy');
  document.body.removeChild(textareaC);//移除DOM元素
  Message.success('复制成功！');
}
</script>