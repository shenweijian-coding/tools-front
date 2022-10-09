<script setup lang="ts">
import { getHuKeUrl, getHukeFile } from '@/api/play'
import { Message } from '@arco-design/web-vue';
import NumLack from '@/components/NumLack/index.vue'
import sDialog from '@/components/s-dialog/index.vue'

const loading = ref(false)
const visible = ref(false)
const hukeId = ref('')
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
      // videoInfo.url = data.data.videoUrl
      videoInfo.title = data.data.title
      hukeId.value = data.data.hukeId
      setTimeout(() => {
        new window.HlsJsPlayer({
          id: 'mse',
          url: '/api/play/getM3u8?url=' + escape(data.data.videoUrl),
          autoplay: true,
          playsinline: true,
          pip: true,
          playbackRate: [0.5, 0.75, 1, 1.5, 2],
          // height: '300px',
          width: '100%'
        });
      });
    } else {
      Message.error('当前资源搜索失败，请咨询管理员！')
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
// const copyUrl = () => {
//   const aux = document.createElement("input")
//   aux.setAttribute("value", videoInfo.url)
//   document.body.appendChild(aux)
//   aux.select()
//   document.execCommand("copy")
//   document.body.removeChild(aux)
//   Message.success('链接复制成功，请前往播放器使用！')
// }
const close = () => {
  checkVisible.value = false
}

const handleHukeFile = async (type) => {
  const res = await getHukeFile({ id: hukeId.value, type: type })
  if (res.data) {
    window.open(res.data)
  } else {
    Message.error('出现错误,请联系管理员！')
  }
}
</script>

<template>
  <s-dialog v-model:visible="visible" width="50%" :title="videoInfo.title">
    <div>
      <div id="mse"></div>
      <div class="item">
        <a-button type="primary" status="success" size="mini" @click="handleHukeFile(1)">
          源文件下载
        </a-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <a-button type="primary" status="warning" size="mini" @click="handleHukeFile(2)">
          本课素材下载
        </a-button>
      </div>
    </div>
  </s-dialog>
  <div class="page-design app-page appView">
    <div v-loading="loading">
      <div class="app-header-box">
        <h1 class="app-heade-title">虎课教程资源搜索</h1>
        <div class="app-header-input">
          <Input @getPlay="getPlay" :loading="loading" />
        </div>
      </div>
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
  background-image: url(https://pic2.zhimg.com/v2-3ec2031a0d2e26ed592f44151e58378a_r.jpg?source=1940ef5c);
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
  margin-top: 20px;
  text-align: right;
}
</style>