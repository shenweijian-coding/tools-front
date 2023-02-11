<template>
  <div v-loading="loading">
    <a-form :model="webConfig" auto-label-width>
      <a-form-item label="公告">
        <a-input v-model="webConfig.notice" placeholder="公告内容，有内容时自动展示弹窗，支持html"></a-input>
      </a-form-item>
      <a-form-item label="背景图">
        <a-input v-model="webConfig.bgImg" placeholder="网站背景图，节省服务器访问资源，复制图床链接即可"></a-input>
      </a-form-item>
      <a-form-item label="底部配置">
        <a-input v-model="webConfig.footer" placeholder="网站底部内容，支持html"></a-input>
      </a-form-item>
      <a-form-item label="首页banner">
        <div class="flex flex-col w-100">
          <div class="flex">
            <a-input class="w-2" v-model="webConfig.banner[0].img" placeholder="banner1图地址"></a-input>
            <a-input class="w-2 ml-m" v-model="webConfig.banner[0].url" placeholder="banner1跳转地址，默认为当前页"></a-input>
          </div>
          <div class="flex mt-m">
            <a-input class="w-2" v-model="webConfig.banner[1].img" placeholder="banner2图地址"></a-input>
            <a-input class="w-2 ml-m" v-model="webConfig.banner[1].url" placeholder="banner2跳转地址，默认为当前页"></a-input>
          </div>
          <div class="flex mt-m">
            <a-input class="w-2" v-model="webConfig.banner[2].img" placeholder="banner3图地址"></a-input>
            <a-input class="w-2 ml-m" v-model="webConfig.banner[2].url" placeholder="banner3跳转地址，默认为当前页"></a-input>
          </div>
        </div>
      </a-form-item>
      
      <a-form-item label="卡密获取地址">
        <a-input class="w-2" v-model="webConfig.carmiAddress" placeholder="有卡密获取地址，会显示卡密入口点击可跳转，没有则不显示（如淘宝店铺、第三方发卡平台等）"></a-input>
      </a-form-item>
      <a-form-item label="包图登录IP" class="w-2" >
        <a-input v-model="webConfig.baotuIp" placeholder="包图账号登录机器的IP地址，防止包图下载验证，解析失败"></a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="save">保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { saveWebConfig, getWebConfig } from '@/api/admin/index.js'
import { Message } from '@arco-design/web-vue';
const loading = ref(false)
let webConfig = reactive({
  notice: '',
  footer: '',
  bgImg: '',
  banner: [{ img: '', url: '' }, { img: '', url: '' }, { img: '', url: '' }],
  baotuIp: '',
  carmiAddress: '',
  _id: ''
})

const save = async () => {
  try {
    loading.value = true
    webConfig._id || delete webConfig._id
    const res = await saveWebConfig(webConfig)
    Message.success('保存成功')
    getConfig()
  } catch (error) {
    
  } finally {
    loading.value = false
  }
}

const getConfig = async () => {
  try {
    loading.value = true
    const res = await getWebConfig()
    if(res.data) {
      webConfig.notice = res.data.notice || ''
      webConfig.footer = res.data.footer || ''
      webConfig.bgImg = res.data.bgImg || ''
      webConfig.banner = res.data.banner
      webConfig.baotuIp = res.data.baotuIp || ''
      webConfig.carmiAddress = res.data.carmiAddress || ''
      webConfig._id = res.data._id || ''
    }
  } catch (error) {
    loading.value = false
  } finally {
  loading.value = false
  }
}
getConfig()
</script>