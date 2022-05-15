<script setup>
import Input from '@/components/Input/index.vue'
import { getPngUrl } from '@api/sucai/index'
const loading = ref(false)
const href = ref('')
const getPlay = async (url) => {
  try {
    loading.value = true
    console.log(url.value);
    const res = await getPngUrl({ url: url.value })
    console.log(res);
    if(res.data.result) {
      href.value = res.data.psd
    }
  } catch (error) {
    
  } finally {
    loading.value = false
  }

}
</script>

<template>
  <Input @getPlay="getPlay" :loading="loading"/>
  <a :href="href" v-if="href">
    <a-button class="mt-4" type="primary">立即下载</a-button>
  </a>
</template>