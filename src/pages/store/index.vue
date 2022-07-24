<template>
  <div class="shop-box" v-loading="loading">
    <a-radio-group v-model="checkedValue">
      <template v-for="item in goodList" :key="item">
        <a-radio :value="item">
          <template #radio="{ checked }">
            <a-space align="start" class="custom-radio-card" :class="{ 'custom-radio-card-checked': checked }">
              <div>
                <div className="custom-radio-card-title">
                  {{ item.title }}
                </div>
                <a-typography-text type="secondary">
                  {{ item.desc }}
                </a-typography-text>
              </div>
            </a-space>
          </template>
        </a-radio>
      </template>
    </a-radio-group>
    <div class="shop-action">
      <span class="order-amount" v-if="checkedValue.price">￥{{ checkedValue.price }}</span>&nbsp;&nbsp;&nbsp;
      <a-button type="primary" style="width: 200px;" @click="spon">立即赞助</a-button>
    </div>
    <sponDialog :orderInfo="orderInfo" :visible="visible" @close="close"></sponDialog>
  </div>
</template>
<script setup lang="ts">
import { getGoodList } from '@api/home';
import sponDialog from './sponDialog.vue'
import { createInvoice } from '@api/home'

const goodList = ref([])
const loading = ref(false)
const checkedValue = ref({})
const visible = ref(false)
const orderInfo = ref({})

const getList = async () => {
  loading.value = true
  const res = await getGoodList()
  goodList.value = res.data
  checkedValue.value = goodList.value[0]
  loading.value = false
}

const spon = async () => {
  loading.value = true
  const id = checkedValue.value.id
  if(!id) {  return }
  const res = await createInvoice({ id })
  orderInfo.value = res.data
  loading.value = false
  visible.value = true
}

const close = () => {
  visible.value = false
}
getList()
</script>
<style lang="less" scoped>
.shop-box {
  display: flex;
  min-height: 500px;
  width: 88%;
  box-sizing: border-box;
  padding: 20px 40px 0 40px;
  background-color: #fff;
  position: relative;
  margin: auto;

  .shop-action {
    position: absolute;
    bottom: 30px;
    right: 30px;
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
    font-weight: bold;
    margin-bottom: 8px;
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
