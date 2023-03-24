<template>
  <div class="plugin-box">
    <div style="width: 140px; height: 40px; margin: 20px auto 0;">
      <a :href="pluginUrl" class="btna">书签插件</a>
    </div>
    <div style="padding-left: 10px; font-size: 14px; text-align: center; line-height: 30px; margin:20px 0;">
      光标移动到【书签插件】按钮上，鼠标左键按住拖放到【浏览器书签栏】，添加完成；<br> 添加好插件后，到素材官网找到要下载的素材页，点击添加好的书签插件就可以直接搜索下载；</div>
    <video controls>
      <source src="http://cloud.video.taobao.com/play/u/null/p/1/e/6/t/1/402182286428.mp4" type="video/mp4">
    </video>
  </div>
</template>

<script setup>
console.log(window.location.host);
const host = window.location.host
const pluginUrl = ref(`javascript:(function(a){if(window.location.hostname != '${host}' && window.location.hostname != 'localhost'){if(window.location.href.indexOf('woofeng.cn') != -1){if(document.getElementById('myModal').style.cssText.indexOf('block')==-1||document.getElementById('sc_aid').value==''){alert('请先选择素材点击后再试！');return false;}else{window.location.href = 'http://${host}/#/sucai?url=' + document.getElementById('sc_aid').value}}else{window.location.href = 'http://${host}/#/sucai?url=' + window.location.href}}})(window);`)
</script>

<style lang="less" scoped>
.plugin-box {
  display: flex;
  width: 60%;
  box-sizing: border-box;
  padding: 1.25rem 2.5rem 1.25rem 2.5rem;
  background-color: #fff;
  position: relative;
  margin: 20px auto 0;
  backdrop-filter: blur(.625rem);
  border-radius: .2rem;
  flex-direction: column;
  justify-content: space-between;

  .btna {
    padding: 12px 32px;
    text-align: center;
    display: flex;
    align-items: center;
    text-decoration: none;
    float: left;
    font-size: 14px;
    border-radius: 30px;
    color: #fff;
    background-color: #4080ff;

    &:hover {
      background-color: #3a6dee;
      transition: all .3s;
      box-shadow: 0 5px 20px 0 #3a6dee;
    }
  }
}
</style>