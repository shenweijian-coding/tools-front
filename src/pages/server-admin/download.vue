<template>
  <div>
    <a-form :model="state" layout="inline">
      <a-form-item label="素材ID">
        <a-input v-model="state.sc_id" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="用户ID">
        <a-input v-model="state.id" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="下载IP">
        <a-input v-model="state.ip" placeholder="请输入" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="() => pageChange()">搜索</a-button>&nbsp;
        <a-button @click="reset">重置</a-button>
      </a-form-item>
    </a-form>
    <a-table row-key="_id" :data="state.tableData" :pagination="pagination" @page-change="pageChange">
      <template #columns>
        <a-table-column title="下载链接" data-index="web_url" ellipsis>
          <template #cell="{ record }">
            <a :href="record.web_url" target="_blank">{{ record.web_url }}</a>
          </template>
        </a-table-column>
        <a-table-column title="用户ID" data-index="id">
          <template #cell="{ record }">
            {{record.id}}
          </template>
        </a-table-column>
        <a-table-column title="下载时间">
          <template #cell="{ record }">
            {{ record.time }}
          </template>
        </a-table-column>
        <a-table-column title="下载地址">
          <template #cell="{ record }">
            {{ record.address }}
          </template>
        </a-table-column>
        <a-table-column title="下载IP">
          <template #cell="{ record }">
            {{ record?.ip.replace('::ffff:', '') }}
          </template>
        </a-table-column>
        <!-- <a-table-column title="结果" data-index="is_ok">
        <template #cell="{ record }">
          <a-tag :color="record.is_ok ? '#165dff' : '#f53f3f'">{{ record.is_ok ? '成功' : '失败' }}</a-tag>
        </template>
      </a-table-column> -->
      </template>
    </a-table>
  </div>
</template>
<script setup>
import { getWebDownLog, getAddressByIp } from '@/api/admin/index.js'
const appStore = useAppStore()
import { useAppStore } from '@/store';
import { timeConvert, dateFormate } from '@/utils/index'
import axios from 'axios'

if (!appStore.$state.webMap) {
  appStore.getWebList()
}
const state = reactive({
  tableData: [],
  total: 0,
  current: 1,
  id: '',
  ip: '',
  sc_id: ''
})
const getAddress = (list) => {
  for (let i = 0; i < list.length; i++) {    
    getAddressByIp(list[i].ip.replace('::ffff:', '')).then(res => {
      list[i].address = res.data
      console.log(res);
    })
  }
}

const getDownloadLog = (page) => {
  getWebDownLog({ page, id: state.id, ip: state.ip, sc_id: state.sc_id }).then(res => {
    console.log(res);
    state.tableData = res.data.list
    state.total = res.data.total
    state.current = res.data.current
    getAddress(state.tableData)
  })
}
getDownloadLog(1)
const pagination = computed(() => ({
  total: state.total,
  current: state.current,
  'show-total': true,
  'pageSize': 15
}))
const pageChange = (page = 1) => {
  getDownloadLog(page)
}

const reset = () => {
  state.ip = ''
  state.sc_id = ''
  state.id = ''
  state.current = 1
  pageChange()
}
</script>
