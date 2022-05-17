<script setup lang="ts">
import { version } from "../../package.json"
import SvgIcon from "@components/SvgIcon/index.vue"
import { useAppStore } from '@/store/modules/app'
// import { framework } from "./data"
import { getHomeInfo } from '@api/home'
const appStore = useAppStore()
// const data = ref(framework)
let data = ref();
(async () => {
  const res = await getHomeInfo()
  data.value = res.data.list
})()
// getHomeInfo().then(res => { data.value = res.data.list })
const href = ref(window.location.href)
</script>
<template>
  <div class="dark:text-slate-400 dark:bg-slate-900">
    <article class="space-y-20 sm:space-y-32 md:space-y-40 lg:space-y-44">
      <ul
        class="flex flex-wrap items-center justify-center py-6 sm:px-20 lg:px-36 xl:px-52 sm:justify-start lg:justify-start"
      >
        <li
          v-for="(item, index) in data"
          :key="index * 1.1"
          class="px-3 pt-4 md:px-4 sm:pt-5 md:pb-8"
        >
          <figure class="flex-none shadow-lg rounded-xl w-80 md:w-xl">
            <blockquote
              class="px-6 py-8 text-lg font-semibold leading-8 bg-white rounded-t-xl md:p-5 md:text-base md:leading-8 text-slate-700 dark:text-slate-300 dark:bg-slate-800 dark:highlight-white/5"
            >
              <SvgIcon name="svg-marks" />
              <p v-html="item.content"></p>
            </blockquote>
            <figcaption
              class="flex items-center p-2 space-x-2 leading-2 text-white md:px-4 md:py-6 rounded-b-xl"
              :class="item.color"
            >
              <div
                class="flex items-center justify-center flex-none bg-white rounded-full w-14 h-14"
              >
                <img :src="item.avatar" class="w-12 h-12 rounded-full" loading="lazy" />
              </div>
              <div class="flex-auto">
                <div class="text-base font-semibold dark:text-slate-200">
                  {{ item.title }}
                  <p>{{ item.author }}</p>
                </div>
              </div>
              <cite class="flex">
                <a
                  target="_blank"
                  :href="href + item.github"
                  class=""
                >
                点击进入
                  <!-- <SvgIcon name="svg-github" /> -->
                </a>
              </cite>
            </figcaption>
          </figure>
        </li>
      </ul>
    </article>
  </div>
</template>

<style lang="less" scoped>
.version {
  display: inline-block;
  padding: 6px;
  margin-left: 6px;
  border-radius: 10px;
}
</style>
