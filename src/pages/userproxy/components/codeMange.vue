<template>
  <div class="p=l">
    <a-form :model="codeInfo.searchForm" layout="inline">
      <a-form-item>
        <a-select v-model="codeInfo.searchForm.state" placeholder="全部状态" style="width: 120px">
          <a-option v-for="o of codeInfo.stateList" :value="o.val" :label="o.name" :key="o.val"/>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-select v-model="codeInfo.searchForm.type" placeholder="全部类型" style="width: 120px">
          <a-option v-for="o of codeInfo.typeList" :value="o.val" :label="o.name" :key="o.val"/>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-input placeholder="请输入卡密" v-model="codeInfo.card"></a-input>
      </a-form-item>
    </a-form>
    <a-table :data="codeInfo.tableData">
      <template #columns>
        <a-table-column title="卡密" data-index="code" align="center"></a-table-column>
        <a-table-column title="状态" data-index="status" align="center"></a-table-column>
        <a-table-column title="激活时间" data-index="time" align="center"></a-table-column>
        <a-table-column title="操作" align="center">
          <template #cell="{ record }">
            <a-button type="text" @click="deleteCode(record)">禁用</a-button>
            <a-button type="text" @click="deleteCode(record)">查看下载记录</a-button>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const codeInfo = reactive({
  searchForm: {
    state: '',
    type: '',
    card: ''
  },
  stateList: [{
    name: '未激活',
    val: 1
  },{
    name: '已激活',
    val: 2
  }, {
    name: '已退卡',
    val: 3
  }],
  typeList: [
    { name: '自选套餐', val: 1 },
    { name: '多网套餐', val: 2 },
    { name: '积分套餐', val: 3 },
  ],
  tableData: [{
    code: '111-222-333'
  }]
})
</script>