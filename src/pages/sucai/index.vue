<script setup>
import Input from '@/components/Input/index.vue'
import { getPngUrl, getInfo, checkInfo, webCheck } from '@api/sucai/index'
import { Message, Modal } from '@arco-design/web-vue';
import CheckDialog from '@/components/check-dialog/index.vue'
import NumLack from '@/components/NumLack/index.vue'
import sDialog from '@/components/s-dialog/index.vue'
import { useUserStore } from '@/store';
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const route = useRoute()
const loading = ref(false)
const checkLoading = ref(false)
const listLoading = ref(false)
const href = ref('')
const visible = ref(false)
const webSiteCheckVisible = ref(false)
const sheji90CheckVisible = ref(false)
const zhongtuUrl = ref('')
const webSiteCheckInfo = reactive({
  imgUrl: '',
  webSiteCheckCode: ''
})
const webList = reactive({
  list: []
})
let link = ''
const options = reactive({
  list: []
})
listLoading.value = true
getInfo().then(res => {
  console.log(res)
  webList.list = res.data.webList
  listLoading.value = false
})
// 被邀请的逻辑
setTimeout(() => {
  const { query } = toRaw(route)
  if (query.value.code) {
    localStorage.setItem('code', query.value.code)    
  }
});
const getDownUrl = async (url) => {
  try {
    zhongtuUrl.value = ''
    loading.value = true
    href.value = ''
    options.list = []
    console.log(url.value);
    link = url.value
    const res = await getPngUrl({ url: url.value })
    if (res.data.status) { // 校验状态
      if (res.data.status === 1001) {
        visible.value = true
        return
      } else if (res.data.status === 1002) { // 网站自己的校验
        if (res.data.id === 8) { // 90设计验证
          sheji90CheckVisible.value = true
          webSiteCheckInfo.imgUrl = res.data.handle
          setTimeout(() => {
            sheji90check()
          });
        } else { // 风云办公验证       
          webSiteCheckVisible.value = true
          webSiteCheckInfo.imgUrl = res.data.handle
        }
        return
      }
    }

    if (res.data.result) {
      if (res.data.options) {
        options.list = res.data.options
        console.log(res.data.options);
      } else {
        Message.success('解析成功了，请点击立即下载按钮😊')
        await userStore.getUserNum()
        if (res.data.id === 17) {
          zhongtuUrl.value = res.data.psd
          Message.warning('由于众图网官方限制，下载众图时请使用迅雷，否则无法下载！')
        } else {
          href.value = res.data.psd
        }
      }
    }

  } catch (error) {

  } finally {
    loading.value = false
  }

}
const getCurDownUrl = async (item) => {
  try {
    loading.value = true
    const res = await getPngUrl({
      url: link,
      option: toRaw(item)
    })
    if (res.data.result) {
      await userStore.getUserNum()
      window.open(res.data.psd)
    }
    console.log(res);
  } catch (error) {

  } finally {
    loading.value = false
  }
}
// const checkCode = async (downCode) => {
//   const { data } = await checkInfo({ code: downCode })
//   if (data.result) {
//     Message.success('校验成功！请重新点击搜索进行下载！')
//     visible.value = false
//   }
// }
const websitCheckCode = async () => {
  try {
    if (!webSiteCheckInfo.webSiteCheckCode.trim()) {
      Message.error('请输入')
      return
    }
    const res = await webCheck({ url: link, code: webSiteCheckInfo.webSiteCheckCode })
    if (res.data.result) {
      await userStore.getUserNum()
      window.open(res.data.psd)
    }
  } catch (error) {
    console.log(error);
  } finally {
    close()
  }
}
// 90设计的校验
const sheji90check = async () => {
  var cat = document.getElementById('dragbox');
  var canvas3 = document.getElementById("c3")
  var canvas4 = document.getElementById("c4")
  canvas3.height = 150;
  canvas3.width = 240;
  canvas4.width = 240;
  var cxt3 = canvas3.getContext("2d")
  var cxt4 = canvas4.getContext("2d")
  const { x: srcX, y } = cat.getBoundingClientRect()
  var t = 0
  cat.ondragstart = function (e) {
    console.log('开始');
  };
  cat.ondrag = function (e) {
    var x = e.pageX;
    if (x === 0 || (x < srcX + 28) || x > srcX + 216) {//不处理最后一刻x,y都为0 的情景
      return
    };
    t = x - srcX
    canvas4.style.left = x - 28 - srcX + 'px';
    cat.style.left = x - 28 - srcX + 'px';
    e.preventDefault();

  }
  cat.ondragend = async function (e) {
    try {
      checkLoading.value = true
      console.log(cat.style.left);
      const res = await webCheck({ url: link, code: parseFloat(cat.style.left) })
      console.log(res);
      if (res.data.result) {
        href.value = res.data.psd
      }
      Message.success('验证成功了,请点击立即下载按钮哈')
    } catch (error) {
      console.log(error);
      sheji90CheckVisible.value = false
    } finally {
      sheji90CheckVisible.value = false
      checkLoading.value = false
    }

    // 拖动完成 用数据校验
  }

  var img = new Image();
  img.src = webSiteCheckInfo.imgUrl
  img.onload = function () {
    cxt3.drawImage(img, 0, 0, canvas3.width, canvas3.height, 0, 0, 240, 150);
    cxt4.drawImage(img, 0, 150, canvas3.width, canvas3.height, 0, 0, 240, 150);
  }
}
const close = () => {
  visible.value = false
  webSiteCheckVisible.value = false
  webSiteCheckInfo.webSiteCheckCode = ''
}
const copyUrl = () => {

  var textareaC = document.createElement('textarea');
  textareaC.setAttribute('readonly', 'readonly'); //设置只读属性防止手机上弹出软键盘
  textareaC.value = zhongtuUrl.value;
  document.body.appendChild(textareaC); //将textarea添加为body子元素
  textareaC.select();
  var res = document.execCommand('copy');
  document.body.removeChild(textareaC);//移除DOM元素
  Message.success('复制成功，请粘贴到迅雷进行下载');
}

