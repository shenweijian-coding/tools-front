<template>
  <div class="down-log">
    <div class="down-log-header">
      <div>
        <div class="down-log-title">下载记录</div>
        <div class="down-log-desc">最近的素材下载明细和处理结果</div>
      </div>
      <div class="down-log-stats">
        <div class="down-log-stat">
          <span class="down-log-stat-value">{{ total }}</span>
          <span class="down-log-stat-label">全部</span>
        </div>
        <div class="down-log-stat">
          <span class="down-log-stat-value success">{{ successCount }}</span>
          <span class="down-log-stat-label">本页成功</span>
        </div>
        <div class="down-log-stat">
          <span class="down-log-stat-value failed">{{ failedCount }}</span>
          <span class="down-log-stat-label">本页失败</span>
        </div>
      </div>
    </div>

    <a-table
      row-key="_id"
      class="down-log-table"
      :data="list"
      :pagination="pagination"
      :bordered="false"
      stripe
      @page-change="pageChange"
    >
     <template #columns>
        <a-table-column title="网站名称" data-index="web_site" :width="120">
          <template #cell="{ record }">
            <span class="site-name">{{ appStore.$state?.webMap?.[record.web_site] || record.web_site || '-' }}</span>
          </template>
        </a-table-column>
        <a-table-column title="下载链接" data-index="web_url" ellipsis>
          <template #cell="{ record }">
            <a class="download-link" :href="record.web_url" target="_blank" rel="noreferrer">{{record.web_url || '-'}}</a>
          </template>
        </a-table-column>
        <a-table-column title="下载时间" :width="180">
          <template #cell="{ record }">
            <span class="time-text">{{ timeConvert(record.time) }}</span>
          </template>
        </a-table-column>
        <a-table-column title="结果" data-index="is_ok" :width="100" align="center">
          <template #cell="{ record }">
            <a-tag :color="record.is_ok ? 'green' : 'red'">{{ record.is_ok ? '成功' : '失败' }}</a-tag>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { timeConvert } from '@/utils/index'
import { useAppStore } from '@/store';
const appStore = useAppStore()
if(!appStore.$state.webMap) {
  appStore.getWebList()
}

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ list: [], total: 0, current: 1 })
  }
})
const emit = defineEmits(['pageChange'])
const pageChange = (page) => {
  emit('pageChange', page)
}

const list = computed(() => props.data?.list || [])
const total = computed(() => props.data?.total || 0)
const successCount = computed(() => list.value.filter((item) => item.is_ok).length)
const failedCount = computed(() => list.value.filter((item) => !item.is_ok).length)

const pagination = computed(() => ({
  total: total.value,
  current: props.data?.current || 1,
  'show-total': true,
  'page-size': 10
}))
</script>

<style lang="less" scoped>
.down-log {
  padding: 4px 0 8px;
}

.down-log-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  padding: 16px 18px;
  border: 1px solid #eef0f5;
  border-radius: 8px;
  background: #fbfcff;
}

.down-log-title {
  color: #1d2129;
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
}

.down-log-desc {
  margin-top: 4px;
  color: #86909c;
  font-size: 13px;
}

.down-log-stats {
  display: flex;
  gap: 10px;
}

.down-log-stat {
  min-width: 72px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #fff;
  text-align: center;
  box-shadow: inset 0 0 0 1px #eef0f5;
}

.down-log-stat-value {
  display: block;
  color: #1d2129;
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
}

.down-log-stat-value.success {
  color: #00b42a;
}

.down-log-stat-value.failed {
  color: #f53f3f;
}

.down-log-stat-label {
  display: block;
  color: #86909c;
  font-size: 12px;
}

.down-log-table {
  overflow: hidden;
  border: 1px solid #eef0f5;
  border-radius: 8px;
}

.site-name {
  color: #1d2129;
  font-weight: 500;
}

.download-link {
  color: rgb(var(--primary-6));
}

.download-link:hover {
  text-decoration: underline;
}

.time-text {
  color: #4e5969;
}

@media (max-width: 768px) {
  .down-log-header {
    align-items: stretch;
    flex-direction: column;
  }

  .down-log-stats {
    justify-content: space-between;
  }

  .down-log-stat {
    flex: 1;
    min-width: 0;
  }
}

</style>
