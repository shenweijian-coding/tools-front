<template>
  <div>
    <a-form :model="userInfo.searchForm" layout="inline">
      <a-form-item label="卡密账号">
        <a-input placeholder="请输入卡密" v-model="userInfo.searchForm.code" style="width: 300px"></a-input>
      </a-form-item>
      <a-form-item>
        <a-button @click="getInfo" type="primary">搜索</a-button>
        <a-button @click="reset" class="ml-2">重置</a-button>
      </a-form-item>
    </a-form>
    <a-divider v-if="Object.keys(userInfo.info).length" content-position="center">用户信息</a-divider> 

    <div class="p-2" v-if="Object.keys(userInfo.info).length">
      <div>账号是否正常：<a-tag :color="userInfo.info.isBlack ? 'red' : 'green'">{{ userInfo.info.isBlack ? '停用' : '正常' }}</a-tag></div>
      <div class="mb-2">全站通用次数：{{ userInfo.info.num && userInfo.info.num >= 0 ? userInfo.info.num : 0 }}</div>
      <template v-if="userInfo.info.auth && Object.keys(userInfo.info.auth).length">
        <div v-for="(item,prop) in userInfo.info.auth" :key="prop" class="flex mb-1" >
          <div style="width: 100px">{{ appStore.$state?.webMap?.[prop] }}</div>
          <div style="width: 100px">单网次数：{{item.num && item.num >=0 ? item.num : 0}}</div>
          <div style="width: 200px">到期时间：{{item.expireDate}}</div>
          <div style="width: 100px">今日剩余：{{item.eNum && item.eNum >= 0 ? item.eNum : 0}}</div>
          <div style="width: 100px">每天次数：{{item.initENum}}</div>
        </div>
      </template>
    </div>
      <a-divider content-position="center" v-if="Object.keys(userInfo.info).length">下载记录</a-divider> 
      <a-table row-key="_id" :data="userInfo.tableData" :pagination="pagination" @page-change="pageChange">
      <template #columns>
        <a-table-column title="下载链接" data-index="web_url" ellipsis>
          <template #cell="{ record }">
            <a :href="record.web_url" target="_blank">{{ record.web_url }}</a>
          </template>
        </a-table-column>
        <!-- <a-table-column title="用户ID" data-index="id">
          <template #cell="{ record }">
            {{record.id}}
          </template>
        </a-table-column> -->
        <a-table-column title="下载时间">
          <template #cell="{ record }">
            {{ record.time }}
          </template>
        </a-table-column>
        <!-- <a-table-column title="下载地址">
          <template #cell="{ record }">
            {{ record.address }}
          </template>
        </a-table-column> -->
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
import { getUserInfoByProxy, getUserDownByProxy } from '@api/admin/proxy.js'
import { useAppStore } from '@/store';
import { Message } from '@arco-design/web-vue'

const appStore = useAppStore()
if(!appStore.$state.webMap) {
  appStore.getWebList()
}
const userInfo = reactive({
  searchForm: {
    code: ''
  },
  info: {},
  tableData: [],
  total: 0,
  current: 1
})
const pageChange = (page) => {
  console.log(page);
  getDownInfo(page)
}

const pagination = computed(() => ({
  total: userInfo.total,
  current: userInfo.current,
  'show-total': true,
  'page-size': 10
}))

const getDownInfo = (page) => {
  getUserDownByProxy({ code: userInfo.searchForm.code, id: userInfo.info._id, page: page }).then(res => {
    console.log(res);
    userInfo.tableData = res.data.list
    userInfo.total = res.data.total
    userInfo.current = res.data.current
  })
}

const getUserInfo =() => {
  getUserInfoByProxy({ code: userInfo.searchForm.code }).then(res => {
    userInfo.info = res.data
    if(res.data) {
      getDownInfo(1)
    } else {
      Message.warning('未找到用户信息，请检查卡密是否正确或者是否激活')
    }
  })
}

const getInfo = () => {
  console.log(userInfo.searchForm.code);
  if(!userInfo.searchForm.code) {
    return
  }
  getUserInfo()
}
</script>