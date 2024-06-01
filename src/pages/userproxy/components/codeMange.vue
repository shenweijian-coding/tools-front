<template>
  <div class="p=l">
    <a-form :model="codeInfo.searchForm" layout="inline">
      <a-form-item>
        <a-select v-model="codeInfo.searchForm.status" placeholder="全部状态" style="width: 120px">
          <a-option v-for="o of codeInfo.stateList" :value="o.val" :label="o.name" :key="o.val" />
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-select v-model="codeInfo.searchForm.type" placeholder="全部类型" style="width: 120px">
          <a-option v-for="o of codeInfo.typeList" :value="o.val" :label="o.name" :key="o.val" />
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-select v-model="codeInfo.searchForm.pid" placeholder="全部套餐" style="width: 300px">
          <a-option
            v-for="o of codeInfo.productList.filter(o => o.type == codeInfo.searchForm.type ? codeInfo.searchForm.type : true)"
            :value="o.pid" :label="o.name + o.memo" :key="o.pid" />
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-input placeholder="请输入卡密" v-model="codeInfo.searchForm.code"></a-input>
      </a-form-item>
      <a-form-item>
        <a-button @click="getTableData(1)" type="primary">搜索</a-button>
        <a-button @click="getAllData" status="success" class="ml-2" type="primary">显示全部卡密（复制发货软件用）</a-button>
        <a-button @click="reset" class="ml-2">重置</a-button>
      </a-form-item>
    </a-form>
    <a-table :data="codeInfo.tableData" :pagination="pagination" @page-change="pageChange">
      <template #columns>
        <a-table-column title="卡密" data-index="code" align="center"></a-table-column>
        <a-table-column title="状态" data-index="status" align="center">
          <template #cell="{ record }">
            <a-tag v-if="record.status == 0" color="grey">未激活</a-tag>
            <a-tag v-if="record.status == 1" color="green">已激活</a-tag>
            <a-tag v-if="record.status == 2" color="red">已禁用</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="创建时间" data-index="time" align="center"></a-table-column>
        <a-table-column title="权限" data-index="type" align="center">
          <template #cell="{ record }">
            <span v-if="record.type == 1">时间卡-{{ record.num }}天-每天每网{{ record.eNum }}次</span>
            <span v-if="record.type == 4">时间卡-{{ record.num }}天-每天共{{ record.eNum }}次</span>
            <span v-if="record.type == 3">次数卡-{{ record.num }}次-不过期</span>
            <span v-if="record.type == 5">次数卡-{{ record.num }}次-{{ record.numDead }}天有效期</span>
          </template>
        </a-table-column>
        <a-table-column title="操作" align="center">
          <template #cell="{ record }">
            <a-button type="text" v-if="record.status == 2" @click="handleOpenCode(record)">启用</a-button>
            <a-button type="text" status="danger" v-if="record.status == 1" :disabled="!record.status"
              @click="handleCodeIsUse(record)">禁用</a-button>
            <!-- <a-button type="text" v-if="record.status == 1" :disabled="!record.status" @click="openUserInfo(record)">查看信息</a-button> -->
            <a-button type="text" :disabled="!record.status" @click="handleDownload(record)">查看详情</a-button>
          </template>
        </a-table-column>
      </template>
    </a-table>

    <s-dialog :visible="codeInfo.disableVisible" width="30%" title="禁用" @close="codeInfo.disableVisible = false">
      禁用开关（打开即禁用账号，无法下载）：<a-switch v-model="codeInfo.disableInfo.isBlack"></a-switch>
      <a-input v-model="codeInfo.disableInfo.blackReason" placeholder="请输入禁用提示，搜索后提示的内容"></a-input>
      <template #footer>
        <div>
          <a-button type="primary" @click="handleSave">保存</a-button>
        </div>
      </template>
    </s-dialog>

    <s-dialog :visible="codeInfo.copyVisible" width="30%" title="生成结果" @close="close">
      <p>生成结果，可直接全选复制</p>
      <textarea class="textarea-code" cols="40" rows="10" :value="codeInfo.createResult"></textarea>
      <template #footer>
        <a-space>
          <a-button type="outline" @click="close">关闭</a-button>
          <a-button type="primary" @click="copyCreateResult">一键复制</a-button>
        </a-space>
      </template>
    </s-dialog>

  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { getCodeList, updateUserBlack, getProduct } from '@api/admin/proxy.js'

