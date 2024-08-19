<script setup>
import Input from '@/components/Input/index.vue'
import { getDownFile, getHukeFile } from '@api/play'

import { getPngUrl, getInfo, checkInfo, webCheck, getPendData } from '@api/sucai/index'
import { getAddress } from '@api/user/index'
import { Message, Modal } from '@arco-design/web-vue';
import NumLack from '@/components/NumLack/index.vue'
import sDialog from '@/components/s-dialog/index.vue'
import { useUserStore, useAppStore } from '@/store';
import { useRoute } from 'vue-router'
import { dateFormate, add } from '@/utils/index'
import SvgIcon from "@components/SvgIcon/index.vue"
import polling from './polling.vue'
import 'xgplayer';
import HlsJsPlayer from 'xgplayer-hls.js'; // M3U8格式
import JSZip from 'jszip';

const userStore = useUserStore()
const appStore = useAppStore()
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
const currentTime = ref(Math.floor(new Date().getTime() / 1000))
const editImgs = reactive({
  imgs: [],
  preview: ''
})
setInterval(() => {
  currentTime.value = Math.floor(new Date().getTime() / 1000)
}, 5000);
//jiimi
const pollingInfo = reactive({
  visible: false,
  fileName: ''
})
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
  list: [],
  currentShowTip: {},
  webTipVisible: false
})
const options = reactive({
  list: []
})
const progress = reactive({
  visible: false,
  step: ['素材链接识别中ing', '链接识别成功，为xxx', '正在对接数据中心'],
  timer: null,
  currentPercent: 0,
  currentStep: 0,
  completeStep: []
})

const pendDownData = reactive({
  list: [],
  timer: null,
  isOpen: true
})
const link = ref('')
// let link = ''

const { query } = toRaw(route)

if(!userStore.userAddress && !query.value.able) {
    getAddress().then(res => {
        if(res.data) {
          userStore.setInfo({
                address: res.data
            })
        }
    })
}else {
  userStore.setInfo({
      address: '中国'
  })
}

// 获取网站列表
const getWebList = () => {
  try {
    listLoading.value = true
    webList.list.length || getInfo().then(res => {
      // if(userStore.$state?.auth?.27 || userStore.$state?.auth?.28) {
      //   // webList.list
      // }
      webList.list = res.data.sort((a, b) => a.sort - b.sort)
      listLoading.value = false
    })
  } catch (error) {

  } finally {
    listLoading.value = false
  }
}
getWebList()

// 被邀请的逻辑
setTimeout(() => {
  const { query } = toRaw(route)
  if (query.value.f) {
    localStorage.setItem('fr', query.value.f)
  }
});

// 下载动画处理程序
function animation() {
  progress.timer = setInterval(() => {
    if (progress.currentPercent >= 1) {
      if (progress.step[progress.currentStep]) {
        progress.completeStep.unshift(progress.step[progress.currentStep])
      }
      progress.currentStep += 1
      progress.currentPercent = 0
    } else {
      progress.currentPercent = add(progress.currentPercent, 0.05)
    }
  }, 500);
}

function getPendingSucai(tag) {
  const func = () => {
    getPendData().then(res => {
      pendDownData.list = res.data
      if(pendDownData.list.every(o => o.is_down)) {
        clearInterval(pendDownData.timer)
      }
    })
  }
  if (tag) { func() }
  pendDownData.timer = setInterval(func, 30000);
}

