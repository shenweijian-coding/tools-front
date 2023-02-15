<template>
  <a-form :model="userInfo.form" layout="inline">
    <a-form-item label="ID搜索">
      <a-input v-model="userInfo.form.id" placeholder="请输入"/>
    </a-form-item>
    <a-form-item label="卡密搜索">
      <a-input v-model="userInfo.form.accode" placeholder="请输入"/>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="getUserInfo">搜索</a-button>
    </a-form-item>
  </a-form>
  <!-- 用户信息 -->
  <div class="mt-m">
    <div class="my-l">基本信息（目前用户总数：{{ userInfo.total }}）</div>
    <a-table :data="userInfo.tableData" size="small" bordered :pagination="false">
      <template #columns>
        <a-table-column title="用户ID" data-index="_id" align="center"></a-table-column>
        <a-table-column title="卡密" data-index="id" align="center"></a-table-column>
        <a-table-column title="加入时间" data-index="create_time" align="center"></a-table-column>
        <a-table-column title="全站积分" data-index="num" align="center"></a-table-column>
        <a-table-column title="权限" data-index="auth" align="center">
          <template #cell="{ record }">
            <span v-if="record.auth && Object.keys(record.auth).length">
              <p v-for="(item,prop) in record.auth" :key="prop">{{ webMap[prop] }}: 站点专用积分({{ item.num }})-到期时间({{ item.expireDate }})-今日剩余积分({{ item.eNum }})</p>
            </span>
            <p v-else>--</p>
          </template>
        </a-table-column>
        <a-table-column title="操作" align="center">
          <template #cell="{ record }">
            <a-button type="text" @click="edit(record)">编辑权限</a-button>
          </template>
        </a-table-column>
      </template>
    </a-table>

    <s-dialog v-model:visible="userInfo.editVisible" width="50%" title="权限编辑">
      <div class="webBox">
        <a-form :model="userInfo.tableData[0]" auto-label-width>
          <div class="flex">
            <a-form-item field="" label="全站积分">
              <a-input-number v-model="userInfo.tableData[0].num"></a-input-number>
            </a-form-item>
            <a-form-item field="" label="禁用账号">
              <a-switch v-model="userInfo.tableData[0].isBlack"/>
            </a-form-item>
          </div>
          <a-divider orientation="center"></a-divider>
          <div v-for="(item,prop) in userInfo.tableData[0].auth" :key="prop" class="flex">
            <a-form-item :label="webMap[prop] + '专用积分'">
              <a-input-number v-model="item.num"/>
            </a-form-item>
            <a-form-item label="到期日期">
              <a-date-picker v-model="item.expireDate" format="YYYY-MM-DD"/>
            </a-form-item>
            <a-form-item label="每日积分">
              <a-input-number v-model="item.eNum"/>
            </a-form-item>
          </div>
        </a-form> 
      </div>
      <template #footer>
        <div>
          <a-button type="primary" @click="save">保存</a-button>
        </div>
      </template>
    </s-dialog>
  </div>
  <div class="mt-m">
    <div class="my-l">下载记录</div>
    <a-table :data="userInfo.downLogData" :pagination="false">
     <template #columns>
        <a-table-column title="网站名称" data-index="web_site">
          <template #cell="{ record }">
            {{ webMap[record.web_site] }}
          </template>
        </a-table-column>
        <a-table-column title="下载链接" data-index="web_url" ellipsis>
          <template #cell="{ record }">
            <a :href="record.web_url" target="_blank">{{record.web_url}}</a>
          </template>
        </a-table-column>
        <a-table-column title="下载时间">
          <template #cell="{ record }">
            {{ timeConvert(record.time) }}
          </template>
        </a-table-column>
        <a-table-column title="结果" data-index="is_ok">
          <template #cell="{ record }">
          <a-tag :color="record.is_ok ? '#165dff' : '#f53f3f'">{{ record.is_ok ? '成功' : '失败' }}</a-tag>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
  <div class="mt-m">
    <div class="my-l">支付记录</div>
     <a-table :columns="userInfo.payCols" :data="userInfo.payInfo" />
  </div>
</template>
<script setup>
import { getUserById, updateUserInfo } from '@/api/admin/index.js'
import { webSiteMap } from '@/data-map/index.js'
import { timeConvert, dateFormate } from '@/utils/index'
import sDialog from '@/components/s-dialog/index.vue'
import { Message } from '@arco-design/web-vue'

const webMap = ref(webSiteMap)
const userInfo = reactive({
  form: {
    id: '',
    accode: ''
  },
  tableData: [],
  total: 0,
  downLogData: [],
  editVisible: false,
  payInfo: [],
  payCols: [{
    title: '账单号',
    dataIndex: 'tradeNo',
  },{
    title: '支付宝订单号',
    dataIndex: 'aliTradeNo'
  },
  {
    title: '支付宝账号',
    dataIndex: 'name',
  },
  {
    title: '时间',
    dataIndex: 'date',
  },
  {
    title: '金额',
    dataIndex: 'price',
  }]
})

const getUserInfo = async () => {
  let res = await getUserById(userInfo.form)
  if (res && res.data) {
    userInfo.tableData = res.data.list
    userInfo.payInfo = res.data.payInfo
    userInfo.downLogData = res.data.downLogs
    userInfo.total = res.data.total
  }
}
getUserInfo()
const edit = () => {
  userInfo.editVisible = true
}

const save = async () => {
  const res = await updateUserInfo(userInfo.tableData[0])
  Message.success(res.data)
  userInfo.editVisible = false
  getUserInfo()
}
</script>
<style lang="less" scoped>
  .webBox{
    max-height: 500px;
    overflow: auto;
  }
</style>