<template>
  <div class="container">
    <div class="main">
      <div class="input-box">
        <h1>百万字体24小时自助全网搜索下载</h1>
        <Input placeholder="第一步：输入字体名后 点击后面的搜索按钮" btnText="搜索字体" @getPlay="getFonts"/>
      </div>
      <div class="text-input-yulan" v-if="fontState.fonts?.length">
        <Input placeholder="第二步：可以输入需要预览的文字进行对照" btnText="预览字体" @getPlay="previewFonts"/>
      </div>
      <ul class="font-box">
        <li v-for="(item,index) in fontState.fonts" :key="index" class="font-item">
          <div class="flex align-center jc-between">
            <p>{{ item.family }}、{{ item.font_style }}</p>
            <a-button type="outline" size="mini" @click="handleDownFont(item)">下载{{ item.file_type }}</a-button>
          </div>
          <img v-if="item.image" :src="'data:image/png;base64,' + item.image"/>
          <span v-else>---暂无预览图---</span>
        </li>
      </ul>
      <div class="pagination">
        <a-pagination v-if="fontState.total" :current="fontState.current" :total="fontState.total" size="large" :page-size="10" @change="pageChange"/>
      </div>
    </div>

    <s-dialog :visible="fontState.visible" width="30%" :title="fontState?.currentFontObj?.family"
      @close="fontState.visible = false">
      <div v-if="fontState.currentFontObj">
        <!-- <div>字体名称：{{ fontState.currentFontObj.family }}</div> -->
        <div>
          预览图：
          <img v-if="fontState.currentFontObj.image" :src="'data:image/png;base64,' + fontState.currentFontObj.image"/>
        </div>

        <div class="flex" style="margin-top: 20px;text-align: right;">
          <a-input placeholder="请输入淘宝购买的兑换码" button-text="确认无疑，开始下载" v-model="fontState.code" search-button></a-input>
          <a-button @click="downFile" type="primary" :loading="fontState.loading">确认无疑，开始下载</a-button>
        </div>
        <div class="tips">Tips: 兑换码需在淘宝购买，24小时自动发，无需人工，每次下载都需兑换码</div>
      </div>
    </s-dialog>

  </div>
</template>
<script setup>
import Input from '@/components/Input/index.vue'
import { getFontsByName, getFontBase64, downloadFile } from '@/api/font/index.js'
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
  loading: false
})

const getFontImage = (text, fontIds) => {
  getFontBase64({
    text,
    fontIds,
  }).then(res => {
    console.log(res);
    res.data.forEach((item,index) => {
      fontState.fonts[index].image = item.font_image
    });
  })
}

const searchFonts = () => {
  getFontsByName({
    fontName: fontState.currentFont,
    page: fontState.current,
    pageSize: 10
  }).then(res => {
    fontState.fonts = res.data.list
    fontState.total = res.data.total
    // getFontImage(fontState.fonts.map(font => font.font_id))
  })
}

const getFonts = (font) => {
  fontState.currentFont = font.value
  searchFonts()
}

const previewFonts = (text) => {
  getFontImage(text.value, fontState.fonts.map(font => font.font_id))
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
    code: fontState.code
  }).then(res => {
    fontState.loading = false
    if(res?.data?.psd) {
      window.open(res.data.psd)
    }else {
      Message.error('下载失败，可以联系客服解决！')
    }
  }).catch(err => {
    fontState.loading = false
  })
}

const handleDownFont = (font) => {
  fontState.currentFontObj = font
  fontState.visible = true
}
</script>
<style lang="less" scoped>
.container{
  width: 100vw;
  height: 100vh;
  .main{
    // width: 40%;
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
      padding: 4px 10px;
      background: #fff;
      &:hover{
        border: 1px solid #165dff;
      }
    }
    .pagination{
      background: #fff;
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
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
    color: red;
    margin-top: 12px;
    font-size: 10px;
  }
</style>