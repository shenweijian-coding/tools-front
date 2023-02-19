<script setup lang="ts">
import { getInviteInfo, createInviteCode } from '@api/user'
import { Message } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
const userStore = useUserStore()

const inviteData = reactive({
  inviteNum: 0,
  inviteStr: '千图千库包图众图等18网免费下载 https://tools1998.top/#/sucai?f=未登录 登录就可免费下载，不花钱！',
  loading: false,
  list: []
})
// 获取邀请信息
const getInviteData = () => {
  inviteData.loading = true
  getInviteInfo().then(res => {
    inviteData.list = res.data?.list?.length ? res.data.list : []
    inviteData.loading = false
    if (!res.data.inviteCode) {
      createInviteData()
    } else {
      inviteData.inviteNum = res.data.inviteNum
      inviteData.inviteStr = `千图千库包图众图等18网免费下载 https://tools1998.top/#/sucai?f=${res.data.inviteCode} 登录就可免费下载，不花钱！`
    }
  })
}
// 创建邀请信息
const createInviteData = () => {
  inviteData.loading = true
  createInviteCode().then(res => {
    inviteData.loading = false
    inviteData.inviteNum = res.data.inviteNum
    inviteData.inviteStr = `千图千库包图众图等18网免费下载 https://tools1998.top/#/sucai?f=${res.data.inviteCode} 登录就可免费下载，不花钱！`
  })
}
// 分享
const copyShare = () => {
  var textareaC = document.createElement('textarea');
  textareaC.setAttribute('readonly', 'readonly'); //设置只读属性防止手机上弹出软键盘
  textareaC.value = inviteData.inviteStr;
  document.body.appendChild(textareaC); //将textarea添加为body子元素
  textareaC.select();
  var res = document.execCommand('copy');
  document.body.removeChild(textareaC);//移除DOM元素
  Message.success('复制成功！');
}
if (!userStore.userIsLogin) {
  getInviteData()
}
</script>
<template>
  <div class="middle">
    <div class="limit">
      <div class="al-invite">您已经邀请{{ inviteData.inviteNum }}人</div>
      <div class="divone">
        <div class="wenan">
          复制下方文字分享到设计QQ群，QQ空间、微信群、朋友圈、微博、贴吧、等社交平台，通过您的链接每成功注册1人，您即可获得200永久积分，奖励可进行累加，无上限。
        </div>
        <div class="fuzhilj">
          <input type="" disabled id="data" :value="inviteData.inviteStr">
          <a class="fzfx" id="copy" @click="copyShare">复制分享</a>
        </div>
      </div>
    </div>
    <a-table class="invite-table" :data="inviteData.list" :pagination="false" v-loading="inviteData.loading">
      <template #columns>
        <a-table-column title="邀请排名" data-index="is_ok" align="center">
          <template #cell="{ record, rowIndex }">
            第 {{ rowIndex + 1 }} 名
          </template>
        </a-table-column>
        <a-table-column title="用户ID" data-index="is_ok" align="center">
          <template #cell="{ record }">
            {{ record._id }}
          </template>
        </a-table-column>
        <a-table-column title="邀请人数" data-index="is_ok" align="center">
          <template #cell="{ record }">
            已邀请 <span style="color: #ff4451;">{{ record.inviteNum }}</span> 人
          </template>
        </a-table-column>
        <a-table-column title="获得奖励" data-index="is_ok" align="center">
          <template #cell="{ record }">
            {{ record.inviteNum * 200 }} 积分
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>
<style lang="less" scoped>
.middle {
  position: relative;
  margin-bottom: 100px;

  .al-invite {
    padding-top: 20px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-family: 微软雅黑;
    font-size: 23px;
    color: rgb(255, 255, 255);
    letter-spacing: 5px;
  }


  .fuzhilj {
    height: 60px;
    display: flex;

    input {
      width: 731px;
      height: 55px;
      padding: 0px;
      margin: 0px;
      border: 1px solid #ff8610;
      padding-left: 10px;
      font-size: 14px;
      display: block;
      font-weight: bold;
      float: left;
      margin-right: 37px;
      border-radius: 50px;
      padding-left: 20px;
      color: #ff8610;
      outline: none;
      cursor: text;
    }

    a {
      display: inline-block;
      text-align: center;
      font-size: 22px;
      color: #ffffff;
      letter-spacing: 5px;
      height: 57px;
      line-height: 57px;
      width: 196px;
      border-radius: 40px;
      background: #ff8610;
      cursor: pointer;
      box-shadow: 0px 4px 10px #ffd89a;
    }
  }

  .divone {
    margin-top: 50px;
    padding: 30px 97px 30px;
    background: #ffffff;
    .wenan {
      font-size: 16px;
      height: 70px;
      line-height: 30px;
    }
  }
}

.invite-table {
  width: 1200px;
  margin: 20px auto;
}

.limit,
.limit-fixed {
  width: 1200px;
  margin: 0 auto;
}
</style>