</script>

<template>
  <div class="page-design app-page appView">
    <div v-loading="loading">
      <div class="app-header-box">
        <h1 class="app-heade-title">设计资源搜索</h1>
        <h3 class="app-header-tips"></h3>
        <div class="app-header-input">
          <Input @getPlay="getDownUrl" :loading="loading" />
          <div v-if="zhongtuUrl" class="mt-4">
            <a-button @click="copyUrl" type="primary">复制众图下载链接</a-button>
          </div>
          <a :href="href" v-else-if="href" target="_blank" referrerpolicy="no-referrer">
            <a-button class="mt-4" type="primary">立即下载</a-button>
          </a>
          <span v-if="options.list.length">
            <a-space class="mt-4">
              <a-button v-for="(item, i) in options.list" :key="i" type="dashed" status="success"
                @click="getCurDownUrl(item)">{{ item.text }}</a-button>
            </a-space>
          </span>
        </div>
      </div>
      <div class="app-web-list" v-loading="listLoading">
        <a-row>
          <a-col :xs="12" :sm="12" :md="8" :lg="6" :xl="6" v-for="it in webList.list" :key="it.id">
            <a :href="it.webUrl" target="_blank" title="点击跳转官网">
              <!-- <a-tooltip :content="userStore.userIsLogin ? '正常使用' : it.webNum + '积分一次'" mini> -->
                <div class="app-weblist-item shou">
                  <div class="item-logo"><img :src="it.webLogo"></div>
                  <div class="item-info">
                    <div class="title">
                      {{ it.webName }} [{{userStore.userIsLogin ? '正常使用' : (it.webNum + '积分/次')}}]
                    </div>
                    <div class="tips">{{ it.webTips }}</div>
                  </div>
                </div>
              <!-- </a-tooltip> -->
            </a>
          </a-col>
        </a-row>
      </div>
    </div>
    <NumLack :visible="visible" @close="close" />

    <s-dialog v-model:visible="webSiteCheckVisible" @close="close" v-loading="checkLoading">
      <img :src="webSiteCheckInfo.imgUrl" style="width:100%;margin-bottom:10px;" @click="refreshYzm">
      <a-input-search placeholder="请输入图形码" v-model="webSiteCheckInfo.webSiteCheckCode" button-text="提交" search-button
        @search="websitCheckCode" />
    </s-dialog>
    <!-- // 90设计的滑动验证码 -->
    <s-dialog v-model:visible="sheji90CheckVisible" @close="close" title="拖动滑块完成拼图">
      <div style="width: 100%"  v-loading="checkLoading">
        <div class="canvas-box">
          <canvas id="c3"></canvas>
          <canvas id="c4"></canvas>
        </div>
        <div class="geetest_slider geetest_ready">
          <div id="dragbox" class="geetest_slider_button" draggable="true" style="left: 0"></div>
        </div>
      </div>
    </s-dialog>
  </div>
