<template>
  <div class="tips-box">
    <a-collapse :default-active-key="['3']">
      <a-collapse-item header="⚡使用须知" key="1">
        <p>本站下载的所有素材均来自个人VIP账号，不存在任何破解违法获取的行为;</p>
        <p>赞助费用将用于网站运营、服务器成本、对接新网站等;</p>
        <p>本站下载的素材仅供学习交流，切勿用于商业用途，如有需要请前往各大官网进行购买;</p>
      </a-collapse-item>
      <a-collapse-item header="❓赞助了月卡，观看广告获取的积分如何计算，有冲突吗" key="2">
        <p>月卡以及半年卡每日送的1000积分(每日有效积分)与赞助送积分、观看广告送积分(永久积分)是独立的，两者互不影响;</p>
        <p>举例：赞助月卡用户每日赠送有效积分1000，仍可观看广告获取永久积分，每次下载时，优先扣除有效积分，当有效积分不足时扣除永久积分;</p>
      </a-collapse-item>
      <a-collapse-item header="⏱️赞助后何时生效" key="3">
        <p>赞助月卡、半年卡、赞助积分约最迟10秒左右即可自动到账。官方兑换码请联系管理员手动兑换！</p>
        <p>遇到任何问题随时欢迎咨询，微信在网站右侧哈😊</p>
      </a-collapse-item>
      <a-collapse-item header="❓为啥网站扣除的积分不一样" key="4">
        <p>有些网站由于下载限制严重，不得已将积分进行对应变动。</p>
      </a-collapse-item>
    </a-collapse>
  </div>
</template>
<style lang="less" scoped>
.tips-box {
  width: 74%;
  margin: 30px auto;
}
</style>