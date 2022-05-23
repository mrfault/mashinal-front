<template>
  <div class="ma-promotions">
    <div class="ma-promotions__body">
      <div class="ma-promotions__body--left"></div>

      <div class="ma-promotions__body--center">
        <div class="content">
          <div class="content__image" v-if="isPenaltiesPage">
            <img src="/promotions/laptop.png" alt="" />
          </div>
          <panorama-video  v-if="isPanoramaPage"/>
          <div class="content__bilboard" v-if="isPenaltiesPage">
            <img src="/promotions/penalty-bilboard.png" alt="" />
          </div>

          <div class="content__form" :class="{'w-100': isPanoramaPage}">
            <h4 class="content__form--title" v-if="title">
              {{ title }}
            </h4>
            <h6 class="content__form--subtitle" v-if="subTitle">
              {{ subTitle }}
            </h6>
            <slot name="mainForm" />
          </div>
        </div>
      </div>
      <div class="ma-promotions__body--right"></div>
    </div>
    <div class="ma-promotions__phone">
      <div class="phone-outline">
        <img src="/promotions/phone-outline.svg" alt="image" />
      </div>
      <div class="phone-content">
        <img :src="footerImage" alt="image" />
      </div>
    </div>
    <div class="ma-promotions__footer">
      <div class="container">
        <div class="ma-promotions__footer--content">
          <div class="info">
            <h3 class="info--title">{{ $t('download_mobile_app') }}</h3>

            <h6 class="info--subtitle">
              {{
                $t(
                  'we_created_a_system_that_you_can_buy_a_car_only_in_one_hour',
                )
              }}
            </h6>
          </div>
          <div class="app-scaner">
            <div class="app-scaner__qr-image">
              <img src="/promotions/qr.png" alt="" />
            </div>
            <div class="app-scaner__buttons">
              <button
                class="button--scaner"
                @click="
                  gotoRoute(
                    'https://apps.apple.com/az/app/mashin-al/id1588371190',
                  )
                "
              >
                <div class="icon">
                  <img src="/promotions/apple.svg" alt="" />
                </div>
                <div class="text">
                  <p class="text__action">Download on the</p>
                  <p class="text__brand">App Store</p>
                </div>
              </button>
              <button
                class="button--scaner"
                @click="
                  gotoRoute(
                    'https://play.google.com/store/apps/details?id=ventures.al.mashinal',
                  )
                "
              >
                <div class="icon">
                  <img src="/promotions/google-play.svg" alt="" />
                </div>
                <div class="text">
                  <p class="text__action">Get it on</p>
                  <p class="text__brand">Google Play</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PanoramaVideo from './panorama-video.vue'
export default {
  props: {
    title: String,
    subTitle: String,
    subtitle: String,
    isPenaltiesPage: Boolean,
    isPanoramaPage: Boolean,
    footerImage: String,
  },
  components: {
    PanoramaVideo,
  },
  methods: {
    gotoRoute(url) {
      window.open(url, '_blank')
    },
  },
}
</script>

<style></style>
