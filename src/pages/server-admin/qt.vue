
<template>
  <div>
    <a-button @click="getTableData" type="primary">刷新</a-button>
    <a-table :data="state.tableData" :pagination="false" size="small" bordered class="mt-m">
      <template #columns>
        <a-table-column title="地址" data-index="url" align="center">
          <template #cell="{ record }">
            <a :href="record.url" target="_blank" rel="noreferrer">{{ record.url }}</a>
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
            <a-tag v-if="Date.now() - 16 * 60000 > +record.time" color="green">是</a-tag>
            <a-tag v-else color="red">否</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="操作" align="center">
          <template #cell="{ record }">
            <a-button type="text" @click="handleDel(record)">删除</a-button>
            <a-button type="text" @click="handleDownload(record)">执行下载</a-button>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>
<script setup>
import { getQtWaitList, delQtWait } from "@/api/admin/index";
import { timeConvert, dateFormate } from '@/utils/index'
import { getPngUrl } from '@api/sucai/index'
import { Message } from '@arco-design/web-vue';

const state = reactive({
  tableData: []
})

function getTableData() {
  getQtWaitList().then(res => {
    state.tableData = res.data
  })
}
function handleDel(record) {
  delQtWait({ id: record._id }).then(res => {
    Message.success('success')
    getTableData()
  })
}
async function handleDownload(record) {
  const res = await getPngUrl({ url: record.url })
  if(res.data?.psd) {
    Message.success('success'+res.data.psd)
    handleDel(record)
  }else {
    Message.error('失败')
  }
}
getTableData()
</script>