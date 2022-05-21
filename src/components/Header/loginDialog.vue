<template>
  <a-input placeholder="请输入5位登陆码"></a-input>
  <a-popover position="right">
    <span style="float:right;font-size:12px;color:#919499;cursor: pointer;">获取登录码？</span>
    <template #content>
      <QR />
    </template>
  </a-popover>
</template>

<script setup>
import QR from '../dialog/index.vue'
</script>