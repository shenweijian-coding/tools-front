<template>
  <div class="shop-img">
    <h1 class="app-heade-title">赞助/小程序观看广告都可获取积分</h1>
  </div>
  <div class="shop-box" v-loading="loading">
    <template v-if="userStore._id">
      <a-radio-group v-model="checkedValue">
        <template v-for="item in goodList" :key="item">
          <a-radio :value="item">
            <template #radio="{ checked }">
              <a-space align="start" class="custom-radio-card" :class="{ 'custom-radio-card-checked': checked }">
                <div>
                  <div className="custom-radio-card-title">
                    {{ item.title }}
                  </div>
                </div>
              </a-space>
            </template>
          </a-radio>
        </template>
      </a-radio-group>
      <div class="shop-action">
          <a-alert :show-icon="false">详情：{{ checkedValue.desc }}</a-alert></span>
          <span class="order-amount" v-if="checkedValue.price">￥{{ checkedValue.price }}</span>
          <span style="text-decoration:line-through;">￥{{ checkedValue.price * 2 }}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a-button type="primary" style="width: 200px;" @click="spon">立即赞助</a-button>
        </span>
      </div>
    </template>
    <div v-else style="margin: auto;">
      <a-empty description="请先登录哈" />
    </div>
    <sponDialog :orderInfo="orderInfo" :visible="visible" :payStatus="payStatus" @close="close"></sponDialog>
  </div>
  <tips v-if="userStore._id"></tips>
</template>
<script setup lang="ts">
import { getGoodList } from '@api/home';
import sponDialog from './sponDialog.vue'
import { createInvoice, checkInvoice } from '@api/home'
import { useUserStore } from '@/store';
import { Message } from '@arco-design/web-vue';
import tips from './tips.vue'
const userStore = useUserStore()

const goodList = ref([])
const loading = ref(false)
const checkedValue = ref({})
const visible = ref(false)
const orderInfo = ref({})
const timer = ref(0)
const payStatus = ref('待扫码')

const getList = async () => {
  if (!userStore._id) {
    return
  }
  loading.value = true
  const res = await getGoodList()
  goodList.value = res.data
  checkedValue.value = goodList.value[0]
  loading.value = false
}

const pollOrderStatus = (tradeNo: any) => {
  checkInvoice({ tradeNo: tradeNo }).then(res => {
    console.log(res);
    if (res.data === 1) {
      clearInterval(timer.value)
      Message.success('赞助成功,感谢您的支持')
      close()
    } else if (res.data === -1) {
      Message.success('已扫码,等待支付···')
      payStatus.value = '待支付'
    }
  })
}

const spon = async () => {
  loading.value = true
  const id = checkedValue.value.id
  if (!id) { return }
  const res = await createInvoice({ id })
  orderInfo.value = res.data
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
.arco-radio {
  margin-bottom: 12px;
}

.shop-img {
  background-image: url(https://pic4.zhimg.com/v2-ab400c5e44000df0658c6500e2e20d0f_r.jpg?source=1940ef5c);
  width: 80%;
  height: 280px;
  margin: 24px auto 0;
  border-radius: 8px;
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
}

.shop-box {
  display: flex;
  min-height: 300px;
  width: 74%;
  box-sizing: border-box;
  padding: 20px 40px 20px 40px;
  background-color: #fff;
  position: relative;
  margin: -136px auto 0;
  background-color: hsla(0, 0%, 100%, .78);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  -webkit-box-shadow: 0 8px 20px 0 rgb(0 0 0 / 6%);
  box-shadow: 0 8px 20px 0 rgb(0 0 0 / 6%);
  flex-direction: column;
  justify-content: space-between;

  .shop-action {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .good-item {
    width: 160px;
    height: 80px;
    margin-left: 30px;
  }

  .order-amount {
    font-size: 16px;
    color: #d64244;
    font-weight: 500;
  }

  .custom-radio-card-mask {
    height: 14px;
    width: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    border: 1px solid var(--color-border-2);
    box-sizing: border-box;
  }

  .custom-radio-card-mask-dot {
    width: 8px;
    height: 8px;
    border-radius: 100%;
  }

  .custom-radio-card-title {
    color: var(--color-text-1);
    font-size: 14px;
    // font-weight: bold;
  }

  .custom-radio-card {
    padding: 10px 16px;
    border-radius: 4px;
    box-sizing: border-box;
    background-color: rgb(248, 248, 248);
    border: 1px solid rgb(236, 236, 236);
    text-align: center;
  }

  .custom-radio-card:hover,
  .custom-radio-card-checked,
  .custom-radio-card:hover .custom-radio-card-mask,
  .custom-radio-card-checked .custom-radio-card-mask {
    border-color: rgb(var(--primary-6));
  }

  .custom-radio-card-checked {
    background-color: var(--color-primary-light-1);
  }

  .custom-radio-card:hover .custom-radio-card-title,
  .custom-radio-card-checked .custom-radio-card-title {
    color: rgb(var(--primary-6));
  }

  .custom-radio-card-checked .custom-radio-card-mask-dot {
    background-color: rgb(var(--primary-6));
  }
}
</style>
