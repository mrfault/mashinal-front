<template>
  <div class="backdrop" @click="$emit('click')">
    <div class="container">
      <slot :show="show" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false
    }
  },
  mounted() {
    document.querySelector('body').style.overflowY = 'hidden';
    this.show = true;
  },
  beforeDestroy() {
    this.show = false;
    document.querySelector('body').style.overflowY = 'scroll';
  }
}
</script>