<script setup>
import Input from '@/components/Input/index.vue'
import { getPngUrl, getInfo, checkInfo } from '@api/sucai/index'
import { Message, Modal } from '@arco-design/web-vue';
import CheckDialog from '@/components/check-dialog/index.vue'
const loading = ref(false)
const listLoading = ref(false)
const href = ref('')
const visible = ref(false)
const webList = reactive({
  list:[]
})
let link = ''
const options = reactive({
  list: []
})
listLoading.value = true
getInfo().then(res => {
  console.log(res)
  webList.list = res.data.webList
  listLoading.value = false
})
const getDownUrl = async (url) => {
  try {
    loading.value = true
    href.value = ''
    options.list = []
    console.log(url.value);
    link = url.value
    const res = await getPngUrl({ url: url.value })
    if(res.data.status && res.data.status === 1001) { // 校验状态
      visible.value = true
      return
    }
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
const checkCode = async(downCode) => {
  const { data } = await checkInfo({ code: downCode })
  if(data.result) {
    Message.success('校验成功！请重新点击搜索进行下载！')
    visible.value = false
  }
}
const close = () => {
  visible.value = false
}
</script>

<template>
<div class="page-design app-page appView">
  <div v-loading="loading">
    <div class="app-header-box">
      <h1 class="app-heade-title">设计资源搜索</h1>
      <h3 class="app-header-tips"></h3>
      <div class="app-header-input">
          <Input @getPlay="getDownUrl" :loading="loading"/>
          <a :href="href" v-if="href" target="_blank" referrerpolicy="no-referrer">
            <a-button class="mt-4" type="primary">立即下载</a-button>
          </a>
          <span v-if="options.list.length">
          <a-space class="mt-4">
            <a-button v-for="(item,i) in options.list" :key="i" type="dashed" status="success" @click="getCurDownUrl(item)">{{item.text}}</a-button>
          </a-space>
          </span>
      </div>
    </div>
    <div class="app-web-list" v-loading="listLoading">
      <a-row>
        <a-col :xs="12" :sm="12" :md="8" :lg="6" :xl="6" v-for="it in webList.list" :key="it.id">
        <a :href="it.webUrl" target="_blank">
          <div class="app-weblist-item shou">
            <div class="item-logo"><img :src="it.webLogo"></div> 
            <div class="item-info"><div class="title">{{it.webName}}</div> 
            <div class="tips">{{it.webTips}}</div></div></div>
        </a>
        </a-col>
      </a-row>
    </div>
  </div>
  <CheckDialog :visible="visible" @checkCode="checkCode" @close="close"/>
</div>
</template>

<style lang="less" scoped>
.app-page {
  width: 95%;
  max-width: 1300px;
  margin: 24px auto auto;
    .app-header-box{
      display: block;
      border-radius: 8px;
      height: 420px;
      background-color: #d3ddee;
      -webkit-box-shadow: 0 0 10px 0 rgb(0 0 0 / 24%);
      box-shadow: 0 0 10px 0 rgb(0 0 0 / 24%);
      text-shadow: 0 0 10px rgb(0 0 82 / 0%);
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: cover;
      text-align: center;
      .app-heade-title {
        color: #f0f1f5;
        font-size: 28px;
        padding: 60px 0 8px;
      }
      .app-header-tips {
        color: hsla(0,0%,100%,.6);
        font-size: 14px;
        margin-bottom: 48px;
      }
      .app-header-input{
        width: 96%;
        margin: auto;
        max-width: 650px;
      }
  }
  .app-web-list {
    padding: 16px 8px;
    background-color: hsla(0,0%,100%,.78);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    border-radius: 10px;
    width: 90%;
    max-width: 1400px;
    min-height: 200px;
    margin: auto;
    -webkit-box-shadow: 0 8px 20px 0 rgb(0 0 0 / 6%);
    box-shadow: 0 8px 20px 0 rgb(0 0 0 / 6%);
    overflow: hidden;
      .app-weblist-item {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        -webkit-transition: All .25s;
        transition: All .25s;
        &:hover {
          background-color: hsla(0,0%,95.3%,.6196078431372549);
          border-radius: 8px;
        }
      }
      .item-logo {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        overflow: hidden;
        background-color: #fff;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        img{
          width: 100%;
          height: 100%;
          padding: 4px;
          border-radius: 50%;
          border-color: rgba(76 175 80/15%);
          overflow: hidden;
          // width: 48px;
          -webkit-transition: All .25s;
          transition: All .25s;
        }
    }
    .item-info {
      padding: 0 16px;
      .tips {
        font-size: 12px;
        color: #9c9c9c;
        white-space: nowrap;
      }
    }
  }
}
.page-design .app-web-list {
    margin-top: -120px;
}
.app-header-box{
  background-image: url(https://pic1.zhimg.com/v2-f86bcbe20a5d485df169c6bbb402e030_r.jpg);
}
.shou {
    cursor: pointer;
}
</style>