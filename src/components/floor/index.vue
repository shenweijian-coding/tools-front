<template>
  <div class="floor" v-if="appStore.$state.webConfig?.footer">
    <div class="floor-inner">
      <span class="floor-brand">素材工具箱</span>
      <p v-html="appStore.$state.webConfig.footer"></p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from '@/store';
const appStore = useAppStore()
</script>
<style lang="less">
.floor {
  width: 100%;
  padding: 22px 18px 30px;
  background: #eef2f7;
  color: #64748b;
  font-size: 13px;

  .floor-inner {
    width: min(1180px, 100%);
    min-height: 54px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    margin: 0 auto;
    padding: 0 18px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.72);
  }

  .floor-brand {
    color: #111827;
    font-weight: 700;
    white-space: nowrap;
  }

  p {
    margin: 0;
    line-height: 1.7;
    text-align: right;
  }

  a {
    color: #0f766e;
  }
}

@media (max-width: 640px) {
  .floor {
    .floor-inner {
      align-items: flex-start;
      flex-direction: column;
      padding: 14px;
    }

    p {
      text-align: left;
    }
  }
}
</style>
