<template>
  <div class="content__video">
    <div class="panorama">
      <div class="panorama__phone-outline">
        <img src="/promotions/phone-outline-panorama.svg" alt="" />
      </div>
      <div class="panorama__phone-buttons">
        <img src="/promotions/phone-outline-buttons.png" alt="" />
      </div>
      <div class="panorama__phone-background">
        <img src="/promotions/dark-gray.png" alt="" />
      </div>
      <div class="panorama__video">
        <video poster="/promotions/panorama-cover.png" controls :src="videoSource"></video>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    computed:{
        videoSource(){
            return `/images/360_${this.$t('language_prefix')}.mp4`
        }
    }
}
</script>

<style></style>
