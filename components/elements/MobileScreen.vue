<template>
  <portal to="mobile-screen">
    <action-bar :title="barTitle" @back="$emit('back')" />
    <div class="mobile-screen">
      <div :class="{'container': !hideContainer}" :style="{height: hideContainer ? '100%' : 'auto'}">
        <slot />
      </div>
    </div>
  </portal>
</template>

<script>
export default {
  props: {
    barTitle: String,
    hideContainer: Boolean
  },
  mounted() {
    this.setBodyOverflow('hidden');
  },
  beforeDestroy() {
    this.setBodyOverflow('scroll');
  }
}
</script>