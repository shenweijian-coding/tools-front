export function addClass (el, className) {
  // 如果当前元素样式列表中没有className
  if (!el.classList.contains(className)) {
    el.classList.add(className)
  }
}

export function removeClass (el, className) {
  el.classList.remove(className)
}