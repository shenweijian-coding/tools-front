<template>
  <div style="width: 80%;margin: 20px auto;">
    <iframe
    :height="height"
    width="100%"
    frameborder="0"
    autoplay
    src="https://www.ixigua.com/iframe/7133902897628545567?autoplay=1" 
    referrerpolicy="unsafe-url" 
    allowfullscreen></iframe>
  </div>
</template>
<script>
export default {
  setup() {
    let height = document.documentElement.clientHeight - 180
    height = height > 800 ? 800 : height
    return {
      height
    }
  }
}
</script>