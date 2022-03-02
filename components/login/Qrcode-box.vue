<template>
  <div
    class="qr-box"
    :class="{'qr-box-in-sell':inSellPage}"
    v-if="
      !isMobileBreakpoint && !qrBoxIsClosed && !$cookies.get('qrBoxIsClosed')
    "
  >
    <div class="qr-box__image">
      <img :src="isDarkMode ? '/qr-dark.svg' : '/qr.svg'" />
    </div>
    <div class="qr-box__content" >
      <p class="qr-box__content--text">{{ $t('qr_code_text') }}</p>
      <div class="qr-box__content--buttons">
        <a
          target="_blank"
          href="https://apps.apple.com/az/app/mashin-al/id1588371190"
        >
          <img src="/icons/app-store.svg" />
        </a>
        <a
          target="_blank"
          href="https://play.google.com/store/apps/details?id=ventures.al.mashinal&hl=az&gl=US"
        >
          <img src="/icons/play-store.svg" />
        </a>
      </div>
    </div>
    <button class="btn btn-transparent btn-close" @click="qrBoxClose">
      <icon name="cross" />
    </button>
  </div>
</template>

<script>
export default {
  name: 'qrcode-box',
  data() {
    return {
      qrBoxIsClosed: false,
    }
  },
  props:{
    dimensions:{
      type: Array,
      default: [32,80,68]
      // [image-width, image-height, content-width]
    },
    inSellPage:{
      type: Boolean,
      default: false,
    }
  },
  methods: {
    qrBoxClose() {
      this.$cookies.set('qrBoxIsClosed', 1)
      this.qrBoxIsClosed = true
    },
  },
}
</script>

<style scoped></style>
