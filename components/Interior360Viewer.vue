<template>
  <div>
    <client-only>
      <vue-pannellum :on-fs-light-box="onFsLightBox" :src="url" style="height: 100vh;"/>
    </client-only>
  </div>
</template>

<script>
const VuePannellum = () => import('~/components/vue-pannellum')

export default {
  props:{
    url:{},
    onFsLightBox:{
      type: Boolean,
      default: false,
    }
  },
  components: {
    VuePannellum
  },
}
</script>
<style lang="scss">
.interior-wrapper {
  width: 100%;
  height: 100vh;

  .psv-canvas-container {
    height: 100vh;
  }
}
</style>
