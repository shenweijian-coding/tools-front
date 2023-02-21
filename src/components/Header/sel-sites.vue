<template>
  <s-dialog v-model:visible="userStore.$state.selSiteNum" :title="'请自选' + userStore.$state.selSiteNum +'网'" width="40%" :closeOnClickOverlay="false" >
    <a-checkbox-group :model-value="activeSites" @change="sitesChange">
      <a-checkbox v-for="(name, id) in appStore.$state.webMap" :key="id" :value="id">{{ name }}</a-checkbox>
    </a-checkbox-group>
    <template #footer>
      <a-space>
        <a-button type="primary" @click="handleActive">确定激活</a-button>
      </a-space>
    </template>
  </s-dialog>
</template>

<script setup>
import sDialog from '@/components/s-dialog/index.vue'
import { useAppStore, useUserStore } from '@/store';
import { activeSelAuth } from '@/api/user/index'

const userStore = useUserStore()
const appStore = useAppStore()
if(!appStore.$state.webMap) {
  appStore.getWebList()
}
const activeSites = ref([])
const props = defineProps({
  selVisible: {
    type: Boolean
  }
})

const sitesChange = (site) => {
  if (site.length <= userStore.$state.selSiteNum) {
    activeSites.value = site
  } else {
    alert('当前激活卡密只能选择' + userStore.$state.selSiteNum + '网')
  }
}

const handleActive = async () => {
  if (!activeSites.value?.length || !userStore.$state?.id) {
    alert('系统错误，请退出重新登录')
    return
  }
  const res = await activeSelAuth({ auth: activeSites.value, cdKey: userStore.$state.id })
  await userStore.getUserNum()
}
</script>
<style lang="less" scoped>
  .arco-checkbox{
    width: 100px;
    margin: 12px 0;
  }
</style>