<script setup>
import Input from '@/components/Input/index.vue'
import { getPngUrl } from '@api/sucai/index'
const loading = ref(false)
const href = ref('')
let link = ''
const options = reactive({
  list: []
})
const getDownUrl = async (url) => {
  try {
    loading.value = true
    console.log(url.value);
    link = url.value
    const res = await getPngUrl({ url: url.value })
    // console.log(res.data.options);
    // console.log(res.data.result);
    if(res.data.result) {
      if(res.data.options) {
        options.list = res.data.options
        console.log(res.data.options);
      } else {
        href.value = res.data.psd
      }
    }

  } catch (error) {
    
  } finally {
    loading.value = false
  }

}
const getCurDownUrl = async(item) => {
  try {
    console.log('点击了', toRaw(item));
    // loading.value = true
    // debugger
    const res = await getPngUrl({
      url: link,
      option: toRaw(item)
    })
    if(res.data.result) {
      window.open(res.data.psd)
    }
    console.log(res);
  } catch (error) {
    
  } finally {
    // loading.value = false
  }
}
</script>

<template>
  <Input @getPlay="getDownUrl" :loading="loading"/>
  <a :href="href" v-if="href">
    <a-button class="mt-4" type="primary">立即下载</a-button>
  </a>
  <span v-if="options.list.length">
    <a-button v-for="(item,i) in options.list" :key="i" class="mt-4" type="primary" @click="getCurDownUrl(item)">{{item.text}}</a-button>
  </span>
</template>