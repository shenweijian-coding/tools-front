<template>
  <div class="p-l">
    <a-form :model="createInfo.searchForm" auto-label-width>
      <a-form-item label="套餐类型">
        <a-radio-group type="button" v-model="createInfo.searchForm.type" @change="getInitData">
          <a-radio :value="1">自选套餐</a-radio>
          <a-radio :value="2">多网套餐</a-radio>
          <a-radio :value="3">积分套餐</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="选择套餐">
        <a-select v-model="createInfo.searchForm.pid" placeholder="选择套餐" style="width: 300px">
          <a-option v-for="o of createInfo.prodList" :value="o.pid" :label="o.name + o.memo" :key="o.pid"/>
        </a-select>
      </a-form-item>

      <a-form-item label="提卡数量">
        <a-input-number v-model="createInfo.searchForm.number" :style="{width:'180px'}" placeholder="请输入" mode="button" :min="1"/>
      </a-form-item>

      <a-form-item label="">
        <a-button type="primary" @click="handleCreateCode">生成卡密</a-button>
      </a-form-item>

    </a-form>
  </div>
</template>
<script setup>
import { reactive } from 'vue';
import { getProduct, createCode } from '@api/admin/proxy.js'
import { Message } from '@arco-design/web-vue'

const createInfo = reactive({
  searchForm: {
    type: 1,
    pid: '',
    number: 1
  },
  prodList: []

})

const getInitData = async () => {
  getProduct({ type: createInfo.searchForm.type }).then(res => {
    createInfo.prodList = res.data
  })
}

const handleCreateCode = async () => {
  const { type, pid, number } = createInfo.searchForm
  if( !type || !pid || !number) {
    Message.warning('请补充信息')
    return
  }
  // 然后算钱
  const current = createInfo
  const res = await createCode({
    type, pid, number
  })
}
getInitData()
</script>