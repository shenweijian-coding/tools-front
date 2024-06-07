<template>
    <div class="proxy-box">
      <a-tabs :active-key="state.activeTab" type="card-gutter" size="large" @change="tabChange">
       <a-tab-pane key="1" title="卡密管理">
         <codeMange @getUserInfo="getUserInfo" ref="codeInfoRef"></codeMange>
       </a-tab-pane>
       <a-tab-pane key="4" title="用户管理">
         <userInfo ref="userInfoRef"></userInfo>
       </a-tab-pane>
       <a-tab-pane key="2" title="卡密生成">
         <createCode></createCode>
       </a-tab-pane>
       <a-tab-pane key="3" title="余额充值">
        <div class="p-l">
          <div>当前余额（元）：<span class="text-bold text-blue">{{balance.$numberDecimal}}</span></div>
          <!-- <div class="flex mt-10 align-center">支付宝充值：<a-input-number placeholder="请输入金额" style="width: 300px" v-model="payInfo.money"></a-input-number>
            <a-button type="primary" class="ml-m" @click="submitPay">确认充值</a-button>
          </div> -->
        </div>
       </a-tab-pane>
      <!-- <a-tab-pane key="4" title="资金记录">
        Content of Tab Panel 2
      </a-tab-pane> -->
      <a-tab-pane key="5" title="网站设置">
        <div class="ml-2 mb-2 text-bold">3张banner图配置</div>
        <div class="flex flex-col w-100">
          <div class="flex">
            <a-input class="" v-model="state.banner[0].img" placeholder="banner1图地址"></a-input>
            <a-input class=" ml-m" v-model="state.banner[0].url" placeholder="banner1跳转地址，默认为当前页"></a-input>
          </div>
          <div class="flex mt-m">
            <a-input class="" v-model="state.banner[1].img" placeholder="banner2图地址"></a-input>
            <a-input class=" ml-m" v-model="state.banner[1].url" placeholder="banner2跳转地址，默认为当前页"></a-input>
          </div>
          <div class="flex mt-m">
            <a-input class="" v-model="state.banner[2].img" placeholder="banner3图地址"></a-input>
            <a-input class=" ml-m" v-model="state.banner[2].url" placeholder="banner3跳转地址，默认为当前页"></a-input>
          </div>
        </div>
        <div class="my-4"></div>
        <div class="ml-2 mb-2 text-bold">网站底部配置</div>
        <a-input placeholder="网站底部的footer" v-model="state.footer"></a-input>
        <div class="my-4"></div>
        <div class="ml-2 mb-2 text-bold">网站公告配置</div>
        <a-input placeholder="网站公告，中间红字" v-model="state.notice"></a-input>
        <div class="my-4"></div>
        <div class="ml-2 mb-2 text-bold">网站背景</div>
        <a-input placeholder="网站背景，仅支持输入URL，网上找图" v-model="state.bgImg"></a-input>
        <div class="my-4"></div>
        <div class="ml-2 mb-2 text-bold">淘宝购买地址</div>
        <a-input placeholder="淘宝链接，用户无权限时会提示" v-model="state.carmiAddress"></a-input>
        <div class="my-4"></div>
        <div class="ml-2 mb-2 text-bold">网站logo</div>
        <a-input placeholder="网站logo、显示左上角" v-model="state.logo"></a-input>
        <a-button type="primary my-2" @click="saveConfig">保存配置</a-button>
      </a-tab-pane>
     </a-tabs>
    </div>
</template>

<script setup>
import createCode from './components/createCode.vue'
import codeMange from './components/codeMange.vue'
import userInfo from './components/userInfo.vue'
import { reactive } from 'vue';
import { Message } from '@arco-design/web-vue';
import { getBalance, saveBanner } from '@api/admin/proxy.js'

const userInfoRef = ref(null)
const codeInfoRef = ref(null)
const payInfo = reactive({
  money: 1,
})
const balance = ref(0)

const state = reactive({
  activeTab: '1',
  banner: [{ img: '', url: '' }, { img: '', url: '' }, { img: '', url: '' }],
  logo: '',
  notice: '',
  footer: '',
  bgImg: '',
  carmiAddress: ''
})
const submitPay = () => {
  if(!payInfo.money) {
    Message.warning('请填写充值金额')
    return
  }
  
}

const handleGetBalance = () => {
  getBalance().then(res => {
    console.log(res);
    balance.value = res.data.balance
    state.banner = res.data.banner
    state.logo = res.data.logo
    state.notice = res.data.notice
    state.bgImg = res.data.bgImg
    state.footer = res.data.footer
    state.carmiAddress = res.data.carmiAddress
  })
}
const tabChange = (tab) =>{
  state.activeTab = tab
  if(tab == 3 || tab == 5) {
    handleGetBalance()
  } else if(tab == 1) {
    codeInfoRef.value.getTableData()
  }
}
const saveConfig = () => {
  saveBanner({ banner: state.banner,logo: state.logo, notice: state.notice, footer: state.footer, bgImg: state.bgImg, carmiAddress: state.carmiAddress }).then(res => {
    Message.success('操作成功')
  })
}
const getUserInfo = (code) => {
  state.activeTab = '4'
  // setTimeout(() => {
    userInfoRef.value && userInfoRef.value.fastSearch(code)
  // }, 1000);
}
</script>

<style lang="less" scoped>
.proxy-box {
  display: flex;
  width: 60%;
  box-sizing: border-box;
  padding: 1.25rem 2.5rem 1.25rem 2.5rem;
  background-color: #fff;
  position: relative;
  margin: 20px auto 0;
  backdrop-filter: blur(.625rem);
  border-radius: .2rem;
  flex-direction: column;
  justify-content: space-between;
}
</style>