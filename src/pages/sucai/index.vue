<script setup>
import Input from '@/components/Input/index.vue'
import { getDownFile, getHukeFile } from '@api/play'

import { getPngUrl, getInfo, checkInfo, webCheck } from '@api/sucai/index'
import { Message, Modal } from '@arco-design/web-vue';
import CheckDialog from '@/components/check-dialog/index.vue'
import NumLack from '@/components/NumLack/index.vue'
import sDialog from '@/components/s-dialog/index.vue'
import { useUserStore, useAppStore } from '@/store';
import { useRoute } from 'vue-router'
import { dateFormate } from '@/utils/index'
import SvgIcon from "@components/SvgIcon/index.vue"
import polling from './polling.vue'
import JSZip from 'jszip';

import 'xgplayer';
import HlsJsPlayer from 'xgplayer-hls.js'; // M3U8格式

const appStore = useAppStore()
const userStore = useUserStore()
const route = useRoute()
const loading = ref(false)
const checkLoading = ref(false)
const listLoading = ref(false)
const href = ref('')
const href2 = ref('')
const visible = ref(false)
const webSiteCheckVisible = ref(false)
const sheji90CheckVisible = ref(false)
const baotuCheckVisible = ref(false)
const checkVisible = ref(false)
const zhongtuUrl = ref('')
const playInstance = ref('')
const downVisible = ref(false)
const editImgs = reactive({
  imgs: [],
  preview: ''
})
const limitTimer = reactive({
  timer: null,
  time: 0
})
// 视达虎课播放
const shidahukeInfo = reactive({
  visible: false,
  id: '',
  playUrl: '',
  params: ''
})
//jiimi
const pollingInfo = reactive({
  visible: false,
  fileName:  ''
})
const webSiteCheckInfo = reactive({
  imgUrl: '',
  webSiteCheckCode: ''
})
const baotuCheckInfo = reactive({
  content: '',
  params: ''
})
const webInfo = reactive({
  list: [],
  list2: [],
  ads: [],
  cx: null
})
const link = ref('')
const options = reactive({
  list: []
})
listLoading.value = true
getInfo().then(res => {
  console.log(res)
  webInfo.list = res.data.webList
  webInfo.list2 = res.data.webList2
  webInfo.ads = res.data.ads
  webInfo.cx = res.data.cx
  listLoading.value = false
  appStore.$patch({
    webList: res.data.webList
  })
})
// 被邀请的逻辑
setTimeout(() => {
  const { query } = toRaw(route)
  if (query.value.f) {
    localStorage.setItem('fr', query.value.f)
  }
});
const getDownUrl = async (url) => {
  try {
    zhongtuUrl.value = ''
    loading.value = true
    href.value = ''
    options.list = []
    console.log(url.value);
    link.value = url.value
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
    // 返回了 filename 说明是轮询下载
    if (res.data && res.data.fileName) {
      pollingInfo.visible = true
      pollingInfo.fileName = res.data.fileName
      return
    }

    if (res.data.result) {
      if ([1, 2].includes(res.data.id) && !res.data.options) {
        shidahukeInfo.id = res.data.id
        shidahukeInfo.params = res.data
        if (res?.data?.psd.indexOf('m3u8') !== -1 || res?.data?.psd.indexOf('mp4') !== -1) {
          shidahukeInfo.visible = true
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
          href.value = res.data.psd
          downVisible.value = true
        }
      } else {
        if (res.data.options) {
          options.list = res.data.options
        } else {
          Message.success('解析成功了，请点击立即下载按钮')
          handleUserNum()
          // if (res.data.id === 17) {
          //   zhongtuUrl.value = res.data.psd
          //   downVisible.value = true
          // } else {
          href.value = res.data.psd
          downVisible.value = true
          // }
        }
      }
    }
  } catch (error) {

  } finally {
    loading.value = false
  }

}
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
let currentSelDown = null
let repeatCount = 0

