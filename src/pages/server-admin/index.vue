<template>
<div style="background: #fff">
     <a-form :model="form" auto-label-width>
   <template v-for="(web,index) of form.info">     
    <span>站点名称：{{webSiteMap[web.id]}}</span>
    <a-form-item v-for="(cookie,i) in web.cookie" :field="`cookie.${index}.value`" :label="`cookie${i + 1}`">
        <a-input v-model="cookie.value" :style="{width:'680px'}"/>
        <span>过期时间：{{timeConvert(cookie.t) || '暂无'}}</span>
        <a-button type="primary" @click="action(web.id, cookie.id, cookie.value, 1)">保存</a-button>
        <!-- <a-button type="outline" status="danger" @click="action(web.id, i, 2)">删除</a-button> -->
    </a-form-item>
    <!-- <a-button :style="{width:'60px'}" type="primary" @click="handleAdd(index)">新增</a-button> -->
   </template>
  </a-form> 
</div>
</template>
<script setup>
import { webSiteMap } from '@/data-map/index.js'
import { getCookies, saveCookies } from '@/api/cookie/index.js'
import { timeConvert } from '@/utils/index'
import { Message } from '@arco-design/web-vue';

const form = reactive({
  info: []
})
getCookies().then(res => {
  console.log(res, 'res');
  form.info = res.data
})

const action = async (webId, i, value, type) => {
  const params = {
    webId: webId,
    index: i,
    type: type,
    value: value
  }
  const res = await saveCookies(params)
  console.log(res, 'res');
  if (res) {
    Message.success(res.data)
    window.location.reload()
  }
}
const handleAdd = (i) => {
  form.info[i].cookie.push({
    value: '',
    t: ''
  })
}
</script>