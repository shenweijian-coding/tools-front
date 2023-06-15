<template>
<div v-loading="tableData.loading">
  <a-button type="primary" @click="addWebClick">新增站点</a-button>&nbsp;
  <a-button type="outline" @click="addMoreOtherCookie">批量添加三方cookie</a-button>
  <a-table :data="tableData.data" size="small" bordered :pagination="false" stripe class="mt-m">
    <template #columns>
      <a-table-column title="ID" data-index="id" align="center"></a-table-column>
      <a-table-column title="站点名称" data-index="name" align="center"  width="90"></a-table-column>
      <a-table-column title="官网地址" data-index="url" align="center"></a-table-column>
      <a-table-column title="关键词" data-index="keyWord" align="center"  width="100"></a-table-column>
      <a-table-column title="站点描述" data-index="desc" align="center"  width="300">
      </a-table-column>
      <a-table-column title="今日下载" data-index="num" align="center" width="100"></a-table-column>
      <a-table-column title="单次扣除" data-index="cost" align="center" width="100">
      </a-table-column>
      <a-table-column title="官方/第三方" data-index="tag" align="center" width="100">
        <template #cell="{ record }">
          <a-tag v-if="record.otherCookie?.length && record.cookie?.length" color="#1342d6">三方+官网</a-tag>
          <a-tag v-else-if="record.otherCookie?.length" color="#7302d6">第三方解析</a-tag>
          <a-tag v-else-if="record.cookie?.length" color="#00b42a">官方解析</a-tag>
          <a-tag v-else color="#f53f3f">未配置</a-tag>
        </template>
      </a-table-column>
      <a-table-column title="是否开启" data-index="isRun" align="center" width="100">
        <template #cell="{ record }">
          <a-tag :color="record.isRun ? '#00b42a' : '#f53f3f'">{{ record.isRun ? '开启' : '关闭' }}</a-tag>
        </template>
      </a-table-column>
      <a-table-column title="编辑" align="center" width="100">
        <template #cell="{ record }">
          <a-button type="text" @click="editWeb(record)">编辑</a-button>
          <a-button type="text" @click="deleteWeb(record)">删除</a-button>
        </template>
      </a-table-column>
    </template>
  </a-table>
  <div class="mt-m">
    <p>目前系统支持的官网如下：千图网、包图网、摄图网、90设计、千库网、图品汇、虎课网、视达网、觅知网、觅元素、90设计、熊猫办公、图克巴巴、我图VIP、六图网、图精灵、风云办公、众图网；</p>
    <p>新增站点功能，增加的网站仅限对接的第三方支持的网站，添加的官网cookie是无法进行解析的，因为没有对接官网；</p>
  </div>
  <!-- cookie配置弹窗 -->
  <s-dialog :visible="tableData.visible" width="50%" :title="tableData.currentCookie?.name || '新增'" @close="dialogClose">
    <div class="cookie-box">
      <a-form :model="tableData.currentCookie" auto-label-width>
        <a-divider orientation="center">基本配置</a-divider>
        <template  v-if="!tableData.actionType">
          <a-form-item label="站点ID">
            <a-input-number v-model="tableData.currentCookie.id"></a-input-number>
          </a-form-item>
          <a-form-item label="站点名称">
            <a-input v-model="tableData.currentCookie.name"></a-input>
          </a-form-item>
          <a-form-item label="站点官网">
            <a-input v-model="tableData.currentCookie.url"></a-input>
          </a-form-item>
          <a-form-item label="关键字">
            <a-input v-model="tableData.currentCookie.keyWord"></a-input>
          </a-form-item>
        </template>
        <a-form-item label="站点描述">
          <a-input v-model="tableData.currentCookie.desc"></a-input>
        </a-form-item>
        <a-form-item label="单次扣除">
          <a-input-number v-model="tableData.currentCookie.cost"></a-input-number>
        </a-form-item>
        <a-form-item label="是否开启解析">
          <a-switch v-model="tableData.currentCookie.isRun"/>
        </a-form-item>
        <a-divider direction="vertical"></a-divider>
        <a-divider orientation="center">官网cookie</a-divider>
        <a-form-item v-for="(cookie,i) in tableData.currentCookie.cookie"  :key="i" :field="`cookie.${i}.value`" :label="`官网cookie${i + 1}`">
          <a-input v-model="cookie.value" placeholder="请复制cookie"/>
          &nbsp;<a-button type="text" status="danger" @click="delCookie(i, 'cookie')">删除</a-button>
        </a-form-item>
        <a-button type="outline" @click="addCookie('cookie')" style="width: 160px">新增官网cookie</a-button>

        <a-divider orientation="center">三方cookie</a-divider>
        <a-form-item v-for="(cookie,i) in tableData.currentCookie.otherCookie"  :key="i" :field="`cookie.${i}.value`" :label="`三方cookie${i + 1}`">
          <span>{{ cookie.id }}</span>
          <a-input v-model="cookie.value" placeholder="请复制cookie"/>&nbsp;
          <a-input v-model="cookie.code" placeholder="对应卡密"/>&nbsp;
          <a-input v-model="cookie.api" placeholder="三方ID" style="width: 80px"/>
          <a-switch v-model="cookie.isOpen"></a-switch>
          <a-button type="text" status="success" @click="getOtherAuth(cookie)">查看权限</a-button>
          <a-button type="text" status="danger" @click="delCookie(i, 'otherCookie')">删除</a-button>
        </a-form-item>
        <a-button type="outline" @click="addCookie('otherCookie')" style="width: 160px">新增三方cookie</a-button>
      </a-form> 
    </div>
    <template #footer>
      <div>
        <a-button type="primary" @click="saveRowConfig">保存</a-button>
      </div>
    </template>
  </s-dialog>

  <!-- 批量增加三方cookie -->
  <s-dialog :visible="tableData.moreVisible" width="50%" title="批量增加三方cookie" @close="tableData.moreVisible = false
  ">
    <a-form :model="tableData.moreCookie" auto-label-width>

    <a-form-item label="`三方cookie">
      <a-input v-model="tableData.moreCookie.value" placeholder="请复制cookie"/>&nbsp;
      <a-input v-model="tableData.moreCookie.code" placeholder="对应卡密"/>&nbsp;
      <a-input v-model="tableData.moreCookie.api" placeholder="三方ID"/>
    </a-form-item>
    </a-form>
    <template #footer>
      <div>
        <a-button type="primary" @click="saveMoreCookie">保存</a-button>
      </div>
    </template>
  </s-dialog>
