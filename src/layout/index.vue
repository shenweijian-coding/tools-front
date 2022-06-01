<template>
  <Header></Header>
  <div class="top-tip_b" v-if="isClose">
    <div class="tipBox">
    <span class="desc">
      <span>🎉</span>{{notice}}
    </span>
    <icon-close style="line-height:30px;cursor: pointer;margin-left: 100px;" @click="close"/>
    </div>
    </div>
  <router-view></router-view>
  <floor></floor>
</template>

<script setup>
import Header from "@components/Header/index.vue"
import Floor from "@components/floor/index.vue"
import { IconClose } from '@arco-design/web-vue/es/icon';
import { getNoticeInfo } from '@/api/home/index'
const notice = ref('')
getNoticeInfo().then(res => {
  notice.value = res.data
})
const isClose = ref(true)
const close = () => {
  isClose.value = false;
}
</script>

<style lang="less">
.top-tip_b {
    background: -webkit-linear-gradient(359.88deg, #E6FFFF -1.2%, #ECF1FE 100.05%);
    background: -o-linear-gradient(359.88deg, #E6FFFF -1.2%, #ECF1FE 100.05%);
    background: linear-gradient(90.12deg, #E6FFFF -1.2%, #ECF1FE 100.05%);
    color: #436ef3;
    width: 100%;
    height: 30px;
    font-weight: 500;
    font-size: 14px;
    line-height: 30px;

    .tipBox{
      text-align: center;
    }
}
</style>