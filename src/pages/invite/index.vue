<script setup lang="ts">
import { getInviteInfo, createInviteCode } from '@api/user'
import { Message } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
const userStore = useUserStore()

const inviteData = reactive({
  inviteNum: 0,
  inviteStr: '20+网站素材极速下载 https://tools1998.top/#/sucai?f=未登录 众多设计师都在用！',
  loading: false,
  list: []
})
// 获取邀请信息
const getInviteData = () => {
  inviteData.loading = true
  getInviteInfo().then(res => {
    inviteData.list = res.data.list
    if (!res.data.inviteCode) {
      createInviteData()
    } else {
      inviteData.inviteNum = res.data.inviteNum
      inviteData.inviteStr = `20+网站素材极速下载 https://tools1998.top/#/sucai?f=${res.data.inviteCode} 众多设计师都在用！`
    }
  }).finally(() => {
    inviteData.loading = false
  })
}
// 创建邀请信息
const createInviteData = () => {
  inviteData.loading = true
  createInviteCode().then(res => {
    inviteData.inviteNum = res.data.inviteNum
    inviteData.inviteStr = `20+网站素材极速下载 https://tools1998.top/#/sucai?f=${res.data.inviteCode} 众多设计师都在用！`
  }).finally(() => {
    inviteData.loading = false
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
  <div class="middle" v-loading="inviteData.loading">
    <div class="left"></div>
    <div class="right"></div>
    <div class="limit">
      <div class="al-invite">您已经邀请{{ inviteData.inviteNum }}人</div>
      <div class="divone">
        <div class="wenan">
          复制下方文字分享到设计QQ群，QQ空间、微信群、朋友圈、微博、贴吧、等社交平台，通过您的链接每成功注册1人，您即可获得200积分，奖励可进行累加，无上限。
        </div>
        <div class="fuzhilj">
          <input type="" disabled id="data" :value="inviteData.inviteStr">
          <a class="fzfx" id="copy" @click="copyShare">复制分享</a>
        </div>
      </div>
    </div>
    <a-table class="invite-table" :data="inviteData.list" :pagination="false">
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
  background: url(https://static.616pic.com/www_invite/image/img3.png) top center no-repeat;
  position: relative;

  margin-bottom: 100px;

  .left {
    z-index: -1;
    position: absolute;
    left: 0;
    top: 194px;
    width: 354px;
    height: 603px;
    background: url(https://static.616pic.com/www_invite/image/img1.png) center center no-repeat;
  }

  .right {
    z-index: -1;
    position: absolute;
    right: 0;
    top: 194px;
    width: 334px;
    height: 717px;
    background: url(https://static.616pic.com/www_invite/image/img2.png) center center no-repeat;
  }

  .al-invite {
    padding-top: 220px;
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
    -webkit-box-shadow: 0px 0px 20px #c7c7c7;
    -moz-box-shadow: 0px 0px 20px #c7c7c7;
    box-shadow: 0px 0px 20px #c7c7c7;

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
  -webkit-box-shadow: 0px 0px 20px #c7c7c7;
  -moz-box-shadow: 0px 0px 20px #c7c7c7;
  box-shadow: 0px 0px 20px #c7c7c7;
}

.limit,
.limit-fixed {
  width: 1200px;
  margin: 0 auto;
}
</style>