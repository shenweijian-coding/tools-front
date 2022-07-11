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

if (import.meta.env.MODE !== 'development') {
  (function noDebuger(){
      function testDebuger(){
          var d=new Date();
          debugger;
          if(new Date()-d>10){
              document.body.innerHTML='<div>做网站不容易，请大哥高台贵手！谢谢你</div>';
              return true;
          }
          return false;
      }
   
      function start(){
          while(testDebuger()){
              testDebuger();
          }
      }
      if(!testDebuger()) {
          window.onblur = function(){
              setTimeout(function(){
                  start();
              },500)
          }
      }
      else{
          start();
      }
   
  })();
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-image:url('');
  height: 100vh;
  width: 100vw;
}
</style>
