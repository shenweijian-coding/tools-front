<template>
  <div class="main_1200" v-loading="state.loading">
    <div class="py-6">
      <Input @getPlay="getListByName" :placeholder="'已收录国外字体' + state.total + '个，复制名称可以搜索，每日新增'" btnText="搜索字体"/>
    </div>

    <template v-if="state.list.length">
      <div v-for="item in state.list" :key="item._id" class="list-font flex jc-between box-shadow">
        <span>{{ item.fontName }} - 40积分</span>
        <a-button shape="round" @click="download(item)">下载字体</a-button>
      </div>
      <div class="bg-white flex jc-center ai-center py-4 box-shadow">
        <a-pagination :total="state.total" simple :page-size="10" @change="pageChange"/>
      </div>
    </template>
    <div  v-else class=" flex jc-between box-shadow">
      <a-empty></a-empty>
    </div>
  </div>
</template>

<script setup>
import { getFontList, downloadFont } from '@/api/font/index'
import Input from '@/components/Input/index.vue'

const state = reactive({
  list: [],
  total: 0,
  loading: false
})
const pageChange = (page) => {
  console.log(page);
  getList(page)
  
}
const getList = (page = 1, name) => {
  state.loading = true
  getFontList({page,searchName: name}).then(res => {    
    state.list = res.data.list
    state.total = res.data.total
    state.loading = false
  }).catch(err => {
    state.loading = false
  })
}
const getListByName = (name) => {
  console.log(name.value);
  getList(1, name.value)
}
const download = (item) => {
  state.loading = true
  downloadFont({ fontId: item._id }).then(res => {
    state.loading = false
    window.open(res.data,'_blank')
  }).catch(err => {
    state.loading = false
  })
}
onMounted(() => {
  getList()
})
</script>
<style lang="less" scoped>
.main_1200 {
  margin: 0 auto;
  width: 1200px;
}

.list-font {
  width: 100%;
  height: 62px;
  border-radius: 12px;
  background-color: #FFFFFF;
  margin-bottom: 20px;
  padding: 12px;
  margin: 10px 0;
}
.box-shadow{
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

}
</style>