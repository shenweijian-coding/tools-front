<template>
  <div class="shop-box" v-loading="loading">
    <a-radio-group v-model="checkedValue">
      <template v-for="item in goodList" :key="item.id">
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
      <span class="lg:flex hidden">
        <a-alert :show-icon="false">详情：{{ checkedValue.desc }}</a-alert>
      </span>
      <span>
        <span class="order-amount" v-if="checkedValue.price">￥{{ checkedValue.price }}</span>
        <span style="text-decoration:line-through;">￥{{ checkedValue.price * 2 }}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a-button type="primary" style="width: 12.5rem;" @click="spon">立即赞助</a-button>
      </span>
    </div>
    <sponDialog :orderInfo="orderInfo" :visible="visible" :payStatus="payStatus" @close="close"></sponDialog>
  </div>
  <tips></tips>
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
  // if (!userStore._id) {
  //   return
  // }
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
  if (!userStore._id) {
    Message.warning('请先进行登录')
    return
  }
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
  margin-bottom: .75rem;
}

.shop-img {
  background-image: url(https://pic4.zhimg.com/v2-ab400c5e44000df0658c6500e2e20d0f_r.jpg?source=1940ef5c);
  width: 80%;
  height: 17.5rem;
  margin: 1.5rem auto 0;
  border-radius: .5rem;
  background-color: #d3ddee;
  -webkit-box-shadow: 0 0 .625rem 0 rgb(0 0 0 / 24%);
  box-shadow: 0 0 .625rem 0 rgb(0 0 0 / 24%);
  text-shadow: 0 0 .625rem rgb(0 0 82 / 0%);
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: cover;
  text-align: center;

  .app-heade-title {
    color: #f0f1f5;
    font-size: 1.75rem;
    padding: 3.75rem 0 .5rem;
  }
}

.shop-box {
  display: flex;
  min-height: 18.75rem;
  width: 74%;
  box-sizing: border-box;
  padding: 1.25rem 2.5rem 1.25rem 2.5rem;
  background-color: #fff;
  position: relative;
  margin: 20px auto 0;
  background-color: hsla(0, 0%, 100%, .78);
  -webkit-backdrop-filter: blur(.625rem);
  backdrop-filter: blur(.625rem);
  border-radius: .625rem;
  -webkit-box-shadow: 0 .5rem 1.25rem 0 rgb(0 0 0 / 6%);
  box-shadow: 0 .5rem 1.25rem 0 rgb(0 0 0 / 2%);
  flex-direction: column;
  justify-content: space-between;

  .shop-action {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .good-item {
    width: 10rem;
    height: 5rem;
    margin-left: 1.875rem;
  }

  .order-amount {
    font-size: 1rem;
    color: #d64244;
    font-weight: 500;
  }

  .custom-radio-card-mask {
    height: .875rem;
    width: .875rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    border: .0625rem solid var(--color-border-2);
    box-sizing: border-box;
  }

  .custom-radio-card-mask-dot {
    width: .5rem;
    height: .5rem;
    border-radius: 100%;
  }

  .custom-radio-card-title {
    color: var(--color-text-1);
    font-size: .875rem;
    // font-weight: bold;
  }

  .custom-radio-card {
    padding: .625rem 1rem;
    border-radius: .25rem;
    box-sizing: border-box;
    background-color: rgb(248, 248, 248);
    border: .0625rem solid rgb(236, 236, 236);
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
