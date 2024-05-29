<template>
  <div class="p=l">
    <a-form :model="codeInfo.searchForm" layout="inline">
      <a-form-item>
        <a-select v-model="codeInfo.searchForm.status" placeholder="全部状态" style="width: 120px">
          <a-option v-for="o of codeInfo.stateList" :value="o.val" :label="o.name" :key="o.val"/>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-select v-model="codeInfo.searchForm.type" placeholder="全部类型" style="width: 120px">
          <a-option v-for="o of codeInfo.typeList" :value="o.val" :label="o.name" :key="o.val"/>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-input placeholder="请输入卡密" v-model="codeInfo.code"></a-input>
      </a-form-item>
      <a-form-item>
        <a-button @click="getTableData" type="primary">搜索</a-button>
      </a-form-item>
    </a-form>
    <a-table :data="codeInfo.tableData">
      <template #columns>
        <a-table-column title="卡密" data-index="code" align="center"></a-table-column>
        <a-table-column title="状态" data-index="status" align="center">
          <template #cell="{ record }">
            <a-tag v-if="record.status == 0" color="grey">未激活</a-tag>
            <a-tag v-if="record.status == 1" color="green">已激活</a-tag>
            <a-tag v-if="record.status == 2" color="red">已退卡</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="创建时间" data-index="time" align="center"></a-table-column>
        <a-table-column title="权限" data-index="type" align="center"></a-table-column>
        <a-table-column title="操作" align="center">
          <template #cell="{ record }">
            <a-button type="text" v-if="record.status" @click="deleteCode(record)">禁用</a-button>
            <a-button type="text" @click="deleteCode(record)">查看下载记录</a-button>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

import { getCodeList } from '@api/admin/proxy.js'

const codeInfo = reactive({
  searchForm: {
    status: '',
    type: '',
    code: ''
  },
  stateList: [{
    name: '未激活',
    val: 0
  },{
    name: '已激活',
    val: 1
  }, {
    name: '已退卡',
    val: 2
  }],
  typeList: [
    { name: '自选套餐', val: 1 },
    { name: '多网套餐', val: 4 },
    { name: '积分套餐', val: 3 },
  ],
  tableData: []
})
const getTableData = () => {
  getCodeList(codeInfo.searchForm).then(res => {
    codeInfo.tableData = res.data
  })
}
onMounted(() => {
  getTableData()
})
</script>