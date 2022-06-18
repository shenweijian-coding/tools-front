<template>
  <template v-if="visible">
    <Teleport to="#app">
      <div class="xx-dialog-overlay" @click="onClickOverlay"></div>
      <div class="xx-dialog-wrapper" :style="{width: width}">
        <div class="xx-dialog">
          <header :class="{ 'title': title || $slots.title }">
            <div v-if="$slots.title" class="title-slot">
              <slot name="title"></slot>
            </div>
            <span v-else>{{ title }}</span>
            <span v-if="title" class="xx-dialog-close" @click="close"></span>
          </header>
          <main>
            <slot></slot>
          </main>
          <footer>
          </footer>
        </div>
      </div>
    </Teleport>
  </template>
</template>

<script lang="ts">

export default {
  name:'s-Dialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: true
    },
    onConfirm: {
      type: Function,
      default: () => {}
    },
    onCancel: {
      type: Function,
      default: () => {}
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    width: {
      type: [Number, String],
      default: 400
    }
  },
  setup(props, context) {
    const { closeOnClickOverlay, onConfirm: propsOnConfirm, onCancel: propsOnCancel} = props
    const close = () => {
      context.emit('update:visible', false)
      context.emit('close')
    }
    const onClickOverlay = () => {
      if (closeOnClickOverlay) {
        close()
      }
    }
    const onCancel = () => {
      propsOnCancel?.()
      context.emit('onCancel')
      close()
    }
    const onConfirm = () => {
      if (propsOnConfirm?.() !== false) { // 是否有propsOnConfirm且propsOnConfirm的返回值不为false
        close()
      }
    }
    return {
      close,
      onClickOverlay,
      onCancel,
      onConfirm
    }
  },
}
</script>

<style lang="less">
.xx-dialog-overlay{
   position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, .4);
    z-index: 50;
}
.xx-dialog {
  padding: 10px 20px;
  min-width: 15em;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 3px fade_out(black, 0.4);
  &-wrapper {
    position: fixed;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    z-index: 54;
  }
  > header {
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    .title-slot {
      display: flex;
      align-items: center;
    }
  }
  > main {
    padding: 4px;
  }
  > footer {
    padding: 4px;
    text-align: right;
    .xx-button {
      margin-left: 2px;
    }
  }
  &-close {
    position: relative;
    display: inline-block;
    width: 16px;
    height: 16px;
    cursor: pointer;
    &::before,
    &::after {
      background-color: #000;
      content: '';
      position: absolute;
      height: 1px;
      width: 100%;
      top: 50%;
      left: 50%;
    }
    &::before {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
    &::after {
      transform: translate(-50%, -50%) rotate(45deg);
    }
  }
}
</style>