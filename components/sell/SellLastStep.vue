<template>
  <component :is="isMobileBreakpoint ? 'mobile-screen' : 'div'" @back="$emit('close')" :bar-title="title">
    <div class="sell_last-step"></div>
  </component>
</template>

<script>
export default {
  props: {
    title: String
  }
}
</script>