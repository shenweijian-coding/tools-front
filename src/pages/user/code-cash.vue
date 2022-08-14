<template>
  <div style="margin-top: 20px;">
    <div>
      请输入卡密：
      <a-input placeholder="请输入卡密点击激活" style="max-width: 400px" v-model="code"></a-input>
      <a-button type="primary" @click="active">激活</a-button>
    </div>
  </div>
  <div style="margin-top: 30px;">
    卡密说明：
    <p style="line-height:30px">激活成功后立即失效，无法重复使用；</p>
    <p style="line-height:30px">卡密兑现的积分可以进行累加,不会重置；</p>
  </div>

</template>

<script setup lang="ts">
import { codeConvert } from '@api/user'
import { Message } from '@arco-design/web-vue';
const code = ref('')
const active = async () => {
  try {
    if (!code.value) {
      Message.warning('请输入卡密')
      return
    }
    const res = await codeConvert({
      code: code.value
    })
    if (res.data) {
      Message.success(res.data)
    }
  } catch (error) {

  } finally {
    code.value = ''
  }
}
</script>