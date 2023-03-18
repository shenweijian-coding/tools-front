<template>
  <s-dialog :visible="videoVisible" title="视频教程" width="70%">
    <video controls autoplay>
      <source src="https://gorilla.cdnja.co/v/51/51Lep.mp4?token=xk5zSzYGTpSG8uIuI8S_kQ&amp;expires=1679098807" type="video/mp4">
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