<template>
  <a-button type="primary" @click="productInfo.createVisible = true">新建产品</a-button>
  <a-table :data="productInfo.tableData" :pagination="false" size="small" bordered class="mt-m">
    <template #columns>
      <a-table-column title="顺序/越小越靠前" data-index="sort" align="center"></a-table-column>
      <a-table-column title="产品ID" data-index="pid" align="center"></a-table-column>
      <a-table-column title="定价/元" data-index="price" align="center"></a-table-column>
      <a-table-column title="名称" data-index="name" align="center"></a-table-column>
      <a-table-column title="描述" data-index="desc" align="center"></a-table-column>
      <a-table-column title="操作" align="center">
      <template #cell="{ record }">
        <a-button type="text" @click="deleteProdut(record)">删除</a-button>
      </template>
    </a-table-column>
    </template>
  </a-table>
  <s-dialog v-model:visible="productInfo.createVisible" width="50%" title="新建产品" @close="close">
    <a-form :model="productInfo.createForm" auto-label-width>
      <a-form-item label="卡密类型">
        <a-radio-group v-model="productInfo.createForm.type">
          <a-radio :value="1">时长卡</a-radio>
          <a-radio :value="2">站点次数卡</a-radio>
          <a-radio :value="3">全站次数卡</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item v-if="productInfo.createForm.type !==3" label="生效站点">
      <a-checkbox-group v-model="productInfo.createForm.sites">
        <a-checkbox v-for="(o,key) in webMap" :key="+key" :value="key">{{ o }}</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <div class="flex" v-if="productInfo.createForm.type ===1">
      <a-form-item label="可用时长(天)">
        <a-input-number v-model="productInfo.createForm.num"/>
      </a-form-item>
      <a-form-item label="每日积分">
        <a-input-number v-model="productInfo.createForm.eNum"/>
      </a-form-item>
    </div>
    <a-form-item label="可用积分" v-if="productInfo.createForm.type !==1">
      <a-input-number v-model="productInfo.createForm.num" style="width:200px"/>
    </a-form-item>
    <a-divider />
    <a-form-item label="定价/元">
      <a-input-number v-model="productInfo.createForm.price" style="width:200px"/>
    </a-form-item>
    <a-form-item label="优先级/越小越靠前">
      <a-input-number v-model="productInfo.createForm.sort" style="width:200px" placeholder="越小越靠前"/>
    </a-form-item>
    <a-form-item label="产品名称">
      <a-input v-model="productInfo.createForm.name" style="width:200px" placeholder="产品名称"/>
    </a-form-item>
    <a-form-item label="产品描述">
      <a-input v-model="productInfo.createForm.desc" placeholder="产品描述"/>
    </a-form-item>
    </a-form>
    <template #footer>
      <a-button type="primary" @click="createProduct">确认新建</a-button>
    </template>
  </s-dialog>
</template>

<script setup>
import { webSiteMap } from '@/data-map/index.js'
import { createProductApi, delProduct, getProduct } from "@/api/admin/index";
import { Message } from '@arco-design/web-vue';

const webMap = ref(webSiteMap)

const productInfo = reactive({
  tableData: [],
  createVisible: false,
  webSiteList: [],
  createForm: {
    eNum: 10,
    type: 1,
    num: 7,
    price: 1,
    sort: 0
  }
})

const getProductList = async () => {
  const res = await getProduct()
  productInfo.tableData = res.data || []
}
getProductList()
const createProduct = async () => {
  console.log(productInfo.createForm);
  const reqData = JSON.parse(JSON.stringify(productInfo.createForm))
  if (reqData.type === 2) {
    reqData.eNum = 0
  } else if (reqData.type === 3) {
    reqData.sites = []
    reqData.eNum = 0
  }
  reqData.pid = Math.floor(new Date().getTime() / 1000)
  await createProductApi(reqData)
  Message.success('新建成功')
  productInfo.createVisible = false
  getProductList()
}

const deleteProdut = async (item) => {
  delProduct({ pid: item.pid }).then(res => {
    Message.success('删除成功')
    getProductList()
  })
}
</script>