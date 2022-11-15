<script setup>
import Input from '@/components/Input/index.vue'
import { getDownFile, getHukeFile } from '@api/play'

import { getPngUrl, getInfo, checkInfo, webCheck } from '@api/sucai/index'
import { Message, Modal } from '@arco-design/web-vue';
import CheckDialog from '@/components/check-dialog/index.vue'
import NumLack from '@/components/NumLack/index.vue'
import sDialog from '@/components/s-dialog/index.vue'
import { useUserStore } from '@/store';
import { useRoute } from 'vue-router'
import { dateFormate } from '@/utils/index'
import SvgIcon from "@components/SvgIcon/index.vue"
import 'xgplayer';
import HlsJsPlayer from 'xgplayer-hls.js'; // M3U8格式

const userStore = useUserStore()
const route = useRoute()
const loading = ref(false)
const checkLoading = ref(false)
const listLoading = ref(false)
const href = ref('')
const visible = ref(false)
const webSiteCheckVisible = ref(false)
const sheji90CheckVisible = ref(false)
const baotuCheckVisible = ref(false)
const checkVisible = ref(false)
const zhongtuUrl = ref('')
const playInstance = ref('')
const downVisible = ref(false)
// 视达虎课播放
const shidahukeInfo = reactive({
  visible: false,
  id: '',
  playUrl: '',
  params: ''
})

const webSiteCheckInfo = reactive({
  imgUrl: '',
  webSiteCheckCode: ''
})
const baotuCheckInfo = reactive({
  content: '',
  params: ''
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
        } else if (res.data.id === 5) { // 包图验证
          console.log('baotu');
          baotuCheckVisible.value = true
          baotuCheckInfo.content = res.data.handle
          baotuCheckInfo.params = res.data.batch
          baotuCheckInfo.setCookies = res.data.setCookies
        } else { // 风云办公验证       
          webSiteCheckVisible.value = true
          webSiteCheckInfo.imgUrl = res.data.handle
        }
        return
      } else if (res.data.status === 1000) { // 爬虫校验
        checkVisible.value = true
      }
    }

    if (res.data.result) {
      if (res.data.options) {
        options.list = res.data.options
      } else {
        Message.success('解析成功了，请点击立即下载按钮')
        await userStore.getUserNum()
        if (res.data.id === 17) {
          zhongtuUrl.value = res.data.psd
          Message.warning('由于众图网官方限制，下载众图时请使用迅雷，否则无法下载！')
        } else if ([1, 2].includes(res.data.id)) {
          shidahukeInfo.id = res.data.id
          shidahukeInfo.visible = true
          shidahukeInfo.params = res.data
          setTimeout(() => {
            playInstance.value = new HlsJsPlayer({
              id: 'mse',
              url: res.data.psd,
              lang: "zh-cn",
              autoplay: true,
              playbackRate: [0.5, 1, 1.5, 2],
              // height: '300px',
              width: '100%'
            });
          });
        } else {
          downVisible.value = true
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
      options.list = []
      Message.success('解析成功了，请点击立即下载按钮')
      userStore.getUserNum()
      downVisible.value = true
      href.value = res.data.psd
      // window.open(res.data.psd)
    }
    console.log(res);
  } catch (error) {

  } finally {
    loading.value = false
  }
}
const checkCode = async (downCode) => {
  const { data } = await checkInfo({ code: downCode })
  if (data.result) {
    Message.success('校验成功！请重新点击搜索进行下载！')
    checkVisible.value = false
  }
}
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
        downVisible.value = true
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
  checkVisible.value = false
  webSiteCheckVisible.value = false
  webSiteCheckInfo.webSiteCheckCode = ''
  playInstance.value = ''
}
const copyUrl = (copyText) => {

  var textareaC = document.createElement('textarea');
  textareaC.setAttribute('readonly', 'readonly'); //设置只读属性防止手机上弹出软键盘
  textareaC.value = copyText;
  document.body.appendChild(textareaC); //将textarea添加为body子元素
  textareaC.select();
  var res = document.execCommand('copy');
  document.body.removeChild(textareaC);//移除DOM元素
  Message.success('复制成功！');
}
const baotuCheckClick = async e => {
  try {
    console.log(e.target.getAttribute('data-key'));
    const res = await webCheck({
      url: link, code: {
        setCookies: baotuCheckInfo.setCookies,
        params: `answer_key=${e.target.getAttribute('data-key')}${baotuCheckInfo.params}`
      }
    })
    baotuCheckVisible.value = false
    if (res.data && res.data.psd) {
      options.list = []
      Message.success('解析成功了，请点击立即下载按钮')
      userStore.getUserNum()
      downVisible.value = true
      href.value = res.data.psd
      // window.open(res.data.psd)
    }
  } catch (error) {

  } finally {
    baotuCheckVisible.value = false
  }

}
// 下载视达素材
const downFile = async () => {
  const { data } = await getDownFile(shidahukeInfo.params)
  console.log(data);
  window.open(data)
}
// 下载虎课素材
const handleHukeFile = async (type) => {
  const res = await getHukeFile({ id: shidahukeInfo.params.hukeId, type: type })
  if (res.data) {
    window.open(res.data)
  } else {
    Message.error('出现错误,请联系管理员！')
  }
}
</script>

