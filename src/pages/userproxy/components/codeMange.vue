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
        <a-input placeholder="请输入卡密" v-model="codeInfo.searchForm.code"></a-input>
      </a-form-item>
      <a-form-item>
        <a-button @click="getTableData(1)" type="primary">搜索</a-button>
        <a-button @click="reset" class="ml-2">重置</a-button>
      </a-form-item>
    </a-form>
    <a-table :data="codeInfo.tableData" :pagination="pagination" @page-change="pageChange">
      <template #columns>
        <a-table-column title="卡密" data-index="code" align="center"></a-table-column>
        <a-table-column title="状态" data-index="status" align="center">
          <template #cell="{ record }">
            <a-tag v-if="record.status == 0" color="grey">未激活</a-tag>
            <a-tag v-if="record.status == 1" color="green">已激活</a-tag>
            <a-tag v-if="record.status == 2" color="red">已禁用</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="创建时间" data-index="time" align="center"></a-table-column>
        <a-table-column title="权限" data-index="type" align="center">
          <template #cell="{ record }">
            <span v-if="record.type == 1">自选套餐</span>
            <span v-if="record.type == 4">多网套餐-{{ record.num }}天-每天{{ record.eNum }}次</span>
            <span v-if="record.type == 3">积分套餐</span>
          </template>
        </a-table-column>
        <a-table-column title="操作" align="center">
          <template #cell="{ record }">
            <a-button type="text" v-if="record.status == 2" @click="handleOpenCode(record)">启用</a-button>
            <a-button type="text" v-if="record.status == 1" :disabled="!record.status" @click="handleCodeIsUse(record)">禁用</a-button>
            <!-- <a-button type="text" v-if="record.status == 1" :disabled="!record.status" @click="openUserInfo(record)">查看信息</a-button> -->
            <!-- <a-button type="text" :disabled="!record.status" @click="handleDownload(record)">查看下载记录</a-button> -->
          </template>
        </a-table-column>
      </template>
    </a-table>

    <s-dialog :visible="codeInfo.disableVisible" width="30%" title="禁用" @close="codeInfo.disableVisible = false">
      禁用开关（打开即禁用账号，无法下载）：<a-switch v-model="codeInfo.disableInfo.isBlack"></a-switch>
      <a-input v-model="codeInfo.disableInfo.blackReason" placeholder="请输入禁用提示，搜索后提示的内容"></a-input>
      <template #footer>
        <div>
          <a-button type="primary" @click="handleSave">保存</a-button>
        </div>
      </template>
    </s-dialog>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { getCodeList, updateUserBlack } from '@api/admin/proxy.js'

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
  total: 0,
  current: 0,
  tableData: [],
  disableInfo: {
    currentRow: null,
    isBlack: false,
    blackReason: ''
  },
  disableVisible: false
})

const pagination = computed(() => ({
  total: codeInfo.total,
  current: codeInfo.current,
  'show-total': true,
  'page-size': 10
}))

const pageChange = (page) => {
  console.log(page);
  getTableData(page)
}

const getTableData = (page = 1) => {
  getCodeList({...codeInfo.searchForm, page}).then(res => {
    codeInfo.tableData = res.data.list
    codeInfo.total = res.data.total
    codeInfo.current = res.data.current
  })
}
const reset = () => {
  codeInfo.searchForm = {   
    status: '',
    type: '',
    code: ''
  }
  getTableData()
}
const handleCodeIsUse = (row) => {
  codeInfo.disableInfo.currentRow = row

  codeInfo.disableVisible = true
}
const openUserInfo = (row) => {
  
}
const handleSave = (row) => {
  updateUserBlack({ code: codeInfo.disableInfo.currentRow.code, isBlack: codeInfo.disableInfo.isBlack, blackReason: codeInfo.disableInfo.blackReason}).then(res => {
    console.log('操作成功');
    codeInfo.disableInfo = {
      currentRow: null,
      isBlack: false,
      blackReason: '' 
    }
    codeInfo.disableVisible = false
    setTimeout(() => {
      getTableData(1)
    }, 1000);
  })
}
const handleOpenCode = (row) => {
  updateUserBlack({ code: row.code, isBlack: false, blackReason: ''}).then(res => {
    setTimeout(() => {
      getTableData(1)
    }, 1000);
  })
}
onMounted(() => {
  getTableData()
})
</script>