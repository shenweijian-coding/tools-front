<template>
  <div class="container flex">
    <div class="left">
      
    </div>
    <div class="main" v-loading="loading">
      <div class="input-box">
        <h1>百万字体24小时自助搜索下载</h1>
        <Input placeholder="输入字体名（尽可能全）， 点击后面的搜索按钮" btnText="搜索字体" @getPlay="getFonts"/>
      </div>
      <div class="text-input-yulan" v-if="fontState.fonts?.length">
        <a-input-search v-model="previewFont" placeholder="可以输入需要预览的文字进行对照" search-button @search="previewFonts" button-text="预览" allow-clear/>
      </div>
      <ul class="font-box mt-2">
        <li v-for="(item,index) in fontState.fonts" :key="index" class="font-item">
          <div>{{ item.family }}
            <a-tag color="purple" size="small">{{ item.font_style }}</a-tag>&nbsp;
            <a-tag color="#7816ff" size="small">{{ item.language }}</a-tag>&nbsp;
            <a-tag color="#0fc6c2" size="small">{{ item.file_type }}</a-tag>
          </div>
          <div class="flex align-center jc-between mt-2">
            <img v-if="item.image" :src="'data:image/png;base64,' + item.image"/>
            <img v-else src="https://www.qiuziti.com/image/common/def_preview.png"/>
            <a-button shape="round" @click="handleDownFont(item)">下载字体</a-button>
          </div>
        </li>
      </ul>
      <div class="pagination" v-if="fontState.total == 10">
        最多显示10条，请搜索具体的字体名称
        <!-- <a-pagination v-if="fontState.total" :current="fontState.current" :total="fontState.total" size="large" :page-size="10" @change="pageChange"/> -->
      </div>
    </div>
    <div class="right">
      <span v-if="fontState.codeInfo">当前卡号 {{ fontState.code }} 的字体下载记录，剩余下载次数 {{ fontState.codeInfo.num }}</span>
      <ul v-if="fontState.codeInfo" class="downlog">
        <li v-for="(item,i) in fontState.codeInfo.down_log">
          <span>{{i + 1}}、{{ item.font || '--' }}</span>
          <a-button size="mini" type="text" @click="againDown(item)">重新下载</a-button>
        </li>
      </ul>
    </div>
    <s-dialog :visible="fontState.visible" width="30%" :title="fontState?.currentFontObj?.family"
      @close="fontState.visible = false;fontState.loading = false">
      <div v-if="fontState.currentFontObj">
        <!-- <div>字体名称：{{ fontState.currentFontObj.family }}</div> -->
        <div>
          <div class="mb-2">预览图</div>
          <img v-if="fontState.currentFontObj.image" :src="'data:image/png;base64,' + fontState.currentFontObj.image"/>
          <img v-else src="https://www.qiuziti.com/image/common/def_preview.png"/>
        </div>

        <div class="flex" style="margin-top: 20px;text-align: right;">
          <a-input placeholder="请输入淘宝购买的兑换码" button-text="开始下载" v-model="fontState.code" search-button></a-input>
          <a-button @click="downFile" type="primary" :loading="fontState.loading">开始下载</a-button>
        </div>
        <div class="tips mt-2">Tips: 兑换码需在淘宝购买，24小时自动发，无需人工，每次下载都需兑换码</div>
      </div>
    </s-dialog>

  </div>
</template>
<script setup>
import Input from '@/components/Input/index.vue'
import { getFontsByName, getFontBase64, downloadFile, getCodeInfo } from '@/api/font/index.js'
import sDialog from '@/components/s-dialog/index.vue'
import { Message } from '@arco-design/web-vue';

const fontState = reactive({
  currentFont: '',
  fonts: [],
  total: 0,
  current: 1,
  visible: false,
  currentFontObj: null,
  code: '',
  loading: false,
  codeInfo: null
})
const loading = ref(false)
const previewFont = ref('')

const getFontImage = (text, fontIds) => {
  getFontBase64({
    text,
    fontIds,
  }).then(res => {
    console.log(res);
    res.data.forEach((item,index) => {
      fontState.fonts[index].image = item.font_image.trim()
    });
  })
}

const searchFonts = () => {
  previewFont.value = ''
  loading.value = true
  getFontsByName({
    fontName: fontState.currentFont,
    page: fontState.current,
    pageSize: 10
  }).then(res => {
    fontState.fonts = res.data.list
    fontState.total = res.data.total
    loading.value = false
    // getFontImage(fontState.fonts.map(font => font.font_id))
  }).catch(err => {
    loading.value = false
  })
}

const getFonts = (font) => {
  fontState.current = 1
  fontState.currentFont = font.value
  searchFonts()
}

const previewFonts = () => {
  getFontImage(previewFont.value, fontState.fonts.map(font => font.font_id))
}

const pageChange = (page) => {
  fontState.current = page
  searchFonts()
}

const downFile = () => {
  
  if(!fontState.code) {
    Message.error('请输入淘宝购买的兑换码')
    return
  }

  fontState.loading = true
  downloadFile({
    id: fontState.currentFontObj.font_id,
    code: fontState.code,
    font: fontState.currentFontObj.font_name
  }).then(res => {
    window.localStorage.setItem('fontCode', fontState.code)
    fontState.loading = false
    if(res?.data?.psd) {
      window.open(res.data.psd)
      getCodeDownList()
    }else {
      Message.error('下载失败，可以联系客服解决！')
    }
  }).catch(err => {
    window.localStorage.setItem('fontCode', fontState.code)
    fontState.loading = false
  })
}

const handleDownFont = (font) => {
  fontState.currentFontObj = font
  fontState.visible = true
}
const getCodeDownList = () => {
  getCodeInfo({code: fontState.code}).then(res => {
    fontState.codeInfo = res.data
  })
}
const againDown = (font) => {
  if(!font.id) {
    return
  }
  downloadFile({
    id: font.id,
    code: fontState.code,
    font: font.font,
  }).then(res => {
    if(res?.data?.psd) {
      window.open(res.data.psd)
    }else {
      Message.error('下载失败，可以联系客服解决！')
    }
  })
}
onMounted(() => {
  fontState.code = window.localStorage.getItem('fontCode') || ''
  if(fontState.code) {
    getCodeDownList()
  }
})
</script>
<style lang="less" scoped>
.container{
  width: 100vw;
  height: 100vh;
  .main{
    width: 55%;
    max-width: 600px;
    margin: 0 auto;
    height:100%;
    .text-input-yulan{
      margin-bottom: 10px;
    }
    .font-box{
      max-height: 70%;
      overflow-y: auto;
    }
    .font-item{
      border: 1px solid #f5f5f5;
      padding: 10px;
      background: #fff;
      &:hover{
        border: 1px solid purple;
      }
    }
    .pagination{
      background: #fff;
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
  }
  .left{
    width: 20%;
  }
  .right{
    // padding: 30px;
    width: 20%;
  }
}
  .input-box{
    h1 {
      margin-top: 0;
      padding-top: 20px;
    }

    text-align: center;
    margin-bottom: 20px;
  }
  .tips{
    color: gray;
    // font-weight: bold;
    margin-top: 12px;
    font-size: 12px;
  }
  .downlog{
    // border: 1px solid #f5f5f5;
    padding: 4px;
    li{
      margin: 4px 0;
    }
  }
</style>