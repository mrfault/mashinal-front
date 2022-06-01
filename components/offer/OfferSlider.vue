<template>
  <div>
    <div
      class="swiper-container swiper-container-desktop"
      v-swiper:gallerySwiper="swiperOps"
    >
      <div class="swiper-wrapper">
        <div
          class="swiper-slide"
          v-for="(homePageSlider, index) in homePageSliders"
          :key="index"
        >
          <div class="homePage-slide-item">
            <div class="homePage-slide-item-left">
              <img
                :srcset="`${homePageSlider.media.image[1]} 1024w,${homePageSlider.media.image[0]} 640w`"
                :src="homePageSlider.media.image[0]"
                sizes="(min-width: 36em) 33.3vw, 100vw"
                alt="mashinal cover image"
              />
            </div>
            <div
              class="homePage-slide-item-right"
              :style="
                !isDarkMode ? `background:${homePageSlider.overlay_color}` : ''
              "
            >
              <div
                class="before-slider-right"
                :style="` border-top: 600px solid ${
                  !isDarkMode ? homePageSlider.overlay_color : '#D0DBF9'
                };`"
              ></div>
              <div class="homePage-text-section" :style="!isMobileBreakpoint ?`margin-left: -150px;`:''">
                <div class="homePage-text-section-title" style="margin-left: -3px;">
                  <!-- <img :src="homePageSlider.icon" /> -->
                  <img
                    :src="
                      isDarkMode
                        ? homePageSlider.icon_dark
                        : homePageSlider.icon
                    "
                  />
                  <h3>{{ homePageSlider.title[locale] }}</h3>
                </div>
                <p>{{ homePageSlider.description[locale] }}</p>

                <nuxt-link
                  :to="$localePath(homePageSlider.button_link)"
                  class="btn btn--green text-left"
                  v-if="homePageSlider.button_link"
                >
                  <icon name="plus-circle"/>
                  {{ homePageSlider.button_text[locale] }}
                </nuxt-link>
                <button
                  v-if="false"
                  @click="gotoRoute($localePath(homePageSlider.button_link))"
                  class="btn btn--green text-left"
                >
                  {{ homePageSlider.button_text[locale] }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="swiper-pagination" slot="pagination"></div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "OfferSlider",
  data() {
    return {
      currentSlide: 0,
      swiperOps: {
        init: false,
        fadeEffect: {
          crossFade: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        },
        loop: true,
        preloadImages: false,
        lazy: {
          loadPrevNext: false,
          preloaderClass: 'loader'
        }
      },
    }
  },
  computed: {
    ...mapGetters({
      homePageSliders: 'homePageSliders',

    }),
  },
  mounted() {
    setTimeout(() => {
      this.gallerySwiper.init();
    }, 100);
  },
  async asyncData({store}) {
    await Promise.all([
      store.dispatch('getHomePageSliders'),

    ]);
    return {
      pending: false
    }
  },
}
</script>

<style scoped>
.offerPage-slide-item{
  height: 580px;
  display: flex;
}
.offerPage-slide-left{
  width: 53%;
}
.offerPage-slide-right{
  position: relative;
  background: #D0DBF9;
  width: 47%;
}

.dark-mode .offerPage-slide-right {
  background: $dark-2;
}
.dark-mode .offerPage-slide-right .before-slider-right{
  border-top: 600px solid $dark-2 !important;
}
.offerPage-slide-right > .before-slider-right{
  content: "";
  position: absolute;
  top: 0;
  left: 2px;

  transform: translateX(-100%);
  height: 100%;
  border-left: 135px solid transparent;

}
.offerPage-slide-right{
  display: flex;
  align-items: center;
}
.offerPage-text-section{
  width: 50%;
  margin-top: 90px;
  margin-left: 3px;
}
.offerPage-text-section h3{
  font-size: 36px;
  margin-left: 9px;
}
.offerPage-text-section p{
  font-size: 20px;
  line-height: 30px;
}
.offerPage-text-section img{
  margin-top: -8px;
}
.offerPage-text-section-title{
  display: flex;
  align-items: center;

}
.swiper-pagination{
  left: 77px !important;
  bottom: 135px !important;

}
.swiper-pagination-bullet-active{
  background: #081A3E !important;
}
.dark-mode .swiper-pagination-bullet{
  background: gray ;
}
.dark-mode .swiper-pagination-bullet-active{
  background: $white !important;
}

.swiper-pagination-bullet{
  margin-left: 5px !important;
  width: 12px;
  height: 12px;
}
.mobile-offerPage-slide-item{
  display: flex;
  justify-content: space-around;
  align-items: center;

}
.mobile-offerPage-slide-left{
  height: auto;
  width: 50%;
  padding: 15px;
}
.mobile-offerPage-slide-right{
  width: 50%;
  height: auto;

}
.mobile-offerPage-slide-right img{
  width: 100%;
  height: auto;
}

</style>
