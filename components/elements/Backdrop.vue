<template>
  <portal to="backdrop">
    <div :class="backdropClass" class="backdrop" @click.stop="$emit('click')">
      <div class="container">
        <slot :show="show" />
      </div>
    </div>
  </portal>
</template>

<script>
export default {
  props:['backdropClass'],
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
