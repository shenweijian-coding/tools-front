<template>
  <div class="flex">
    <a-menu
      :style="{ width: '200px'}"
      theme="dark"
      :default-selected-keys="selKey"
      @menu-item-click="menuItemClick"
    >
      <a-menu-item v-for="item in routes" :key="item.path">{{ item.title }}</a-menu-item>
    </a-menu>
    <div class="flex flex-col main">
      <header class="header flex align-center jc-between">
        <span class="text-bold">{{ currentRoute }}</span>
        <a href="/" target="_blank">跳转前台地址</a>
      </header>
      <div class="container">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      routes: [],
      selKey: [],
      currentRoute: ''
    }
  },
  created() {
    const adminRoutes = this.$router.options.routes.find(route => route.auth === 'admin').children
    this.routes = adminRoutes
    console.log(this.$route.path);
    const index = adminRoutes.findIndex(o => o.path == this.$route.path) || 0
    this.selKey = [adminRoutes[index].path]
    this.currentRoute = adminRoutes[index].title
  },
  methods: {
    menuItemClick(key) {
      this.$router.push(key)
      this.currentRoute = this.routes.find(route => route.path == key).title
    }
  }
}
</script>
<style scoped lang="less">
.main{
  width: 100%;
  .header{
    padding: 10px 20px;
    width: 100%;
    height: 44px;
    background: #fff;
  }
  .container{
    margin: 12px;
    height: calc(100vh - 68px);
    padding: 16px;
    overflow: auto;
    background: #FFF;
    }
}

/deep/ .arco-menu-inner{
  height: 100vh;
  overflow: overlay;
}
</style>