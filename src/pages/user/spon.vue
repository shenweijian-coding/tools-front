<template>
  <a-table :columns="columns" :data="payInfo" />
</template>

<script setup lang="ts">
const columns = [
  {
    title: '账单号',
    dataIndex: 'tradeNo',
  },
  {
    title: '支付宝账号',
    dataIndex: 'name',
  },
  {
    title: '赞助时间',
    dataIndex: 'date',
  },
  {
    title: '赞助金额',
    dataIndex: 'price',
  }
];
const props = defineProps({
  payInfo: {
    type: Array
  }
})
</script>