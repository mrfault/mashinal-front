<template>
  <div class="qr-box mb-2 mt-2" v-if=" !isMobileBreakpoint && !qrBoxIsClosed && !$cookies.get('qrBoxIsClosed')">
    <div class="row">
      <div class="col-md-4">
        <img src="/qr.svg">
      </div>
      <div class="col-md-8">
        <p>{{$t('qr_code_text')}}</p>
        <div class="row mt-2">
          <div class="app-icons">
            <img src="/icons/app-store.svg" >
            <img src="/icons/play-store.svg" >
          </div>
        </div>
      </div>
    </div>
    <div class="close">
      <img :src="isDarkMode ? 'icons/close-white.svg' : 'icons/close.svg'" @click="qrBoxClose">
    </div>
  </div>
</template>

<script>
export default {
  name: "qrcode-box",
  data(){
    return {
      qrBoxIsClosed:false,
    }
  },
  methods:{
    qrBoxClose(){
      this.$cookies.set('qrBoxIsClosed',1)
      this.qrBoxIsClosed=true
    }
  }
}
</script>

<style scoped >

</style>
