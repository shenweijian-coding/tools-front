<template>
  <div class="p-2">
    <a-table :data="data" style="max-height:530px">
     <template #columns>
        <a-table-column title="网站名称" data-index="web_site" width="100">
          <template #cell="{ record }">
            {{ webSiteMap[record.web_site] }}
          </template>
        </a-table-column>
        <a-table-column title="下载链接" data-index="web_url" width="600" ellipsis>
          <template #cell="{ record }">
            <a :href="record.web_url" target="_blank">{{record.web_url}}</a>
          </template>
        </a-table-column>
        <a-table-column title="下载时间" width="200">
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
import { timeConvert } from '@/utils/index'
import { webSiteMap } from '@/data-map/index'
const props = defineProps({
  data: {
    type: Object
  }
})
console.log(toRaw(props.data.down_log));
const data = computed(() => (toRaw(props.data.down_log)).reverse());
</script>

<style>

</style>