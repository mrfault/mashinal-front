<!--http://192.168.1.7:3000/-->
<template>
  <div>
    <div v-if="onFsLightBox" class="switch-pnlm2">
      <form-switch class="interior-exterior-switcher" auto-width style="width: fit-content;pointer-events: all;"
                   v-model="showInteriorSwitcher" :options="interiorOptions"/>
    </div>
    <client-only>
      <vue-pannellum :on-fs-light-box="onFsLightBox" :src="url"/>
    </client-only>
  </div>
</template>

<script>
const VuePannellum = () => import('~/components/vue-pannellum')

export default {
  props: {
    url: {},
    onFsLightBox: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      showInteriorSwitcher: true,
    }
  },
  watch:{
    showInteriorSwitcher() {
      this.$nuxt.$emit('switchInterior')
    }
  },
  components: {
    VuePannellum
  },
}
</script>
<style lang="scss">
.switch-pnlm2 {
  position: absolute;
  top: -40px;
  left: 0;
  z-index: 1234;
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

.interior-wrapper {
  width: 100%;
  height: 100vh;

  .psv-canvas-container {
    height: 100vh;
  }
}
</style>
