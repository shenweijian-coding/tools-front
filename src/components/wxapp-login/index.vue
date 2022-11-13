<template>
  <img class="qr" :src="qrUrl" alt="登录二维码">
  <div style="text-align:center;line-height: 24px;" >
    <span>打开微信扫一扫<br>点击授权登录</span><br>
    <span v-if="countNum > 0">请在{{countNum}}秒之内完成</span>
    <span v-else style="color: red">二维码已过期，请刷新页面；</span>
  </div>
</template>
<script setup lang="ts">
import { getLoginStatus } from '@api/user'
import { useUserStore } from '@/store';
import { Message } from '@arco-design/web-vue';

const userStore = useUserStore()

const emits = defineEmits(['login'])

let loginCode = new Date().getTime()
const qrUrl = ref('/wxappv1/createWxappQR?code=' + loginCode)
const countNum = ref(120)

let timer = window.setInterval(() => {
  getStatus()
}, 5000)
let countTimer = setInterval(() => {
  if (countNum.value < 1) {
    qrUrl.value = 'https://pic1.imgdb.cn/item/6343dc3716f2c2beb1f5a4ed.png'
    loginCode = 0
    clearInterval(countTimer)
  }
  countNum.value--
}, 1000)

const getStatus = async () => {
  const res = await getLoginStatus(loginCode)
  if (res.data === 1) { // 代扫码

  } else if (res.data == 2) { // 过期
    clearInterval(timer)
  } else if (res.data) {
    clearInterval(timer)
    userStore.newLogin(res.data)
    Message.success('登录成功')
    location.reload()
    emits('login')
  }
}

onUnmounted(() => {
  clearInterval(countTimer)
  clearInterval(timer)
})
</script>
<style lang="less">
  .qr{
    width: 100%;
    margin-bottom: 12px;
  }
</style>