const getCurDownUrl = async (item) => {
  try {
    loading.value = true
    const res = await getPngUrl({
      url: link.value,
      option: toRaw(item)
    })
    currentSelDown = item

    if (res.data && res.data.status) { // 校验状态
      if (res.data.status === -1) {
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
          baotuCheckVisible.value = true
          baotuCheckInfo.content = res.data.handle
          baotuCheckInfo.params = res.data.batch
          baotuCheckInfo.setCookies = res.data.setCookies
        } else if (res.data.id === 7) { // 觅元素验证
          webSiteCheckVisible.value = true
          webSiteCheckInfo.imgUrl = res.data.handle
        } else { // 风云办公验证       
          webSiteCheckVisible.value = true
          webSiteCheckInfo.imgUrl = res.data.handle
        }
        return
      } else if (res.data.status === 1000) { // 爬虫校验
        checkVisible.value = true
      } else if(res.data.status === 1003) { // 重新解析
        if(repeatCount > 5) {
          repeatCount = 0
          Message.info('搜索失败')
          return
        }
        repeatCount++
        await delay(8000)
        await getCurDownUrl(currentSelDown)
        return
      }
    }

    // 返回了 filename 说明是轮询下载
    if (res.data && res.data.fileName) {
      pollingInfo.visible = true
      pollingInfo.fileName = res.data.fileName
      console.log(pollingInfo.fileName);
      return
    }

    if (res.data.result) {
      if ([1, 2].includes(res.data.id)) {
        shidahukeInfo.id = res.data.id
        shidahukeInfo.params = res.data
        if (res?.data?.psd.indexOf('m3u8') !== -1) {
          shidahukeInfo.visible = true
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
          href.value = res.data.psd
          downVisible.value = true
        }
        options.list = []
      } else {
        if (res.data.options) {
          options.list = res.data.options
          Message.info('请重新选择分类按钮')
        } else {
          href.value = res.data.psd
          href2.value = res.data.psd2
          downVisible.value = true
          options.list = []
          // disableSearch()
          // window.open(res.data.psd)
        }
      }
      handleUserNum()
    }
    if(res.data?.imgs?.imgs?.length) {
      console.log(res.data.imgs);
      setTimeout(() => {
        editImgs.imgs = res.data.imgs.imgs
        editImgs.preview = res.data.imgs.preview
      }, 1000);
    }
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
    const res = await webCheck({ url: link.value, code: webSiteCheckInfo.webSiteCheckCode })
    if (res.data.result) {
      webSiteCheckVisible.value = false
      if (res.data && res.data.psd) {
        handleUserNum()
        res.data.psd && window.open(res.data.psd)
      }
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
      const res = await webCheck({ url: link.value, code: parseFloat(cat.style.left) })
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
  downVisible.value = false
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
      url: link.value, code: {
        setCookies: baotuCheckInfo.setCookies,
        params: `answer_key=${e.target.getAttribute('data-key')}${baotuCheckInfo.params}`
      }
    })
    baotuCheckVisible.value = false
    if (res.data && res.data.psd) {
      options.list = []
      Message.success('解析成功了，请点击立即下载按钮')
      handleUserNum()
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

const openNewPage = (url) => {
  window.open(url, '_blank')
}

const handleUserNum = () => {
  setTimeout(() => {
    userStore.getUserNum()
  }, 1000)
}

const disableSearch =() => {
  limitTimer.time = 30
  limitTimer.timer = setInterval(() => {
    limitTimer.time -= 1 
    if(limitTimer.time <=0) {
      clearInterval(limitTimer.timer)
    }
  }, 1000);
}
const downloadZip = () => {
// 创建一个JSZip实例
const zip = new JSZip();

// 循环遍历图片地址数组，将每个图片下载并添加到zip文件中
Promise.all(editImgs.imgs.map(img => fetch(img.img)))
  .then(responses => Promise.all(responses.map(res => res.blob())))
  .then(blobs => {
    blobs.forEach((blob, index) => {
      zip.file(`image${index}.png`, blob);
    });

    // 生成zip文件并下载到本地
    zip.generateAsync({ type: 'blob' }).then(content => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'images.zip';
      link.click();
    });
  });
}
</script>

