<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
import { useUserStore } from '@/store/modules/user/index'
const instance = useUserStore()
instance.$subscribe((_, state) => {
    localStorage.setItem('user', JSON.stringify({ ...state }));
});
const old = localStorage.getItem('user');
if (old) {
    instance.$state = JSON.parse(old);
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #ebebf3;
  background-image:url('');
  height: 100vh;
  width: 100vw;
}
</style>
