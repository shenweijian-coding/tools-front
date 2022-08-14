<template>
  <div class="row">
    邀请链接：
    <a-button v-if="!inviteInfo.inviteCode" @click="create" size="mini" type="primary">生成专属邀请链接</a-button>
    <span v-else>
      <a class="url" target="_blank">https://tools1998.top/#/sucai?code={{ inviteInfo.inviteCode }}</a>
      <a-button @click="copy(shareText)" type="primary" size="mini">
        一键复制</a-button>
    </span>
  </div>
  <div class="row">
    目前邀请人数：{{ inviteInfo.inviteNum || 0 }}
  </div>
  <div class="row">
    你可以将邀请链接配上文字分享到自己的社交群或者添加以下QQ设计群进行分享，即可坐等奖励到账。
    <div>
      <ul style="display: flex;flex-wrap: wrap;">
        <li class="qqqun" v-for="item in inviteInfo.list" :key="item">群号：{{ item }} <a-button @click="copy(item)"
            type="outline" size="mini">
            复制群号</a-button>
        </li>
      </ul>
    </div>
  </div>
  <div class="row" style="margin-top: 4%">
    邀请规则：
    <p style="line-height:30px">1. 每邀请1人即送3天免费时长,奖励实时到账。</p>
    <p style="line-height:30px">2. 邀请奖励获取的天数可以进行累加。</p>
    <p style="line-height:30px">3. 全站素材可用。</p>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
import { createInviteCode } from '@api/user'
const emit = defineEmits(['createInviteInfo'])

const props = defineProps({
  inviteInfo: {
    type: Object
  }
})
const shareText = computed(() => `分享一个免费素材图片下载网站,用了好久了,感觉还不错 https://tools1998.top/#/sucai?code=${props.inviteInfo.inviteCode}`)

const create = async () => {
  const res = await createInviteCode()
  emit('createInviteInfo', res.data)
}
const copy = (no) => {
  var textareaC = document.createElement('textarea');
  textareaC.setAttribute('readonly', 'readonly'); //设置只读属性防止手机上弹出软键盘
  textareaC.value = no;
  document.body.appendChild(textareaC); //将textarea添加为body子元素
  textareaC.select();
  var res = document.execCommand('copy');
  document.body.removeChild(textareaC);//移除DOM元素
  Message.success('复制成功，快去分享吧');
}
</script>

<style lang="less">
.row {
  margin-top: 20px;
  line-height: 30px;
}

.url {
  color: #3491fa;
  margin-right: 20px;
}

.qqqun {
  // margin-top: 12px;
  min-width: 200px;
  margin-right: 12px;
  margin-bottom: 12px;
}
</style>