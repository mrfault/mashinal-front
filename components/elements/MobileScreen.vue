<template>
  <portal to="mobile-screen">
    <action-bar :title="title" @back="$emit('back')" />
    <div class="mobile-screen">
      <div class="container">
        <slot />
      </div>
    </div>
  </portal>
</template>

<script>
export default {
  props: {
    title: String
  },
  mounted() {
    this.setBodyOverflow('hidden');
  },
  beforeDestroy() {
    this.setBodyOverflow('scroll');
  }
}
</script>