<template>
  <div class="p-6 page-resource">
    <a-row>
      <a-col :xs="12" :sm="12" :md="8" :lg="6" :xl="6" v-for="it in state.list" :key="it.id" class="p-4">
        <div class="post-card-mac">
          <div class="mac-option-header">
            <i></i> <i></i> <i></i>
          </div>
          <div class="detail-image-main">
            <div class="detail-image" :style="`background-image: url(${it.cover});`">
              <a href="/resource/104077.html" target="_blank">
                <div class="detail-mask">
                  <div class="detail-mask-icon"><i class="iconfont icon-eye-fill"
                      style="color: rgba(255, 255, 255, 0.8); font-size: 18px;"></i></div>
                </div>
              </a>
            </div>
          </div>
          <div class="post-card-rate flex jc-between align-center">
            <div class="rate-nu ">
              <a-tag v-for="(tag, index) of it.tags" :key="index" color="gray" class="mr-2">{{ tag }}</a-tag>
            </div>
              <span>121.0</span>
          </div>
          <div class="post-card-title"><a href="/resource/104077.html" target="_blank" :title="it.title">
              {{ it.title }}
            </a>
          </div>
          <div class="p-1">
          </div>
        </div>
      </a-col>
    </a-row>
    <!-- <div class="flex jc-center">
      <a-button type="primary" shape="round">查看更多</a-button>
    </div> -->
  </div>
</template>
<script setup>
import { getResList } from '@/api/sucai'

const state = reactive({
  list: []
})

const getData = () => {
  getResList().then(res => {
    state.list = res.data
  })
}
getData()
</script>

<style lang="less" scoped>
.page-resource {
  padding: 24px 0;
  max-width: 1500px;
  margin: auto;
}

.post-card-mac {
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, .06274509803921569);
  border-radius: 12px;
  -webkit-box-shadow: 0 15px 40px -10px rgba(12, 18, 38, .1);
  box-shadow: 0 15px 40px -10px rgba(12, 18, 38, .1);
  -webkit-transition: -webkit-transform .3s;
  transition: -webkit-transform .3s;
  transition: transform .3s;
  transition: transform .3s, -webkit-transform .3s;
}

.post-card-mac:hover {
  -webkit-transform: translateY(-8px) !important;
  transform: translateY(-8px) !important;
}

.post-card-mac .mac-option-header {
  display: flex;
  padding: 16px 12px;
}

.post-card-mac .mac-option-header i {
  width: 11px !important;
  height: 11px !important;
}

.post-card-mac .mac-option-header i {
  width: 13px;
  height: 13px;
  margin-right: 8px;
  border-radius: 50%;
  background-color: rgba(255, 18, 1, .6);
  cursor: pointer;
  &:hover{
    background-color: rgba(255, 18, 1, 1);
  }
}

.post-card-mac .mac-option-header i:nth-child(2) {
  background-color: rgba(255, 161, 28, .6);
  &:hover{
    background-color: rgba(255, 161, 28, 1);
  }
}

.post-card-mac .mac-option-header i:nth-child(3) {
  background-color: rgba(0, 170, 127, .6);
  &:hover{
    background-color: rgba(0, 170, 127, 1);
  }
}

.post-card-mac .detail-image-main {
  margin: 0 12px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  background-image: linear-gradient(45deg, #eee 25%, transparent 0, transparent 75%, #eee 0), linear-gradient(45deg, #eee 25%, transparent 0, transparent 75%, #eee 0);
  background-size: 16px 16px;
  background-position: 0 0, 8px 8px;
}

.post-card-mac .detail-image-main .detail-image {
  padding-top: 67%;
  background-size: 100% 100%;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}

.post-card-mac .post-card-rate {
  padding: 12px 12px 0;
}

.h-rate {
  background: #fff;
  margin: 0;
  cursor: pointer;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #ff9800;
  display: block;
  line-height: 30px;
  height: 30px;
}

.post-card-mac .post-card-title {
  padding: 8px 12px;
  font-size: 16px;
  line-height: 1.57;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 62px;
}

.post-card-mac .post-card-meta {
  padding: 0 12px 12px;
  height: 40px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
</style>