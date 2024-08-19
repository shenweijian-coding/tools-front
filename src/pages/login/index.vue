<template>
  <div class="login-box">
    <div class="login-form">
      <header class="login-title">登录</header>
      <!-- <a-input class="mt-m" placeholder="请输入卡密 AAA-BBB-CCC-DDD" v-model="cdkey" size="large"></a-input>
      <a-button class="login-btn" shape="round" type="primary" @click="login">登录</a-button>
      <div class="get-code" v-if="appStore.$state?.webConfig?.carmiAddress">
        <a :href="appStore.$state.webConfig.carmiAddress" class="" target="_blank">没有卡密，去获取→</a>
      </div> -->
      <div class="flex">
          <a-input placeholder="请输入邮箱" button-text="发送" v-model="sendMailAddress" search-button></a-input>
          <a-button @click="handleSendMail" type="primary" :disabled="disabledSendMail">发送</a-button>
        </div>
        <a-input placeholder="请输入发送的邮箱验证码" class="mt-l" v-model="sendYzm"></a-input>
        <a-button type="primary" class="w-100 mt-l" @click="mailLogin">登陆</a-button>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/store';
import { Message } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
const userStore = useUserStore()
const appStore = useAppStore()
appStore.getWebConfig()
import { sendMail } from '@api/home/index'

const cdkey = ref('')
const sendMailAddress = ref()
const disabledSendMail = ref(false)
const sendYzm = ref()
var pattern = /^([0-9a-zA-Z_\.\-\u4e00-\u9fa5])+\@([0-9a-zA-Z_\.\-\])+\.([a-zA-Z]{2,8})$/;

if (localStorage.getItem('cdkey')) {
  cdkey.value = localStorage.getItem('cdkey') || ''
}

const login = async () => {
  if (!cdkey.value) {
    Message.warning('请输入卡密！')
    return
  }
  const params = {
    cdkey: cdkey.value,
  }

  await userStore.login(params)
  localStorage.setItem('cdkey', cdkey.value)
  if(!userStore.userIsLogin) {
    window.location.href = '/'
    Message.success('登录成功')
  }
}
// 发送邮箱
const handleSendMail = async() => {
  if(!sendMailAddress.value) {
    Message.warning('请填写邮箱')
    return
  }
  if(!pattern.test(sendMailAddress.value)) {
    Message.warning('邮箱格式有误')
    return
  }
  const res = await sendMail({ mail: sendMailAddress.value })
  Message.success(res.data)
  disabledSendMail.value = true
  setTimeout(() => {
    disabledSendMail.value = false
  }, 10000);
}
const mailLogin = async () => {
  if(!sendMailAddress.value || !sendYzm.value) {
    Message.warning('请填写邮箱和验证码')
    return
  }
  if(!pattern.test(sendMailAddress.value)) {
    Message.warning('邮箱格式有误')
    return
  }
  const res = await userStore.mailLogin({
    mail: sendMailAddress.value,
    code: sendYzm.value
  })
  Message.success('登录成功')

  window.location.replace('/#/sucai')
}
</script>

<style lang="less" scoped>
.login-box{
  background-color: rgba(255, 255, 255, 0.4);
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  border-radius: 6px;
  margin: 0 auto;
  backdrop-filter: blur(50px);
  display: flex;
  justify-content: center;
  padding: 20px;
  .login-form{
    width: 100%;
    display: flex;
    flex-direction: column;
    .login-title{
      margin-bottom: 12px;
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      color: #fff;
    }
  }
  .login-btn{
    margin-top: 16px;
  }
}
.get-code{
  margin-top: 16px;
  color: rgba(230, 230, 230, 0.8);
  display: flex;
  justify-content: end;
  &:hover{
    color: #fff;
  }
}
</style>