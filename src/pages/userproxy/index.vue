<template>
    <div class="proxy-box">
      <a-tabs type="card-gutter" size="large" lazy-load>
       <a-tab-pane key="1" title="卡密管理">
         <codeMange></codeMange>
       </a-tab-pane>
       <a-tab-pane key="2" title="卡密生成">
         <createCode></createCode>
       </a-tab-pane>
       <a-tab-pane key="3" title="余额充值">
        <div class="p-l">
          <div>当前余额（元）：<span style="color:cornflowerblue">0</span></div>
          <div class="flex mt-10 align-center">支付宝充值：<a-input-number placeholder="请输入金额" style="width: 300px" v-model="payInfo.money"></a-input-number>
            <a-button type="primary" class="ml-m" @click="submitPay">确认充值</a-button>
          </div>
        </div>
       </a-tab-pane>
      <a-tab-pane key="4" title="资金记录">
        Content of Tab Panel 2
      </a-tab-pane>
      <a-tab-pane key="5" title="营销设置">
        Content of Tab Panel 2
      </a-tab-pane>
     </a-tabs>
    </div>
</template>

<script setup>
import createCode from './components/createCode.vue'
import codeMange from './components/codeMange.vue'
import { reactive } from 'vue';
import { Message } from '@arco-design/web-vue';

const payInfo = reactive({
  money: 1,
})

const submitPay = () => {
  if(!payInfo.money) {
    Message.warning('请填写充值金额')
    return
  }
  
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