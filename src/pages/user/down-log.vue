<template>
  <div class="p-2">
    <a-table :data="userStore.userProfile.down_log">
     <template #columns>
        <a-table-column title="网站名称" data-index="web_site">
          <template #cell="{ record }">
            {{ webSiteMap[record.web_site] }}
          </template>
        </a-table-column>
        <a-table-column title="下载链接" data-index="web_url"></a-table-column>
        <a-table-column title="下载时间">
          <template #cell="{ record }">
            {{ timeConvert(record.time) }}
          </template>
        </a-table-column>
        <a-table-column title="结果" data-index="is_ok">
          <template #cell="{ record }">
          <a-tag :color="record.is_ok ? '#165dff' : '#f53f3f'">{{ record.is_ok ? '成功' : '失败' }}</a-tag>
            <!-- {{ record.is_ok ? '成功' : '失败' }} -->
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/modules/user/index'
const userStore = useUserStore()
import { timeConvert } from '@/utils/index'
import { webSiteMap } from '@/data-map/index'
const columns = [{
    title: '网站名称',
    dataIndex: 'web_site',
  },
  {
    title: '下载链接',
    dataIndex: 'web_url',
  },
  {
    title: '下载时间',
    dataIndex: 'time',
  },
  {
    title: '结果',
    dataIndex: 'is_ok',
}]
</script>

<style>

</style>