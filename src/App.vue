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

// if (import.meta.env.MODE !== 'development') {
//   (function noDebuger(){
//       function testDebuger(){
//           var d=new Date();
//           debugger;
//           if(new Date()-d>10){
//               document.body.innerHTML='<div>做网站不容易，请大哥高台贵手！谢谢你！加QQ18346638245，可以一起学习哈！</div>';
//               return true;
//           }
//           return false;
//       }
   
//       function start(){
//           while(testDebuger()){
//               testDebuger();
//           }
//       }
//       if(!testDebuger()) {
//           window.onblur = function(){
//               setTimeout(function(){
//                   start();
//               },500)
//           }
//       }
//       else{
//           start();
//       }
   
//   })();
// }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-image:url('');
  /* height: 100vh;
  width: 100vw; */
}
/* 滚动条美化 */
::-webkit-scrollbar {
  width: 8px;
  height: 7px;
  background-color: #f1f1f1;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  /* box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
  border-radius: 10px;
  background-color: #f1f1f1;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  /* box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1); */
  background-color: #c8c8c8;
}


</style>
