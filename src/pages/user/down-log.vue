<template>
  <div class="p-2">
    <a-table :data="data.list" style="max-height:530px" :pagination="pagination" @page-change="pageChange">
     <template #columns>
        <a-table-column title="网站名称" data-index="web_site" :width="200">
          <template #cell="{ record }">
            {{ webSiteMap[record.web_site] }}
          </template>
        </a-table-column>
        <a-table-column title="下载链接" data-index="web_url" ellipsis>
          <template #cell="{ record }">
            <a :href="record.web_url" target="_blank">{{record.web_url}}</a>
          </template>
        </a-table-column>
        <a-table-column title="下载时间" :width="200">
          <template #cell="{ record }">
            {{ timeConvert(record.time) }}
          </template>
        </a-table-column>
        <a-table-column title="结果" data-index="is_ok"  :width="200">
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
// import { webSiteMap } from '@/data-map/index'
import { useAppStore } from '@/store';

const appStore = useAppStore()
const props = defineProps({
  data: {
    type: Object
  }
})
const emit = defineEmits(['pageChange'])
const pageChange = (page) => {
  emit('pageChange', page)
}

const webSiteMap = ref()

const webMap = {}
appStore.webList.forEach(o => {
  webMap[o.webId] = o.webName
})
webSiteMap.value = webMap

const pagination = computed(() => ({
  total: props.data.total,
  current: props.data.current,
  'show-total': true,
  'page-size': 10
}))
</script>

<style>

</style>