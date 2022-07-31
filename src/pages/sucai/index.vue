<script setup>
import Input from '@/components/Input/index.vue'
import { getPngUrl, getInfo, checkInfo, webCheck } from '@api/sucai/index'
import { Message, Modal } from '@arco-design/web-vue';
import CheckDialog from '@/components/check-dialog/index.vue'
import NumLack from '@/components/NumLack/index.vue'
import sDialog from '@/components/s-dialog/index.vue'
import { useUserStore } from '@/store';

const userStore = useUserStore()
const loading = ref(false)
const checkLoading = ref(false)
const listLoading = ref(false)
const href = ref('')
const visible = ref(false)
const webSiteCheckVisible = ref(false)
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
        webSiteCheckVisible.value = true
        webSiteCheckInfo.imgUrl = res.data.handle
        return
      }
    }

    if (res.data.result) {
      if (res.data.options) {
        options.list = res.data.options
        console.log(res.data.options);
      } else {
        if (res.data.id === 17) {
          zhongtuUrl.value = res.data.psd
          Message.warning('由于众图网官方限制，下载众图时请使用迅雷，否则无法下载！')
          href.value = '<a href="#" thunderHref="' + ThunderEncode(res.data.psd) + '" thunderPid="57029" thunderResTitle="" onClick="return OnDownloadClick_Simple(this,2,4)" οncοntextmenu="ThunderNetwork_SetHref(this)">已安装迅雷，点我即可下载</a> '
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
          <div v-if="zhongtuUrl && href" class="mt-4">
            <a-button @click="copyUrl" type="primary">复制众图下载链接</a-button>
            <span class="zhongtu" v-html="href"></span>
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
              <a-tooltip :content="userStore.userIsLogin ? '正常使用' : it.webNum + '积分一次'" mini>
                <div class="app-weblist-item shou">
                  <div class="item-logo"><img :src="it.webLogo"></div>
                  <div class="item-info">
                    <div class="title">{{ it.webName }}</div>
                    <div class="tips">{{ it.webTips }}</div>
                  </div>
                </div>
              </a-tooltip>
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
</style>