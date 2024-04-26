
<template>
  <div>
    <a-button @click="getTableData(1)" type="primary">刷新</a-button>
    <a-table :data="state.tableData" :pagination="pagination" size="small" bordered class="mt-m" @page-change="pageChange">
      <template #columns>
        <a-table-column title="地址" data-index="url" align="center">
          <template #cell="{ record }">
            <a :href="record.url" target="_blank" rel="noreferrer">{{ record.url }}</a>
          </template>
        </a-table-column>
        <a-table-column title="图片" data-index="url" align="center">
          <template #cell="{ record }">
            <a-image width="200" :height="60" :src="record.info.img" fit="scale-down"></a-image>
          </template>
        </a-table-column>
        <a-table-column title="提交时间" data-index="time" align="center">
          <template #cell="{ record }">
            {{ dateFormate(record.time / 1000, 1) }}
          </template>
        </a-table-column>
        <a-table-column title="用户ID" data-index="userId" align="center"></a-table-column>
        <a-table-column title="是否超15分钟" data-index="name" align="center">
          <template #cell="{ record }">
            <a-tag v-if="Date.now() - 16 * 60000 > +record.time || record.is_down" color="green">是</a-tag>
            <a-tag v-else color="red">否</a-tag>
            <span>{{ record?.isCache ? '已缓存' : '' }}</span>
          </template>
        </a-table-column>
        <a-table-column title="操作" align="center">
          <template #cell="{ record }">
            <a-button type="text" @click="handleDel(record)">删除</a-button>
            <a-button v-if="record.is_down" type="text" @click="handleSign(record)">标记不可下</a-button>
            <a-button v-else type="text" @click="handleSign(record)">标记可下</a-button>
            <a-button type="text" @click="handleDownload(record)">执行下载</a-button>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>
<script setup>
import { getQtWaitList, delQtWait, signQtWait, sucaiIsCache } from "@/api/admin/index";
import { timeConvert, dateFormate } from '@/utils/index'
import { getPngUrl } from '@api/sucai/index'
import { Message } from '@arco-design/web-vue';

const state = reactive({
  tableData: [],
  total: 0,
  current: 1
})

function getTableData(page) {
  getQtWaitList({page}).then(res => {
    res.data.list.forEach(item => {
      item.sc_id = item.url.match(/\d{8}/) ? item.url.match(/\d{8}/)[0] : 0
    })
    state.tableData = res.data.list

    sucaiIsCache({ mark: '58pic', ids: state.tableData.map(o => o.sc_id)}).then(res => {
      if(res.data.length) {
        res.data.forEach(item => {
          (state.tableData.find(o => o.sc_id == item.sc_id)).isCache = true
        })
      }
    })
    state.total = res.data.total
    state.current = res.data.current
  })
}
function handleDel(record) {
  delQtWait({ id: record._id }).then(res => {
    Message.success('success')
    getTableData(state.current)
  })
}
function handleSign(record) {
  signQtWait({ id: record._id, is_down: !record.is_down}).then(res => {
    getTableData(state.current)
  })
}
async function handleDownload(record) {
  const res = await getPngUrl({ url: record.url })
  if(res.data?.psd) {
    Message.success(res.data.psd)
    // handleDel(record)
  }else {
    Message.error('失败')
  }
}
const pageChange = (page = 1) => {
  getTableData(page)
}
const pagination = computed(() => ({
  total: state.total,
  current: state.current,
  'show-total': true,
  'pageSize': 15
}))
getTableData(state.current)
</script>