</div>
</template>
<script setup>
import { webSiteMap } from '@/data-map/index.js'
import { getCookies, saveCookies, addWeb, saveMoreCookieApi, delWeb, getOtherCookieApi} from '@/api/admin/index.js'
import { timeConvert } from '@/utils/index'
import { Message } from '@arco-design/web-vue';
import sDialog from '@/components/s-dialog/index.vue'

const tableData = reactive({
  laoding: false,
  data: [],
  visible: false,
  moreVisible: false,
  currentCookie: {},
  actionType: 1, // 1是编辑 0是新增
  moreCookie: { code: '', value: '', api: null, isOpen: true }
})

const getCookie = () => {
  try {    
    tableData.laoding = true
    getCookies().then(res => {
      tableData.data = res.data
    })
  } catch (error) {
    console.log(error);
  } finally {
    tableData.laoding = false
  }
}
getCookie()
// 解析 开关
const switchChange = (item,val) => {
  console.log(item,val);
}

const dialogClose = () => {
  tableData.actionType = 1
  tableData.visible = false
  tableData.currentCookie = {}
}
// 打开cookie弹窗
const editWeb = (item) => {
  tableData.visible = true
  tableData.actionType = 1
  tableData.currentCookie =item
}
const deleteWeb = async (item) => {
  const res = await delWeb({ id: item.id })
  Message.success(res.msg)
  getCookie()
}
const addWebClick = () => {
  tableData.actionType = 0
  tableData.visible = true
}
// 增加cookie
const addCookie = (type) => {
  tableData.currentCookie[type] || (tableData.currentCookie[type] = [])
  tableData.currentCookie[type].push({
    value: '',
    id: Math.floor(new Date().getTime() / 1000)
  })
}

// 删除cookie
const delCookie = (i, type) => {
  tableData.currentCookie[type].splice(i, 1)
}
// 删除cookie
const delOtherCookie = (i) => {
  tableData.moreCookie.splice(i, 1)
}

// 保存配置
const saveRowConfig = async () => {
  const row = tableData.currentCookie
  if(tableData.actionType) { // 编辑
    const res = await saveCookies({
      id: row.id,
      cost: Number(row.cost) || 0,
      desc: row.desc || '-',
      cookies: row.cookie.length ? row.cookie.filter(o => o.value) : [],
      isRun: row.isRun,
      otherCookie: row.otherCookie.length ? row.otherCookie.filter(o => (o.value || o.code)) : []
    })
    tableData.visible = false
    Message.success(res.data)
  }else{ // 新增
    const { id, name, url, cost, desc } = tableData.currentCookie
    const hasId  = tableData.data.filter(o => o.id === id)
    if(hasId.length) {
      Message.success('网站ID重复')
      return
    }
    if(!name || !url || !desc) {
      Message.warning('请填写完整')
      return
    }
    const res = await addWeb({
      ...tableData.currentCookie,
      num: 0
    })
    tableData.visible = false
    Message.success(res.data)
    getCookie()

  }
  getCookie()
}

// 批量加cookie
const addMoreOtherCookie = async () => {
  tableData.moreVisible = true
}
const saveMoreCookie = async () => {
  if (!tableData.moreCookie.code || !tableData.moreCookie.api) {
    Message.warning('填写完整')
    return
  }
  tableData.moreCookie.id = Math.floor(new Date().getTime() / 1000)

  const res = await saveMoreCookieApi(tableData.moreCookie)
  Message.success(res.msg)
  tableData.moreVisible = false
  getCookie()
}

// 查看第三方权限
const getOtherAuth = async (cookie) => {
  const res = await getOtherCookieApi(cookie)
  console.log(res);
  if (res.code == 200 && res?.data?.list?.length) {
    let str = ''
    res.data.list.forEach(it => {
      str += it.name + '：' + it.limit + '\n'
    });
    alert(str)
  }
}
</script>

<style lang="less" scoped>
  .cookie-box{
    max-height: 500px;
    overflow: auto;
  }
</style>