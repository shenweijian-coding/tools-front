<template>
  <div class="p-l">
    <a-form :model="createInfo.searchForm" auto-label-width>
      <a-form-item label="套餐类型">
        <a-radio-group type="button" v-model="createInfo.searchForm.type" @change="createInfo.searchForm.pid = ''">
          <a-radio :value="1">时间卡（每天每网）</a-radio>
          <a-radio :value="4">时间卡（共计次数）</a-radio>
          <a-radio :value="3">次数卡（不限时）</a-radio>
          <a-radio :value="5">次数卡（会过期）</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="选择套餐">
        <a-select v-model="createInfo.searchForm.pid" placeholder="选择套餐" style="width: 300px" >
          <a-option v-for="o of createInfo.prodList.filter(o => o.type == createInfo.searchForm.type)" :value="o.pid"
            :label="o.name + o.memo + '-' + o.money + '元/个'" :key="o.pid" />
        </a-select>
      </a-form-item>

      <a-form-item label="提卡数量">
        <a-input-number v-model="createInfo.searchForm.number" :style="{ width: '180px' }" placeholder="请输入" mode="button"
          :min="1" />
      </a-form-item>

      <div class="text-red text-bold mb-4" v-if="deductPrice">预计消费：{{ deductPrice }}元</div>
      <a-form-item label="">
        <a-popconfirm content="确定生成？" @ok="handleCreateCode">
          <a-button type="primary">生成卡密</a-button>
        </a-popconfirm>
      </a-form-item>

    </a-form>
    <s-dialog :visible="createInfo.visible" width="30%" title="生成结果" @close="close">
      <p>生成结果，可直接全选复制</p>
      <textarea class="textarea-code" cols="40" rows="10" :value="createInfo.createResult"></textarea>
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
import { getProduct, createCode } from '@api/admin/proxy.js'
import { Message } from '@arco-design/web-vue'

const createInfo = reactive({
  searchForm: {
    type: 1,
    pid: '',
    number: 50
  },
  prodList: [],
  visible: false,
  createResult: ''

})

const deductPrice = computed(() => {
  const product = createInfo.prodList.find(o => o.pid == createInfo.searchForm.pid)
  if (product) {
    return ((product.money || 0) * createInfo.searchForm.number).toFixed(2)
  }
  return 0
})
const getInitData = async () => {
  getProduct().then(res => {
    createInfo.prodList = res.data
  })
}
const close = () => {
  createInfo.createResult = ''
  createInfo.visible = false

}
const copyCreateResult = () => {
  var textareaC = document.createElement('textarea');
  textareaC.setAttribute('readonly', 'readonly'); //设置只读属性防止手机上弹出软键盘
  textareaC.value = createInfo.createResult;
  document.body.appendChild(textareaC); //将textarea添加为body子元素
  textareaC.select();
  var res = document.execCommand('copy');
  document.body.removeChild(textareaC);//移除DOM元素
  Message.success('复制成功！');
}
const handleCreateCode = async () => {
  const { type, pid, number } = createInfo.searchForm
  if (!type || !pid || !number) {
    Message.warning('请补充信息')
    return
  }
  const res = await createCode({
    type, pid, number
  })
  let str = ''
  res.data.forEach(it => {
    str += it.code + '\n'
  });
  createInfo.createResult = str
  createInfo.visible = true
}
getInitData()
</script>
<style scoped lang="less">
textarea{
  border: 1px solid #666;
}
</style>