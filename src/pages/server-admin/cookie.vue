<template>
<div>
  <a-table :data="tableData.data" size="small" bordered :pagination="false">
    <template #columns>
      <a-table-column title="站点名称" data-index="name" align="center"></a-table-column>
      <a-table-column title="官网地址" data-index="url" align="center"></a-table-column>
      <a-table-column title="站点描述" data-index="desc" align="center">
        <template #cell="{ record }">
          <a-input v-model="record.desc"></a-input>
        </template>
      </a-table-column>
      <a-table-column title="今日下载次数" data-index="num" align="center"></a-table-column>
      <a-table-column title="单次扣除积分" data-index="cost" :width="160" align="center">
        <template #cell="{ record }">
          <a-input-number v-model="record.cost"></a-input-number>
        </template>
      </a-table-column>
      <a-table-column title="是否开启解析" data-index="isStop" align="center">
        <template #cell="{ record }">
          <a-switch v-model="record.isRun"/>
        </template>
      </a-table-column>
      <a-table-column title="cookie编辑" align="center">
        <template #cell="{ record }">
          <a-button type="text" @click="openCookieDialog(record)">cookie编辑</a-button>
        </template>
      </a-table-column>
      <a-table-column title="操作" align="center">
        <template #cell="{ record }">
          <a-button type="text" @click="saveRowConfig(record)">保存配置</a-button>
        </template>
      </a-table-column>
    </template>
  </a-table>

  <!-- cookie配置弹窗 -->
  <s-dialog v-model:visible="tableData.visible" width="500px" :title="tableData.currentCookie.name">
    <div class="cookie-box">
      <a-form :model="form" auto-label-width>
      <a-form-item v-for="(cookie,i) in tableData.currentCookie.cookie"  :key="i" :field="`cookie.${index}.value`" :label="`cookie${i + 1}`">
        <a-input v-model="cookie.value" placeholder="请复制cookie"/>
        &nbsp;<a-button v-if="i > 0" type="text" status="danger" @click="delCookie(i)">删除</a-button>
      </a-form-item>
      </a-form> 
    </div>
    <template #footer>
      <div>
        <a-button type="primary" @click="addCookie">新增</a-button>&nbsp;
        <a-button type="primary" @click="tableData.visible = false">保存</a-button>
      </div>
    </template>
  </s-dialog>
</div>
</template>
<script setup>
import { webSiteMap } from '@/data-map/index.js'
import { getCookies, saveCookies } from '@/api/admin/index.js'
import { timeConvert } from '@/utils/index'
import { Message } from '@arco-design/web-vue';
import sDialog from '@/components/s-dialog/index.vue'

const tableData = reactive({
  data: [],
  visible: false,
  currentCookie: {}
})

getCookies().then(res => {
  tableData.data = res.data
})

// 解析 开关
const switchChange = (item,val) => {
  console.log(item,val);
}

// 打开cookie弹窗
const openCookieDialog = (item) => {
  tableData.visible = true
  tableData.currentCookie =item
}
// 增加cookie
const addCookie = () => {
  tableData.currentCookie.cookie.push({
    value: '',
    id: Math.floor(new Date().getTime() / 1000)
  })
}
// 删除cookie
const delCookie = (i) => {
  tableData.currentCookie.cookie.splice(i, 1)
}

// 保存配置
const saveRowConfig = async (row) => {
  console.log(row);
  const res = await saveCookies({
    id: row.id,
    cost: Number(row.cost) || 0,
    desc: row.desc || '-',
    cookies: row.cookie,
    isRun: row.isRun
  })
  Message.success(res.data)
}
</script>

<style lang="less" scoped>
  .cookie-box{
    max-height: 200px;
    overflow: auto;
  }
</style>