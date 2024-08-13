<template>
  <s-dialog :visible="visible" width="600px" title="积分不足提醒" @close="close">
    <p style="line-height: 30px;">您可以选择如下方式获取积分<br>
    1. 赞助本站送积分<a-button size="mini" type="text" status="success" href="#/shop">点我跳转</a-button><br>
    </p>
    <a-divider></a-divider>
    <p style="font-size:12px;color: #919499">赞助费用将用于对接新素材网站及网站运营成本，感谢您的支持和谅解；素材不可用于商用，请注意</p>
  </s-dialog>
</template>
<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
import sDialog from '@/components/s-dialog/index.vue';

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