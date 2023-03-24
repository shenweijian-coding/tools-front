<template>
  <s-dialog :visible="videoVisible" title="视频教程" width="70%">
    <video controls autoplay>
      <source src="http://cloud.video.taobao.com/play/u/null/p/1/e/6/t/1/402573635114.mp4" type="video/mp4">
    </video>
  </s-dialog>
</template>

<script setup>
import sDialog from '@/components/s-dialog/index.vue'

const props = defineProps({
  videoVisible: {
    type: Boolean
  }
})


</script>