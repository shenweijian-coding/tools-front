<script setup lang="ts">
import { getHuKeUrl } from '@/api/play'
import { Message } from '@arco-design/web-vue';
import NumLack from '@/components/NumLack/index.vue'
import { checkInfo } from '@api/sucai/index'
import sDialog from '@/components/s-dialog/index.vue'

const loading = ref(false)
const visible = ref(false)
const videoInfo = reactive({
  url: '',
  title: ''
})
const checkVisible = ref(false)

const getPlay = async (url: any) => {
  try {
    loading.value = true
    const { data } = await getHuKeUrl({ url: url.value })
    loading.value = false
    if (data.status && data.status === 1001) {
      checkVisible.value = true
      return
    }
    if (data.data && data.data.can_play) {
      visible.value = true
      videoInfo.url = data.data.videoUrl
      videoInfo.title = data.data.title
    } else {
      Message.error('当前资源搜索失败，请咨询管理员！')
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
const copyUrl = () => {
  const aux = document.createElement("input")
  aux.setAttribute("value", videoInfo.url)
  document.body.appendChild(aux)
  aux.select()
  document.execCommand("copy")
  document.body.removeChild(aux)
  Message.success('链接复制成功，请前往播放器使用！')
}
const close = () => {
  checkVisible.value = false
}
const checkCode = async (downCode) => {
  const { data } = await checkInfo({ code: downCode })
  if (data.result) {
    Message.success('校验成功！请重新点击搜索进行下载！')
    checkVisible.value = false
  }
}
</script>

<template>
  <s-dialog v-model:visible="visible" width="44%" title="虎课资源搜索成功">
    <div>
      <div class="item">
        <span>标题：</span>
        <span>{{ videoInfo.title }}</span>
      </div>
      <div class="flex item">
        <span>视频链接：</span>
        <a-tooltip :content="videoInfo.url">
          <p class="elli">{{ videoInfo.url }}</p>
        </a-tooltip>
        <a-button type="primary" @click="copyUrl" size="mini">
          一键复制
        </a-button>
      </div>
      <div class="item">
        <span>源文件：</span>
        <a-button type="primary" status="success" size="mini" disabled>
          源文件
        </a-button>
        正在开发中
      </div>
      <div class="item">
        <span>本课素材：</span>
        <a-button type="primary" status="warning" size="mini" disabled>
          本课素材
        </a-button>
        正在开发中
      </div>
    </div>
    <div style="background-color: rgb(235, 235, 235); height: 1px; margin: 10px auto 10px;"></div>
    <span class="item-tips">请复制以上视频链接至m3u8播放器软件或者使用浏览器插件播放，具体可查看页面下方说明</span>
  </s-dialog>
  <div class="page-design app-page appView">
    <div v-loading="loading">
      <div class="app-header-box">
        <h1 class="app-heade-title">虎课教程资源搜索[100积分/1次]</h1>
        <div class="app-header-input">
          <Input @getPlay="getPlay" :loading="loading" />
        </div>
      </div>
    </div>
    <div class="app-page-doc">
      <h1 class="doc-title">使用虎课必读</h1>
      <div class="doc-item">
        <p class="item-title"><span>方式一(推荐)：</span>安装播放器软件
          可以使用<a href="https://www.stellarplayer.com/" target="_blank" style="color:blue"> 恒星播放器 </a> 您也可以自行查找
          只要是支持m3u8文件的播放器都可以使用
        </p>
        <div style="background-color: rgb(235, 235, 235); height: 1px; margin: 16px auto 0px;"></div>
      </div>
      <div class="doc-item">
        <p class="item-title"><span>方式二：</span>安装浏览器插件
          <a href="https://wwt.lanzouj.com/b011p1qid" target="_blank" style="color: blue;">点我下载</a> 密码:he9j
        </p>
      </div>
      <!-- <div class="doc-item">
      <p class="item-title">
        视频教程：<a href="" target="_blank" style="color: blue;">点我直达(B站)</a>  快速了解两种播放方式及使用教程 选择你自己喜欢的即可
      </p>
    </div> -->
    </div>
  </div>
  <NumLack :visible="checkVisible" @close="close" />

</template>
<style lang="less">
.app-page {
  width: 95%;
  max-width: 1300px;
  margin: 24px auto auto;

  .app-header-box {
    display: block;
    border-radius: 8px;
    height: 260px;
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
      padding: 60px 0 8px;
    }

    .app-header-input {
      width: 96%;
      margin: auto;
      max-width: 700px;
    }
  }

  .app-page-doc {
    background-color: hsla(0, 0%, 100%, .3411764705882353);
    border-radius: 4px;
    margin-top: 24px;
    padding: 10px 16px 16px 16px;

    .doc-title {
      text-align: center;
      font-size: 20px;
      margin-bottom: 24px;
    }

    .doc-item {
      margin: auto;
      max-width: 960px;
      padding: 16px;

      .item-title {
        font-size: 13px;
        padding-bottom: 8px;
      }

      .item-tips {
        font-size: 12px;
      }
    }
  }
}

.app-header-box {
  background-image: url(https://pic1.zhimg.com/v2-8b9226cb502a89da2c4464d611a8ba9c_r.jpg);
}

.elli {
  width: 400px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.flex {
  display: flex;
  align-items: center;
}

.item {
  margin: 10px 0;
}
</style>