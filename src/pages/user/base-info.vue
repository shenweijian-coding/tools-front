<template>
    <div>
    <div class="content">
      <div class="scrollContent">
        <div class="personal-info">
          <div class="info-row">
            登录账号唯一标识
            <div class="spec">{{ userStore.userProfile._id }}</div>
            <a-divider />
          </div>
          <div class="info-row">
            是否关注公众号
            <div class="spec">{{userStore.userProfile.is_fans ? '已关注' : '未关注'}}</div>
            <a-divider />
          </div>
          <div class="info-row">
            关注时间
            <div class="spec">{{timeConvert(+userStore.userProfile.create_time)}}</div>
            <a-divider />
          </div>
          <div class="info-row">
            邮箱
            <div class="spec">{{userStore.userProfile.email || '-'}}</div>
            <a-divider />
          </div>
          <div class="info-row">
            登录IP
            <div class="spec">{{userStore.userProfile.ip}}</div>
            <a-divider />
          </div>
          <div class="float-right mt-10">
            <a-button size="large" @click="logout">退出登陆</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/modules/user/index'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue';
import { timeConvert } from '@/utils/index'
const router = useRouter()
const userStore = useUserStore()
const logout = async() => {
  await userStore.logout()
  setTimeout(() => {
    router.replace('/')
    Message.success('登出成功')
  }, 1000);
}
</script>

<style lang="less" scoped>
.content {
  overflow: auto;
  .scrollContent {
    min-height: 100%;
    width: 100%;
    display: flex;
    .personal-info {
      width: 100%;
      min-height: 100%;
      background: #FFFFFF;
      border-radius: 2px;
      padding: 20px;
      .info-row {
        font-size: 18px;
        font-family: 'PingFangSC-Semibold', 'PingFang SC';
        font-weight: 600;
        color: #313233;
        .spec {
          font-size: 14px;
          font-family: 'PingFangSC-Regular', 'PingFang SC';
          font-weight: 400;
          margin-top: 20px;
        }
        .a-divider {
          background-color: #E1E1E1;
        }
        .a-divider--horizontal {
          margin: 32px 0;
        }
      }
    }
  }
}
</style>
