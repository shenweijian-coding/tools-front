<template>
  <s-dialog :visible="visible" width="500px" title="权限不足" @close="close">
    <p style="line-height: 30px;">您可以选择如下方式获取权限<br>
    1. 站内直接充值（实时到账）<a-button size="mini" type="text" status="success" href="#/shop">点我跳转</a-button><br>
    <template v-if="appStore.$state?.webConfig?.carmiAddress">
      2. 其它站点购买（发送卡密）    <a style="color: #42c562" target="_blank" :href="appStore.$state.webConfig.carmiAddress">点我跳转</a>
    </template>
    </p>
    <a-divider></a-divider>
    <p style="font-size:12px;color: #919499">充值费用将用于对接新素材网站及网站运营成本，感谢您的支持</p>
  </s-dialog>
</template>
<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
import sDialog from '@/components/s-dialog/index.vue';
import { useAppStore } from '@/store';
const appStore = useAppStore()

const emit = defineEmits(['close', 'getDetail'])
const props = defineProps({
  visible: Boolean
})
const close = () => {
  emit('close')
}
const getDetail = () => {
  emit('getDetail')
}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  align-items: center;
}
</style>