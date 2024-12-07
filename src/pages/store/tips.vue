<template>
  <div class="tips-box">
    <a-collapse :default-active-key="['1']">
      <a-collapse-item header="⚡使用须知" key="1">
        <p class="text-bold mb-1"  style="color: red;">赞助费用仅用于国外字体收集，并提供国外字体下载通道。不含字体版权。</p>
        <p class="text-bold mb-1"  style="color: red;">本站资源为智能收录，如本站纰漏了您的资源，请与我们联系，我们将及时处理。</p>
        <p>本站下载的素材仅供学习交流，切勿用于商业用途，如有需要请前往官网进行购买;引起的商业版权纠纷，与本站无关，若您已注册使用，表示已同意当前规则,否则请不要使用本站，谢谢理解；</p>
      </a-collapse-item>
    </a-collapse>
  </div>
</template>
<style lang="less" scoped>
.tips-box {
  width: 74%;
  margin: 30px auto;
  box-shadow: 0 .5rem 1.25rem 0 rgb(0 0 0 / 0.1);
}
</style>