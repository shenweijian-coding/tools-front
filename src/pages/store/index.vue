<template>
  <div class="shop-box">
    <div class="text-l text-bold">充值方式一</div>
    <a-divider />
    <div class="">
      <a-input placeholder="请输入卡密：XXXX-XXXX-XXXX" style="width: 40%;" v-model="code"></a-input>
      <a-button type="primary" @click="active" class="ml-m" :disabled="!code">激活</a-button>
    </div>
    <div class="mt-m">
      <p class="code-tips">卡密说明：激活成功后立即失效，无法重复使用；卡密兑现的积分可以进行累加,不会重置；</p>
    </div>
  </div>

  <div class="shop-box" v-loading="loading" v-if="goodInfo.goodList.length">
    <div class="text-l text-bold">充值方式二</div>
    <a-divider />
    <div class="">
      <a-select :style="{width:'40%'}" placeholder="请选择充值类型" @change="goodChange">
        <a-option v-for="o in goodInfo.goodList" :value="o.pid" :key="o.pid">{{ o.name }} -- {{ o.price }}元</a-option>
      </a-select>
      <div class="mt-m">
        <p class="code-tips" v-if="goodInfo.currentGood.desc">详情：{{ goodInfo.currentGood.desc }}</p>
      </div>
      <a-button type="primary" @click="spon" class="ml-m pay-btn" :disabled="!goodInfo.currentGood.pid">立即支付</a-button>
    </div>
    <sponDialog :payInfo="payInfo" :visible="visible" :payStatus="payStatus" @close="close"></sponDialog>
  </div>
  <!-- <tips></tips> -->
</template>
<script setup>
import { getGoodList } from '@api/home';
import sponDialog from './sponDialog.vue'
import { createInvoice, checkInvoice } from '@api/home'
import { useUserStore } from '@/store';
import { Message } from '@arco-design/web-vue';
import tips from './tips.vue'
import { codeConvert } from '@api/user'
const userStore = useUserStore()

const loading = ref(false)
const visible = ref(false)
const payInfo = ref({})
const timer = ref(0)
const payStatus = ref('待扫码')
const code = ref('')

const goodInfo = reactive({
  goodList: [],
  currentGood: {}
})

const active = async () => {
  try {
    if (!code.value) {
      Message.warning('请输入卡密')
      return
    }
    const res = await codeConvert({
      code: code.value
    })
    if (res.data) {
      Message.success(res.data)
      userStore.getUserNum()
    }
  } catch (error) {

  } finally {
    code.value = ''
  }
}

const goodChange = (val) => {
  goodInfo.currentGood = goodInfo.goodList.find(o => o.pid === val) || {}
}

const getList = async () => {
  try {    
    loading.value = true
    const res = await getGoodList()
    if(res.data.length) {
      res.data.sort((a,b) => a.sort - b.sort)
    }
    goodInfo.goodList = res.data
    loading.value = false
  } catch (error) {
    loading.value = false
  }
}

const pollOrderStatus = (tradeNo) => {
  checkInvoice({ tradeNo: tradeNo }).then(res => {
    console.log(res);
    if (res.data === 1) {
      clearInterval(timer.value)
      Message.success('充值成功')
      close()
    } else if (res.data === -1) {
      Message.success('已扫码,等待支付···')
      payStatus.value = '待支付'
    }
  })
}

const spon = async () => {
  if (!userStore._id) {
    Message.warning('请先进行登录')
    return
  }
  loading.value = true
  const pid = goodInfo.currentGood.pid
  if (!pid) { return }
  const res = await createInvoice({ pid })
  payInfo.value = res.data
  loading.value = false
  visible.value = true
  timer.value = window.setInterval(() => {
    pollOrderStatus(res.data.tradeNo)
  }, 6000)
}

const close = () => {
  visible.value = false
  clearInterval(timer.value)
}
getList()
</script>
<style lang="less" scoped>

.code-tips{
  line-height: 30px;
  font-size: 13px;
}

.shop-box {
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

  .order-amount {
    font-size: 1rem;
    color: #d64244;
    font-weight: 500;
  }
  .pay-btn{
    margin: 0 auto;
    padding: 0 100px;
  }
}
</style>
