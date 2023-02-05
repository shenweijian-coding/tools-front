<template>
    <div>
    <div class="content">
      <div class="scrollContent">
        <div class="personal-info">
          <div class="info-row">
            用户ID
            <div class="spec">{{ data._id }}</div>
            <a-divider />
          </div>
          <div class="info-row">
            加入时间
            <div class="spec">{{data.create_time}}</div>
            <a-divider />
          </div>
          <div class="float-right mt-2">
            <a-button size="large" @click="logout">退出登陆</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue';
import { timeConvert } from '@/utils/index'
import { useUserStore } from '@/store/modules/user/index'
const userStore = useUserStore();
const router = useRouter()
const props = defineProps({
  data: {
    type: Object
  }
})

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
      padding: 20px 20px 0 20px;
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