const getDownUrl = async (url) => {
  try {
    zhongtuUrl.value = ''
    loading.value = true
    href.value = ''
    href2.value = ''
    options.list = []
    console.log(url.value);
    link.value = url.value
    const res = await getPngUrl({ url: url.value })
    if (res.data.status) { // 校验状态
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
        } else { // 风云办公验证       
          webSiteCheckVisible.value = true
          webSiteCheckInfo.imgUrl = res.data.handle
        }
        return
      } else if (res.data.status === 1000) { // 爬虫校验
        checkVisible.value = true
      } else if (res.data.status === 1003) {
        Message.info(res.data.msg)
        clearInterval(pendDownData.timer)
        getPendingSucai(1)
        return
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
          downVisible.value = true
          href.value = res.data.psd
          window.open(res.data.psd)
        }
      } else {
        if (res.data.options) {
          options.list = res.data.options
        } else {
          handleUserNum()
          // if (res.data.id === 17) {
          //   zhongtuUrl.value = res.data.psd
          //   downVisible.value = true
          // } else {
          downVisible.value = true
          href2.value = res.data.psd2
          href.value = res.data.psd
          window.open(res.data.psd)

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
    console.log(res, '111');
    currentSelDown = item

    // 验证
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
      } else if (res.data.status === 1003) { // 重新解析
        if (repeatCount > 5) {
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
      return
    }

    // 有记录
    if (res.data.result) {
      if ([1, 2].includes(res.data.id)) {
        shidahukeInfo.id = res.data.id
        shidahukeInfo.params = res.data
        if (res?.data?.psd.indexOf('m3u8') !== -1) {
          shidahukeInfo.visible = true
          shidahukeInfo.playUrl = decodeURIComponent(res.data.psd).split('url=')[1]
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
        options.list = []

      } else {
        if (res.data.options) {
          options.list = res.data.options
          Message.info('请重新点击分类下载按钮')
        } else {
          handleUserNum()
          href.value = res.data.psd
          href2.value = res.data.psd2
          downVisible.value = true
          // window.open(res.data.psd)
          options.list = []
        }
      }
    }
    if (res.data?.imgs?.imgs?.length) {
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
  baotuCheckVisible.value = false
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

const showWebTip = (item) => {
  webList.webTipVisible = true
  webList.currentShowTip = item
}

const openNewPage = (url) => {
  window.open(url, '_blank')
}

const handleUserNum = () => {
  setTimeout(() => {
    userStore.getUserNum()
  }, 1000)
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
onMounted(() => {
  getPendingSucai(1)
})
onUnmounted(() => {
  clearInterval(pendDownData.timer)
})
</script>

<template>
  <div class="app-page appView" v-loading="loading" v-if="userStore.userAddress.indexOf('上海') == -1 && userStore.userAddress.indexOf('杭州') == -1">
    <div>
      <div class="app-header-box">
        <h1 class="app-heade-title">提供一站式设计资源搜索服务</h1>
        <div class="app-header-input">
          <!-- <div class="text-white text-left text-green">Tips：淘宝店铺人工可能回复较慢，有问题请联系微信号 【swjznl】</div> -->
          <Input @getPlay="getDownUrl" :loading="loading" class="app-search" />
          <span v-if="options.list.length">
            <a-space class="mt-2">
              <a-button v-for="(item, i) in options.list" :key="i" type="dashed" status="success"
                @click="getCurDownUrl(item)">{{ item.text }}</a-button>
            </a-space>
          </span>
        </div>
      </div>

      <!-- 下载素材待处理列表 -->
      <div v-if="false" class="bg-white p-l">
        <span>千图部分素材不支持直接下载，待云端处理完成，您即可重新搜索，一般5-20分钟，您可以继续搜索其它素材（下方列表会定时清理）</span>
        <a-table :data="pendDownData.list" :pagination="false" size="mini" bordered class="mt-m" :height="10">
          <template #columns>
            <a-table-column title="等待下载地址" data-index="url" align="center">
              <template #cell="{ record }">
                <a class="cursor-pointer" :href="record.url" target="_blank" rel="noreferrer" style="color: blue;">{{
    record.url }}</a>
              </template>
            </a-table-column>
            <!-- <a-table-column title="是否" data-index="time" align="center">
              <template #cell="{ record }">
                {{ dateFormate(record.time / 1000, 1) }}
              </template>
            </a-table-column> -->
            <a-table-column title="预计可下载时间" align="center">
              <template #cell="{ record }">
                <span v-if="!record.is_down">预计{{ dateFormate(+record.time / 1000 + 16 * 60, 1).slice(0, -3) }}
                  后可下载（若可下载会实时在此提示）</span>
                <a-button v-else type="text" @click="getDownUrl({ value: record.url })" size="mini">点我立即下载</a-button>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </div>

      <a-alert closable class="mt-4" v-if="appStore.$state.webConfig?.notice" type="info" title="">
        <p v-html="appStore.$state.webConfig?.notice"></p>
        <!-- <template #action>
          <a-button size="small" type="text" status="" :href="appStore.$state.webConfig?.q.url"
            target="_blank">查看常见问题（99%的问题）</a-button>
        </template> -->
      </a-alert>

      <div class="app-web-list" v-loading="listLoading">
        <a-row>
          <a-col :xs="12" :sm="12" :md="8" :lg="4" :xl="4" v-for="it in webList.list" :key="it.id"
            @click="showWebTip(it)">
            <a-tooltip>
              <template #content>
                <template v-if="!userStore.userIsLogin">
                  <p class="text-m">站点收费标准：{{ it.cost }}积分/次</p>
                  <p class="text-m">权限到期时间：{{ userStore.$state?.auth?.[it.id]?.expireDate || '-' }}</p>
                  <p class="text-m">该站积分余额：{{ userStore.$state?.auth?.[it.id]?.num || 0 }}</p>
                  <p class="text-m">站点使用说明：{{ it.desc }}</p>
                </template>
                <span v-else>请先登录</span>
              </template>
              <div class="app-weblist-item cursor-pointer">
                <div class="hidden item-logo sm:flex">
                  <img :src="it.webLogo ? it.webLogo : (it.url + '/favicon.ico')" :alt="it.name">
                </div>
                <div class="item-info">
                  <div class="title">
                    <span>{{ it.name }}</span>&nbsp;
                    <span
                      :class="(userStore.$state?.auth?.[it.id]?.initENum || userStore.$state?.auth?.[it.id]?.num || userStore.$state?.num) ? 'text-dark' : 'text-red'">{{
    !userStore.userIsLogin ? (userStore.$state.auth?.[it.id]?.expireDate ?
      '剩' + userStore.$state.auth[it.id].eNum + ' / 共' + userStore.$state.auth[it.id].initENum :
      (userStore.$state.auth?.[it.id]?.num ? userStore.$state.auth?.[it.id]?.num : `${it.cost}积分/次`)) :
      '未登录' }}</span>
                  </div>
                </div>
              </div>
            </a-tooltip>
          </a-col>
        </a-row>
      </div>

      <!-- 轮播图 -->
      <div class="flex mt-l" v-if="appStore.$state.webConfig.banner.some(o => o.img)" style="margin-top: 30px;">
        <a-carousel v-for="it in appStore.$state.webConfig.banner" :key="it.url" class="flex-1 carousel-item"
          :auto-play="true" indicator-type="dot" show-arrow="hover">
          <a-carousel-item v-if="it.img">
            <a :href="it.url || '/'" target="_blank">
              <img :src="it.img" :style="{ width: '100%' }" title="轮播图" />
            </a>
          </a-carousel-item>
        </a-carousel>
      </div>
    </div>

    <NumLack :visible="visible" @close="close" />

    <s-dialog :visible="webSiteCheckVisible" @close="close" v-loading="checkLoading" title="验证">
      <img :src="webSiteCheckInfo.imgUrl" style="width:100%;margin-bottom:10px;" @click="refreshYzm" alt="验证码">
      <a-input-search placeholder="请输入图形码" v-model="webSiteCheckInfo.webSiteCheckCode" button-text="提交" search-button
        @search="websitCheckCode" />
    </s-dialog>
    <!-- // 90设计的滑动验证码 -->
    <s-dialog :visible="sheji90CheckVisible" @close="sheji90CheckVisible = false" title="拖动滑块完成拼图">
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
    <s-dialog :visible="shidahukeInfo.visible" width="50%" title="搜索成功" @close="shidahukeInfo.visible = false">
      <div>
        <div id="mse"></div>
        <a-divider></a-divider>
        <span>视频地址：<a :href="shidahukeInfo.playUrl" target="_blank">{{ shidahukeInfo.playUrl }}</a></span>
      </div>
    </s-dialog>

    <!-- 下载弹窗 -->
    <s-dialog :visible="downVisible" @close="close" title="资源搜索成功" :closeOnClickOverlay="false" width="40%">
      <template v-if="zhongtuUrl">
        <p>复制众图下载链接后，粘贴到迅雷即可下载，浏览器无法直接访问！</p>
        <a-divider></a-divider>
        <span style="display: flex;justify-content:right;align-items: center;">
          <a-button @click="copyUrl(zhongtuUrl)" type="primary">复制众图下载链接</a-button>
        </span>
      </template>
      <template v-else-if="href">
        <p style="font-size: 18px;">立即下载无法跳转时，请复制下载地址自行在浏览器打开！</p>
        <a-divider></a-divider>
        <span style="display: flex;justify-content:right;align-items: center;">
          <a-button v-if="href2" @click="copyUrl('https:' + href2)" class="mr-2">复制通道2地址</a-button>
          <a-button @click="copyUrl(href)" type="outline" class="mr-2">复制下载地址</a-button>
          <a-button v-if="href2" class="mt-2" type="primary" status="success" style="margin:0"
            @click="openNewPage(href2)">下载-通道2</a-button>
          &nbsp;
          <a-button class="mt-2" type="primary" style="margin:0" @click="openNewPage(href)">立即下载</a-button>
        </span>
      </template>
    </s-dialog>

    <!-- 站点说明 -->
    <s-dialog :visible="webList.webTipVisible" :title="webList.currentShowTip.name" :closeOnClickOverlay="true"
      width="40%" @close="webList.webTipVisible = false">
      <p>使用说明：{{ webList.currentShowTip.desc || '-' }}</p>
      <template #footer>
        <span class="flex align-center" style="justify-content:right;">
          <a :href="webList.currentShowTip.url" target="_blank" referrerpolicy="no-referrer">
            <a-button type="outline">跳转官网</a-button>
          </a>&nbsp;
          <a href="#/shop" referrerpolicy="no-referrer">
            <a-button type="primary">开通权限</a-button>
          </a>
        </span>
      </template>
    </s-dialog>

    <polling v-if="pollingInfo.visible" :visible="pollingInfo.visible" :file="pollingInfo.fileName" :url="link"
      @close="pollingInfo.visible = false" @complete="handleUserNum"></polling>

    <s-dialog :visible="!!editImgs.imgs.length" title="源文件搜索失败，本次不扣次数，提供备选方案【不会使用ps可关闭此弹窗】" :closeOnClickOverlay="true"
      width="60%" @close="editImgs.imgs = []">
      <p class="text-red text-l">由于千图官方风控，目前淘宝三方平台均不稳定或直接不可用，可以打包下载源文件的图层图片本地拼合而成 或 使用其他素材站找类似素材</p><br>
      <div class="flex">
        <div>
          <div class="text-bold">原图</div>
          <div>1. 下载所有图层图片至本地</div>
          <div>2. 所有图片拖入PS，参考原图组合成品</div>
          <div>3. 字体可使用 求字体 和 字魂网寻找类似字体</div>
          <img :src="editImgs.preview" alt="" style="max-height: 500px;">
        </div>
        <div style="margin-left: 20px;background-color: #e1e1e1;">
          <div class="text-bold">组成原图的{{ editImgs.imgs.length }}张图层，均高清无水印 <a-button type="primary"
              @click="downloadZip">打包下载 {{ editImgs.imgs.length }} 张图层原图</a-button></div><br>
          <div class="flex flex-wrap" style="max-height: 500px; overflow-y: auto;">
            <img v-for="(item, index) in editImgs.imgs" :key="index" :src="item.img" alt=""
              :style="`height:${item.h > 200 ? item.h / 8 : item.h}px;width: ${item.w / 4 > 500 ? item.w / 4 : item.w}px, margin: 10px;`">
          </div>
        </div>
      </div>
    </s-dialog>
    <s-dialog :visible="progress.visible" width="50%" title="下载处理中">
      <a-progress stroke-width="16" :percent="progress.currentPercent" size="large" :show-text="false" />
      <p v-if="progress.step[progress.currentStep]" class="text-bold">【{{ progress.step[progress.currentStep] }}】</p>
      <ul>
        <li v-for="item in progress.completeStep" key="item" style="line-height: 26px;">{{ item }}[已完成]</li>
      </ul>
    </s-dialog>
    <!-- 离线下载任务进度 -->
    <div class="bg-white offine-box" v-if="pendDownData.list.length">
      <div class="title flex jc-between">
      <span>
        离线下载进度【仅迁图部分素材采用离线】
      </span>
      <span class="cursor-pointer offine-close" @click="pendDownData.isOpen = !pendDownData.isOpen">
        {{pendDownData.isOpen ? '折叠' : '展开'}}
      </span>
        <!-- <span class="mini-title">仅千图部分素材采用云端下载，下载完成您可直接搜索下载</span> -->
      </div>
      <div class="link-box" v-show="pendDownData.isOpen">
        <div class="link-box-centent">
          <ul v-if="pendDownData.list.length">
            <li v-for="(item, index) in pendDownData.list" :key="item.time" class="flex sucai-item">
              <!-- <div>{{ index + 1 }}、</div> -->
              <div class="sucai-left">
                <img :src="item.info.img" alt="" class="sucai-img">
              </div>
              <div class="sucai-right">
                <a :href="item.url" class="sucai-title" target="_blank">{{ item.info.title }}</a>
                <div v-if="!item.is_down">
                  <a-progress 
                    :percent="((currentTime - Math.floor(+item.time / 1000)) / 900)" style="width: 90%;">
                    <template v-slot:text="scope" >
                      进度{{(scope.percent * 100).toFixed(2)}}%
                    </template>
                  </a-progress>
                  <div class="sucai-tips">云端离线中，100%后可搜索下载</div>
                  <div class="sucai-tips">一般5-15分钟，等待时间可提交其它素材</div>
                </div>
                  
                <!-- <div v-else class="text-green">云端离线完成，可搜索下载</div> -->
                <div  v-else class="mt-l">
                  <a-button type="primary" @click="getDownUrl({ value: item.url })" size="mini">立即下载</a-button>
                </div>

              </div>
            </li>
          </ul>
          <div v-else class="text-center"><a-empty class="mt-l"/></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.app-page {
  width: 95%;
  max-width: 1300px;
  margin: 16px auto auto;

  .carousel-item {
    height: 130px;
    overflow: hidden;
    border-radius: 8px;

    &:nth-child(2) {
      margin: 0 12px;
    }

    img {
      height: 100%;
      // object-fit: contain;
    }
  }

  .app-header-box {
    display: block;
    border-radius: 8px;
    padding: 10px 0;
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: cover;
    text-align: center;
    background-size: 600% 600%;

    .app-heade-title {
      color: #f0f1f5;
      font-size: 28px;
    }

    .app-header-tips {
      color: hsla(0, 0%, 100%, .6);
      font-size: 14px;
      margin-bottom: 28px;
    }

    .app-header-input {
      // width: 96%;
      margin: auto;

      // max-width: 780px;
      .app-search {
        margin: 12px 0;
      }

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
    width: 100%;
    max-width: 1400px;
    margin: 22px auto 0;

    .app-weblist-item {
      background-color: hsla(0, 0%, 100%, 1);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      -webkit-box-shadow: 0 8px 20px 0 rgb(0 0 0 / 6%);
      box-shadow: 0 8px 20px 0 rgb(0 0 0 / 6%);
      border-radius: 4px;
      display: flex;
      align-items: center;
      padding: 12px 16px;
      -webkit-transition: All .25s;
      transition: All .25s;
      margin: 8px 8px;

      &:hover {
        background-color: rgba(255, 255, 255, .8);
        border-radius: 4px;
      }
    }

    .item-logo {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      overflow: hidden;
      background-color: #fff;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;

      img {
        width: 20px;
        height: 20px;
        // padding: 4px;
        border-radius: 4px;
        border-color: rgba(76 175 80/15%);
        overflow: hidden;
        // width: 48px;
        -webkit-transition: All .25s;
        transition: All .25s;
      }
    }

    .item-info {
      padding: 0 8px;
      white-space: nowrap;

      .tips {
        font-size: 12px;
        margin-top: 6px;
        color: #9c9c9c;
      }
    }
  }
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

.offine-box {
  width: 374px;
  position: absolute;
  z-index: 999;
  left: 0;
  bottom: 0;
  box-shadow: #88949d;
  .title {
    padding: 14px 20px;
  }

  .mini-title {
    font-size: 12px;
  }

  .link-box {
    position: relative;
    z-index: 999;
    height: 40vh;
    background-color: rgb(250, 250, 250);
    padding: 14px;

    .link-box-centent {
      max-height: 500px;
      overflow-y: auto;

      .sucai-right {
        width: 300px;
        margin-left: 4px;

        .sucai-tips {
          font-size: 12px;
        }
      }
      .sucai-item {
        width: 100%;
        margin: 14px 6px;
      }

      background-color: #fff;
      height: 100%;
      border: 1px dashed #88949d;

      .sucai-img {
        width: 80px;
        height: 100px;
        object-fit: cover;
      }

      .sucai-title {
        color: blue;
      }
    }
  }
}
.offine-close{
  color: blue;
}
</style>