</template>

<style lang="less" scoped>
.app-page {
  width: 95%;
  max-width: 1300px;
  margin: 24px auto auto;

  .app-header-box {
    display: block;
    border-radius: 8px;
    height: 360px;
    background-color: #d3ddee;
    -webkit-box-shadow: 0 0 10px 0 rgb(0 0 0 / 24%);
    box-shadow: 0 0 10px 0 rgb(0 0 0 / 24%);
    text-shadow: 0 0 10px rgb(0 0 82 / 0%);
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: cover;
    text-align: center;

    .app-heade-title {
      color: #f0f1f5;
      font-size: 28px;
      padding: 40px 0 8px;
    }

    .app-header-tips {
      color: hsla(0, 0%, 100%, .6);
      font-size: 14px;
      margin-bottom: 28px;
    }

    .app-header-input {
      width: 96%;
      margin: auto;
      max-width: 650px;
    }
  }

  .app-web-list {
    padding: 16px 8px;
    background-color: hsla(0, 0%, 100%, .78);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    border-radius: 10px;
    width: 90%;
    max-width: 1400px;
    min-height: 200px;
    margin: auto;
    -webkit-box-shadow: 0 8px 20px 0 rgb(0 0 0 / 6%);
    box-shadow: 0 8px 20px 0 rgb(0 0 0 / 6%);
    overflow: hidden;

    .app-weblist-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      -webkit-transition: All .25s;
      transition: All .25s;

      &:hover {
        background-color: hsla(0, 0%, 95.3%, .6196078431372549);
        border-radius: 8px;
      }
    }

    .item-logo {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #fff;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;

      img {
        width: 100%;
        height: 100%;
        padding: 4px;
        border-radius: 50%;
        border-color: rgba(76 175 80/15%);
        overflow: hidden;
        // width: 48px;
        -webkit-transition: All .25s;
        transition: All .25s;
      }
    }

    .item-info {
      padding: 0 16px;

      .tips {
        font-size: 12px;
        color: #9c9c9c;
        white-space: nowrap;
      }
    }
  }
}

.page-design .app-web-list {
  margin-top: -130px;
}

.app-header-box {
  background-image: url(https://pic1.zhimg.com/v2-f86bcbe20a5d485df169c6bbb402e030_r.jpg);
}

.shou {
  cursor: pointer;
}

.zhongtu {
  color: #fff;
  background: #165dff;
  padding: 8px 14px;
  display: inline-block;
  margin-left: 12px;
}

.canvas-box {
  margin: 0 auto;
  position: relative;
  height: 150px;
  width: 240px;
  background-color: #000;
  overflow: hidden;

  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
}

.geetest_slider {
  position: relative;
  margin: 5.39% 0;
  // width: 93.52%;
  padding: 0 0 15.67% 0;
  height: 0;
  overflow: visible;
  background-color: white;
  background-size: 100%;
  background-position: 0 0;
}

.geetest_slider_track {
  position: absolute;
  top: 50%;
  left: 0;
  height: 38px;
  margin: -19px 0 0 0;
  padding: 0 0 0 25%;
}

.geetest_slider_tip {
  position: relative;
  width: 100%;
  height: 100%;
  line-height: 38px;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  color: #88949d;
}

.geetest_slider_button {
  position: absolute;
  top: 0;
  left: 0;
  margin: -4.62% 0 0 -2.31%;
  width: 25.38%;
  padding: 0 0 25.38% 0;
  height: 0;
  cursor: move;
  font-size: 0;
  // background-size: 393.93939%;
  background-position: 0 10.8642%;
}

.geetest_slider,
.geetest_slider_button {
  background-image: url(https://static.geetest.com/static/ant/sprite.1.2.6.png)
}
</style>