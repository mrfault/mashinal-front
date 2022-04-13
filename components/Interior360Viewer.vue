<template>
  <div>
    <client-only>
      <vue-pannellum :src="url" style="height: 100vh;"/>
    </client-only>
  </div>
</template>

<script>
const VuePannellum = () => import('~/components/vue-pannellum')

export default {
  props:['url'],
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
