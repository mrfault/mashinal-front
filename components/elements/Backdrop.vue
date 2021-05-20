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
    this.setBodyOverflow('hidden');
    this.$emit('mount');
    this.show = true;
  },
  beforeDestroy() {
    this.show = false;
    this.setBodyOverflow('scroll');
  }
}
</script>