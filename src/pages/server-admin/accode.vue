<template>
  <a-form :model="accodeInfo.form" layout="inline">
    <a-form-item label="类型:">
      <a-radio-group v-model="accodeInfo.form.type"  @change="search">
        <a-radio :value="1">时长卡</a-radio>
        <a-radio :value="2">站点次数卡</a-radio>
        <a-radio :value="3">全站次数卡</a-radio>
      </a-radio-group>
    </a-form-item>
    <!-- <a-form-item label="卡密:">
      <a-input v-model="accodeInfo.form.code" placeholder="请复制卡密"></a-input>
    </a-form-item> -->
    <!-- <a-form-item>
      <a-space>
        <a-button type="primary" @click="search">搜索</a-button>
      </a-space>
    </a-form-item> -->
  </a-form>
  <a-divider orientation="center"></a-divider>
  <a-button type="primary" @click="accodeInfo.createVisible = true">新建卡密</a-button>

  <a-table class="mt-m" :data="accodeInfo.tableData" size="small" bordered 
    :pagination="accodeInfo.pagination" 
    @page-change="pageChange">
    <template #columns>
    <a-table-column title="卡密" data-index="code" align="center"></a-table-column>
    <a-table-column title="类型" data-index="type" align="center">
      <template #cell="{ record }">
        <a-tag v-if="record.type == 1" color="#7816ff">时长卡</a-tag>
        <a-tag v-else-if="record.type == 2" color="#00b42a">站点次数卡</a-tag>
        <a-tag v-else color="#0fc6c2">全站次数卡</a-tag>
      </template>
    </a-table-column>
    <a-table-column title="权限" data-index="num" align="center">
      <template #cell="{ record }">
        <template v-if="record.type === 1">
          <span>时长会员：{{ record.num }}天；每日积分：{{ record.eNum }}；</span>
          生效站点：<span v-for="it in record.sites" :key="it">{{ webMap[it] }} </span>
        </template>
        <template v-if="record.type === 2">
          <span>站点积分会员-{{ record.num }} 积分</span>
          生效站点：<span v-for="it in record.sites" :key="it">{{ webMap[it] }} </span>
        </template>
        <template v-if="record.type === 3">
          <span>全站积分会员-{{ record.num }} 积分</span>
        </template>
      </template>
    </a-table-column>
    <a-table-column title="操作" align="center">
      <template #cell="{ record }">
        <a-button type="text" @click="deleteCode(record)">删除</a-button>
      </template>
    </a-table-column>
  </template>
  </a-table>
  <s-dialog v-model:visible="accodeInfo.createVisible" width="50%" title="新建卡密" @close="close">
    <a-form v-if="!accodeInfo.createResult.length" :model="accodeInfo.createForm" auto-label-width>
      <a-form-item label="卡密类型">
        <a-radio-group v-model="accodeInfo.createForm.type">
          <a-radio :value="1">时长卡</a-radio>
          <a-radio :value="2">站点次数卡</a-radio>
          <a-radio :value="3">全站次数卡</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item v-if="accodeInfo.createForm.type !==3" label="生效站点">
      <a-checkbox-group v-model="accodeInfo.createForm.sites">
        <a-checkbox v-for="(o,key) in webMap" :key="key" :value="key">{{ o }}</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <div class="flex" v-if="accodeInfo.createForm.type ===1">
      <a-form-item label="可用时长(天)">
        <a-input-number v-model="accodeInfo.createForm.num"/>
      </a-form-item>
      <a-form-item label="每日积分">
        <a-input-number v-model="accodeInfo.createForm.eNum"/>
      </a-form-item>
    </div>
    <a-form-item label="可用积分" v-if="accodeInfo.createForm.type !==1">
      <a-input-number v-model="accodeInfo.createForm.num" style="width:200px"/>
    </a-form-item>
    <a-form-item label="生成数量">
      <a-input-number v-model="accodeInfo.createForm.createNum" style="width:200px"/>
    </a-form-item>
    </a-form>
    <div v-else>
      <p>生成结果，可直接复制</p>
      <textarea class="textarea-code" cols="40" rows="10" :value="accodeInfo.createResult"></textarea>
    </div>
    <template #footer>
      <a-space>
        <a-button type="outline" @click="close">关闭</a-button>
        <a-button type="primary" @click="createAccode" v-if="!accodeInfo.createResult.length">确认新建</a-button>
        <a-button type="primary" @click="accodeInfo.createResult = []" v-else>再次创建</a-button>
      </a-space>
    </template>
  </s-dialog>
</template>
<script setup>
import { getCodeByType, createAccodeApi } from '@/api/admin/index'
import { webSiteMap } from '@/data-map/index.js'

const webMap = ref(webSiteMap)
const accodeInfo = reactive({
  form: {
    type: 1
  },
  tableData: [],
  pagination:{
    total: 0,
    current: 1,
    'show-total': true,
    'page-size': 10
  },
  createVisible: false,
  webSiteList: [],
  createForm: {
    createNum: 10,
    eNum: 1000,
    type: 1,
    num: 100
  },
  createResult: []
})

const webMap2List = () => {
  const arr = []
  for (const key of webSiteMap) {
    arr.push({ id: key, name: webSiteMap[key] })
  }
  accodeInfo.webSiteList = arr
}
const search = async () => {
  const res = await getCodeByType({ ...accodeInfo.form, pageNum: accodeInfo.pagination.current })
  accodeInfo.tableData = res.data.list || []
  accodeInfo.pagination.total = res.data.total || 0

}

const close = () => {
  accodeInfo.createVisible = false
  accodeInfo.createResult = []
}

const createAccode = async () => {
  let { type, num, eNum, createNum, sites } = accodeInfo.createForm
  if (type === 1) {
    
  } else if (type === 2) {
    eNum = 0
  } else if (type === 3) {
    sites = []
    eNum = 0
  }
  const res = await createAccodeApi({ type, num, eNum, createNum, sites })
  let str = ''
  res.data.forEach(it => {
    str += it.code + '\n'
  });
  accodeInfo.createResult = str
  search()
}

const pageChange = (page) => {
  accodeInfo.pagination.current = page
  search()
}
search()
</script>

<style scoped lang="less">
.textarea-code{
  border: 1px solid #666;
}
</style>