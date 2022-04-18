<template>
  <div>
    <div v-if="onFsLightBox" class="switch-pnlm">
      <button @click="$nuxt.$emit('switchInterior')" class="btn" style="background-color: #246EB2;color:white;" >{{ $t('exterior')}}</button>
    </div>
    <client-only>
        <vue-pannellum :on-fs-light-box="onFsLightBox" :src="url" />
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
.switch-pnlm {
  position: absolute;
  top: -40px;
  z-index: 1234;
  display: flex;
  justify-content: center;
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