<template>
  <div class="page-design app-page appView">
    <div v-loading="loading">
      <div class="app-header-box">
        <h1 class="app-heade-title">提供一站式设计资源搜索服务</h1>
        <div class="app-header-input">
          <div class="app-header-func" v-if="!userStore.userIsLogin">
            常用功能：
            <span>
              <router-link to="/shop">在线充值</router-link>
            </span>&nbsp;&nbsp;
            <span>
              <router-link to="/user?key=5">卡密激活</router-link>
            </span>&nbsp;&nbsp;
            <span>
              <router-link to="/user?key=2">下载记录</router-link>
            </span>
          </div>
          <Input @getPlay="getDownUrl" :loading="loading" />
          <span v-if="options.list.length">
            <a-space class="mt-2">
              <a-button v-for="(item, i) in options.list" :key="i" type="dashed" status="success"
                @click="getCurDownUrl(item)">{{ item.text }}</a-button>
            </a-space>
          </span>
        </div>
      </div>
      <div class="app-web-list" v-loading="listLoading">
        <div class="flex justify-around hidden pl-4 pr-4 mb-3 text-sm lg:flex" v-if="!userStore.userIsLogin">
          <span class="flex items-center justify-center">
            <SvgIcon name="svg-jifen2" style="width: 18px;" class="mr-2" />
            <span>永久积分：</span><span>{{ userStore.userNum }}</span>
          </span>
          <span class="flex items-center justify-center">
            <SvgIcon name="svg-jifen1" style="width: 19px;" class="mr-2" />
            <span>今日有效积分：</span><span>{{ userStore.eNum >= 0 ? userStore.eNum : '未赞助或已用完' }}</span>
          </span>
          <span class="flex items-center justify-center">
            <SvgIcon name="svg-time" style="width: 19px;" class="mr-2" />
            <span>过期时间：</span><span>{{ userStore.expireDate ? dateFormate(userStore.expireDate, false) : '-' }}</span>
          </span>
          <span class="flex items-center justify-center">
            <SvgIcon name="svg-notice" style="width: 19px;" class="mr-2" />
            <div>小程序{{ userStore.isSign ? '已签到' : '未签到' }}</div>
          </span>
        </div>
        <a-divider style="opacity:0.5;margin:2px 0" v-if="!userStore.userIsLogin"></a-divider>
        <a-row>
          <a-col :xs="12" :sm="12" :md="8" :lg="6" :xl="6" v-for="it in webList.list" :key="it.id">
            <a :href="it.webUrl" target="_blank" title="点击跳转官网">
              <div class="app-weblist-item shou">
                <div class="hidden item-logo sm:flex"><img :src="it.webLogo" :alt="it.webName"></div>
                <div class="item-info">
                  <div class="title">
                    {{ it.webName }} [{{ userStore.userIsLogin ? '正常使用' : (it.webNum + '积分') }}]
                  </div>
                  <div class="tips">{{ it.webTips }}</div>
                </div>
              </div>
            </a>
          </a-col>
        </a-row>
      </div>
    </div>
    <NumLack :visible="visible" @close="close" />
    <CheckDialog :visible="checkVisible" @close="close" @checkCode="checkCode" />

    <s-dialog v-model:visible="webSiteCheckVisible" @close="close" v-loading="checkLoading">
      <img :src="webSiteCheckInfo.imgUrl" style="width:100%;margin-bottom:10px;" @click="refreshYzm">
      <a-input-search placeholder="请输入图形码" v-model="webSiteCheckInfo.webSiteCheckCode" button-text="提交" search-button
        @search="websitCheckCode" />
    </s-dialog>
    <!-- // 90设计的滑动验证码 -->
    <s-dialog v-model:visible="sheji90CheckVisible" @close="close" title="拖动滑块完成拼图">
      <div style="width: 100%" v-loading="checkLoading">
        <div class="canvas-box">
          <canvas id="c3"></canvas>
          <canvas id="c4"></canvas>
        </div>
        <div class="geetest_slider geetest_ready">
          <div id="dragbox" class="geetest_slider_button" draggable="true" style="left: 0"></div>
        </div>
      </div>
    </s-dialog>
    <!-- 包图验证码 -->
    <s-dialog v-model:visible="baotuCheckVisible" @close="close" title="包图验证">
      <div style="width: 100%" class="yanzheng-wrap" v-html="baotuCheckInfo.content" @click="baotuCheckClick">
      </div>
    </s-dialog>
    <!-- 视达虎课播放弹窗 -->
    <s-dialog v-model:visible="shidahukeInfo.visible" width="50%" :title="shidahukeInfo.params.title" @close="close">
      <div>
        <div id="mse"></div>
        <div style="margin-top: 20px;text-align: right;">
          <a-button v-if="shidahukeInfo.id === 1 && shidahukeInfo.params.isDown" type="primary" @click="downFile">
            下载素材+课堂源文件</a-button>
          <template v-else-if="shidahukeInfo.id === 2">
            <a-button type="primary" status="success" size="mini" @click="handleHukeFile(1)">
              源文件下载
            </a-button>&nbsp;&nbsp;&nbsp;&nbsp;
            <a-button type="primary" status="warning" size="mini" @click="handleHukeFile(2)">
              本课素材下载
            </a-button>
          </template>
          <a-button type="primary" disabled size="mini">该教程无课堂文件</a-button>
        </div>
      </div>
    </s-dialog>

    <!-- 下载弹窗 -->
    <s-dialog v-model:visible="downVisible" @close="close" title="资源搜索成功" :closeOnClickOverlay="false" width="40%">
      <div v-if="zhongtuUrl" class="mt-2">
        <a-button @click="copyUrl(zhongtuUrl)" type="primary">复制众图下载链接</a-button>
      </div>
      <template v-else-if="href">
        <p>立即下载无法跳转时，请复制下载地址自行打开！Ctrl+D 收藏本站为书签，防止丢失！</p>
        <a-divider></a-divider>
        <span style="display: flex;justify-content:right;align-items: center;">
          <a-button @click="copyUrl(href)" class="mr-2">复制下载地址</a-button>
          <a :href="href" target="_blank" referrerpolicy="no-referrer">
            <a-button class="mt-2" type="primary" style="margin:0">立即下载</a-button>
          </a>
        </span>
      </template>
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

    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    /* 背景尺寸 - 原理3 */
    background-size: 600% 600%;
    /* 循环动画 - 原理4 */
    animation: gradientBG 10s ease infinite;

    /* 动画，控制背景 background-position */
    @keyframes gradientBG {
      0% {
        background-position: 0% 50%;
      }

      50% {
        background-position: 100% 50%;
      }

      100% {
        background-position: 0% 50%;
      }
    }

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
      max-width: 580px;

      .app-header-func {
        color: #eee;
        text-align: left;
        line-height: 24px;
        font-size: 12px;
        cursor: pointer;

        span {
          text-decoration: underline
        }
      }
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
        width: 48px;
        height: 48px;
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
      white-space: nowrap;

      .tips {
        font-size: 12px;
        margin-top: 6px;
        color: #9c9c9c;
      }
    }
  }
}

.page-design .app-web-list {
  margin-top: -144px;
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

.yanzheng-wrap {
  text-align: center;
  color: #666;
  letter-spacing: 1px;

  /deep/ h3 {
    height: 24px;
    line-height: 24px;
    font-size: 24px;
    font-weight: 400;
    display: none;
  }

  /deep/ .tips {
    height: 18px;
    line-height: 18px;
    margin: 25px 0 20px;

    span {
      color: red;
    }
  }

  /deep/.imgs-wrap {
    overflow: hidden;
    width: 532px;
    margin: 0 auto;
    letter-spacing: 0;
    display: flex;
    flex-wrap: wrap;

    img {
      width: 162px;
      height: 82px;
      margin: 6px;
      border: 1px solid transparent;
      cursor: pointer;

      &:hover {
        border: 1px solid red;
      }
    }
  }
}
</style>