<template>
  <a v-if="webInfo.cx" :href="webInfo.cx.url" target="_blank">
    <img :src="webInfo.cx.img" alt="全网素材免费解析年卡充值" class="w-100">
  </a>
  <div class="page-design app-page appView">
    <div v-loading="loading">
      <div class="app-header-box">
        <h1 class="app-heade-title">提供一站式素材资源导航服务</h1>
        <div class="app-header-input">
          <div class="app-header-func" v-if="!userStore.userIsLogin">
            常用功能：
            <span>
              <router-link to="/shop">在线商店</router-link>
            </span>&nbsp;&nbsp;
            <span>
              <router-link to="/user?key=5">卡密激活</router-link>
            </span>&nbsp;&nbsp;
            <span>
              <router-link to="/statement">《免责声明》</router-link>
            </span>
          </div>
          <Input @getPlay="getDownUrl" :loading="loading" :time="limitTimer.time"/>
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
            <span>总积分：</span><span>{{ userStore.userNum >= 0 ? userStore.userNum : 0}}</span>
          </span>
          <span class="flex items-center justify-center">
            <SvgIcon name="svg-jifen1" style="width: 19px;" class="mr-2" />
            <span>今日积分：</span><span>{{ userStore.eNum >= 0 ? userStore.eNum : '未赞助或已用完' }}</span>
          </span>
          <span class="flex items-center justify-center">
            <SvgIcon name="svg-time" style="width: 19px;" class="mr-2" />
            <span>到期时间：</span><span>{{ userStore.expireDate ? dateFormate(userStore.expireDate, false) : '-' }}</span>
          </span>
          <span class="flex items-center justify-center">
            <SvgIcon name="svg-notice" style="width: 19px;" class="mr-2" />
            <div class="text-bold">支持正版，仅做学习，切勿商用，请及时删除</div>
          </span>
        </div>
        <!-- <a-divider v-if="!userStore.userIsLogin">24小时自助下载站点-网站内搜索</a-divider> -->
        <a-row>
          <a-col :xs="12" :sm="12" :md="8" :lg="6" :xl="6" v-for="it in webInfo.list" :key="it.id">
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
        <a-divider v-if="!userStore.userIsLogin" type="double">下方站点需联系微信</a-divider>
        <a-row>
          <a-col :xs="12" :sm="12" :md="8" :lg="6" :xl="6" v-for="it in webInfo.list2" :key="it.id">
            <a :href="it.webUrl" target="_blank" title="点击跳转官网">
              <div class="app-weblist-item shou">
                <div class="hidden item-logo sm:flex"><img :src="it.webLogo" :alt="it.webName"></div>
                <div class="item-info">
                  <div class="title">
                    {{ it.webName }} [{{ userStore.userIsLogin ? '' : it.webNum }}]
                  </div>
                  <div class="tips">{{ it.webTips }}</div>
                </div>
              </div>
            </a>
          </a-col>
        </a-row>
      </div>
    </div>

    <!-- 底部广告 -->
    <div class="app-page-adb" v-if="!userStore.userIsLogin">
      <a-row :gutter="24">
        <a-col :lg="{ span: 6 }" :xs="{ span: 12 }" v-for="(item, i) in webInfo.ads" :key="i">
          <a-carousel class="app-ad-item" :auto-play="true" indicator-type="dot" show-arrow="hover" :move-speed="1000">
            <a-carousel-item v-for="(image, i) in item" :key="i" class="ad-item">
              <a :href="image.url" target="_blank">
                <img :src="image.img" :style="{ width: '100%', height: '100%' }" />
              </a>
            </a-carousel-item>
          </a-carousel>
        </a-col>
      </a-row>
    </div>

    <NumLack :visible="visible" @close="close" />
    <CheckDialog :visible="checkVisible" @close="close" @checkCode="checkCode" />

    <s-dialog :visible="webSiteCheckVisible" @close="close" v-loading="checkLoading" title="验证">
      <img :src="webSiteCheckInfo.imgUrl" style="width:100%;margin-bottom:10px;" @click="refreshYzm" alt="验证码">
      <a-input-search placeholder="请输入图形码" v-model="webSiteCheckInfo.webSiteCheckCode" button-text="提交" search-button
        @search="websitCheckCode" />
    </s-dialog>
    <!-- // 90设计的滑动验证码 -->
    <s-dialog :visible="sheji90CheckVisible" @close="close" title="拖动滑块完成拼图">
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
    <s-dialog :visible="baotuCheckVisible" @close="close" title="包图验证">
      <div style="width: 100%" class="yanzheng-wrap" v-html="baotuCheckInfo.content" @click="baotuCheckClick">
      </div>
    </s-dialog>
    <!-- 视达虎课播放弹窗 -->
    <s-dialog :visible="shidahukeInfo.visible" width="50%" :title="shidahukeInfo.params.title"
      @close="shidahukeInfo.visible = false">
      <div>
        <div id="mse"></div>
        <div style="margin-top: 20px;text-align: right;">
          <a-button v-if="shidahukeInfo.id === 1 && shidahukeInfo.params.isDown" type="primary" @click="downFile">
            下载素材+课堂源文件</a-button>
        </div>
      </div>
    </s-dialog>

    <!-- 下载弹窗 -->
    <s-dialog :visible="downVisible" @close="close" title="资源搜索成功" :closeOnClickOverlay="false" width="40%">
      <div v-if="zhongtuUrl" class="mt-2">
        <p>重要！重要！重要！众图下载链接出现403页面时，把链接粘贴到迅雷即可下载，浏览器无法直接访问！</p>
        <a-divider></a-divider>
        <span style="display: flex;justify-content:right;align-items: center;">
          <a-button @click="copyUrl(zhongtuUrl)" type="primary">复制下载链接</a-button>
        </span>
      </div>
      <template v-else-if="href">
        <p style="font-size: 18px;">立即下载无法跳转时，请复制下载地址自行浏览器打开！</p>
        <a-divider></a-divider> 
        <span style="display: flex;justify-content:right;align-items: center;">
          <a-button v-if="href2" @click="copyUrl('https:' + href2)" class="mr-2">复制通道2地址</a-button>
          <a-button @click="copyUrl(href)" type="outline" class="mr-2">复制下载地址</a-button>
          <a-button v-if="href2" class="mt-2" type="primary" status="success" style="margin:0" @click="openNewPage(href2)">下载-通道2</a-button>
          &nbsp;
          <a-button class="mt-2" type="primary" style="margin:0" @click="openNewPage(href)">立即下载</a-button>
        </span>
      </template>
    </s-dialog>
    
    <polling v-if="pollingInfo.visible" :visible="pollingInfo.visible" :file="pollingInfo.fileName" :url="link" @close="pollingInfo.visible = false" @complete="handleUserNum"></polling>

    <s-dialog :visible="!!editImgs.imgs.length" title="搜索失败，本次不扣次数，提供备选方案【不会使用ps可关闭此弹窗】" :closeOnClickOverlay="true" width="60%" @close="editImgs.imgs = []">
      <div class="flex">
        <div style="width: 50%;">
          <div class="text-bold">原图</div>
          <img :src="editImgs.preview" alt="" style="max-height: 500px;">
        </div>
        <div style="margin-left: 20px;background-color: #e1e1e1;">
          <div class="text-bold">组成原图的{{editImgs.imgs.length}}张图层，均高清无水印 <a-button type="primary" @click="downloadZip">打包下载 {{editImgs.imgs.length}} 张图层原图</a-button></div><br>
          <div class="flex flex-wrap" style="max-height: 500px; overflow-y: auto;" >
            <img v-for="(item,index) in editImgs.imgs" :key="index" :src="item.img" alt="" :style="`height:${item.h>200 ? item.h/8 : item.h}px;width: ${item.w/4 >500 ? item.w/4 : item.w}px, margin: 10px;`">
          </div>
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

  .app-page-adb {
    max-width: 1240px;
    margin: 20px auto auto;

    // padding: 0 10px;
    .app-ad-item {
      height: 125px;
      margin-bottom: 12px;
    }

    .ad-item {
      border-radius: 4px;
      overflow: hidden;
      -webkit-transition: All .25s;
      transition: All .25s;
      opacity: .8;
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
/deep/.arco-divider-text{
  background-color: transparent;
}
</style>