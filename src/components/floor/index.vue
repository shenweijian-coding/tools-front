<template>
  <div class="floor" v-if="appStore.$state.webConfig?.footer">
    <p v-html="appStore.$state.webConfig.footer"></p>
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from '@/store';
const appStore = useAppStore()
</script>
<style lang="less">
.floor {
  margin-top: 20px;
  width: 100%;
  height: 40px;
  text-align: center;
  color: #f5f5f5f5;
  font-size: 14px;
}
</style>