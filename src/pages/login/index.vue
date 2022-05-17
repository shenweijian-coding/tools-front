<template>
 <div class="login">
  <div class="loginPart">
    <h2>用户登录</h2>
  <a-form>
    <div class="inputElement">
      <a-input v-model="userInfo.username" placeholder="请输入用户名/手机号 "></a-input>
    </div>
    <div class="inputElement">
      <a-input v-model="userInfo.password" placeholder="请输入密码 "></a-input>
    </div>
    <div>
    <a-button type="primary" >登录</a-button>
    </div>
    <div style="text-align: right;color: white;">
    </div>
  </a-form>
  </div>
  </div>
</template>

<script setup>
    const imgSrc= ref('http://qiniu.mouae.com/header_bg_design.jpg')
    const userInfo = reactive({
        username: '',
        password: '',
    })
</script>
<style scoped>
.loginPart{
    position:absolute;
    /*定位方式绝对定位absolute*/
    top:40%;
    left:50%;
    /*顶和高同时设置50%实现的是同时水平垂直居中效果*/
    transform:translate(-50%,-50%);
    /*实现块元素百分比下居中*/
    box-shadow: 0 0 2.1875rem 0 rgb(154 161 171 / 15%);
    width:450px;
    padding:50px;
    padding: 16px 8px;
    background-color: hsla(0,0%,100%,.78);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    /* border-radius: 10px; */
  }
  .loginPart h2{
    margin:0 0 30px;
    padding:0;
    color: #fff;
    text-align:center;
    /*文字居中*/
  }
  .loginPart .inputbox{
    position:relative;
  }
  .loginPart .inputElement input{
    width: 100%;
    padding:10px 0;
    font-size:16px;
    color:#fff;
    letter-spacing: 1px;
    /*字符间的间距1px*/
    margin-bottom: 30px;
    border:none;
    border-bottom: 1px solid #fff;
    outline:none;
    /*outline用于绘制元素周围的线
    outline：none在这里用途是将输入框的边框的线条使其消失*/
    background: transparent;
    /*背景颜色为透明*/
  }
</style>