const emit = defineEmits(['getUserInfo'])
const codeInfo = reactive({
  searchForm: {
    status: '',
    type: '',
    code: '',
    pid: ''
  },
  stateList: [{
    name: '未激活',
    val: 0
  }, {
    name: '已激活',
    val: 1
  }, {
    name: '已禁用',
    val: 2
  }],
  typeList: [
    { name: '自选套餐', val: 1 },
    { name: '多网套餐', val: 4 },
    { name: '次数套餐', val: 3 },
    { name: '次数套餐-过期', val: 5 },
  ],
  total: 0,
  current: 0,
  tableData: [],
  disableInfo: {
    currentRow: null,
    isBlack: false,
    blackReason: ''
  },
  disableVisible: false,
  productList: [],
  copyVisible: false,
  createResult: ''
})

const pagination = computed(() => ({
  total: codeInfo.total,
  current: codeInfo.current,
  'show-total': true,
  'page-size': 10
}))

const pageChange = (page) => {
  console.log(page);
  getTableData(page)
}

const getTableData = (page = 1) => {
  getCodeList({ ...codeInfo.searchForm, page, pageSize: 10 }).then(res => {
    codeInfo.tableData = res.data.list
    codeInfo.total = res.data.total
    codeInfo.current = res.data.current
  })
}
const reset = () => {
  codeInfo.searchForm = {
    status: '',
    type: '',
    code: ''
  }
  getTableData()
}
const handleCodeIsUse = (row) => {
  codeInfo.disableInfo.currentRow = row

  codeInfo.disableVisible = true
}
const openUserInfo = (row) => {

}
const handleSave = (row) => {
  updateUserBlack({ code: codeInfo.disableInfo.currentRow.code, isBlack: codeInfo.disableInfo.isBlack, blackReason: codeInfo.disableInfo.blackReason }).then(res => {
    console.log('操作成功');
    codeInfo.disableInfo = {
      currentRow: null,
      isBlack: false,
      blackReason: ''
    }
    codeInfo.disableVisible = false
    setTimeout(() => {
      getTableData(1)
    }, 1000);
  })
}
const handleOpenCode = (row) => {
  updateUserBlack({ code: row.code, isBlack: false, blackReason: '' }).then(res => {
    setTimeout(() => {
      getTableData(1)
    }, 1000);
  })
}
onMounted(() => {
  getTableData()
  getProduct().then(res => {
    codeInfo.productList = res.data
  })
})
const getAllData = () => {
  getCodeList({ ...codeInfo.searchForm, page: 1, pageSize: 9999 }).then(res => {
    let str = ''
    res.data.list.forEach(it => {
      str += it.code + '\n'
    });
    codeInfo.createResult = str
    codeInfo.copyVisible = true
  })
}
const handleDownload = (record) => {
  emit('getUserInfo', record.code)
}
const close = () => {
  codeInfo.createResult = ''
  codeInfo.copyVisible = false

}
const copyCreateResult = () => {
  var textareaC = document.createElement('textarea');
  textareaC.setAttribute('readonly', 'readonly'); //设置只读属性防止手机上弹出软键盘
  textareaC.value = codeInfo.createResult;
  document.body.appendChild(textareaC); //将textarea添加为body子元素
  textareaC.select();
  var res = document.execCommand('copy');
  document.body.removeChild(textareaC);//移除DOM元素
  Message.success('复制成功！');
}
defineExpose({
  getTableData
})
</script>
<style scoped lang="less">
textarea{
  border: 1px solid #666;
}
</style>