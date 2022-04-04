<template>
  <div
    class="pages-index"
    :style="!isMobileBreakpoint ? 'margin-top: -162px;' : ''"
  >
    <!-- slider desktop -->
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
<!--              <img-->
<!--                :srcset="`${photos.photo1_sm} 300w,${photos.photo1_lg} 1000w`"-->
<!--                sizes="(max-width: 990px) 20vw, (max-width: 37.5em) 30vw, 300px"-->
<!--                src="/test-images/1-800w.jpg"-->
<!--                alt="mashinal cover image"-->
<!--              />-->
              <img :src="homePageSlider.image" />



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
              <div class="homePage-text-section">
                <div class="homePage-text-section-title">
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
    <!-- car search form -->
    <div class="container">
      <car-search-form
        :total-count="$paginate(mainAnnouncements).total"
        :pending="pending"
        @pending="pending = true"
        :inMobileScreen="absoluteMobileScreen"
      />
    </div>
    <!-- grid -->
    <div class="overflow-hidden">
      <grid
        :escape-duplicates="true"
        :announcements="mainAnnouncements.data"
        :pending="pending"
        :banner="'/img/parts-{count}-{locale}.jpg'"
        :banner-place="24"
        :banner-count="4"
        :banner-for="'Part'"
        :banner-link="'/parts'"
        :has-container="true"
      />
    </div>
    <infinite-loading
      action="getInfiniteMainSearchWithoutMutate"
      getter="mainAnnouncements"
      action-b="getInfiniteMainPartsSearchWithoutMutate"
      getter-b="mainPartsAnnouncements"
      :per-page="20"
      :per-page-b="4"
    />
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import CarSearchForm from '~/components/cars/CarSearchForm'
import Grid from '~/components/announcements/Grid'

export default {
  name: 'pages-index',
  layout: 'search',
  middleware: 'payment_redirect',
  components: {
    CarSearchForm,
    Grid,
  },
  head() {
    return this.$headMeta({
      title: this.$t('meta-title_main-page'),
      description: this.$t('meta-descr_main-page'),
    })
  },
  data() {
    return {
      currentSlide: 0,
      swiperOps: {
        init: false,
        speed: 1000,
        autoplay: {
          delay: 6000,
        },
        fadeEffect: {
          crossFade: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true,
        },
        loop: true,
        preloadImages: false,
        lazy: {
          loadPrevNext: false,
          preloaderClass: 'loader',
        },
      },
      absoluteMobileScreen: true,
    }
  },
  async asyncData({store}) {
    await Promise.all([
      store.dispatch('getBrands'),
      store.dispatch('getOptions'),
      store.dispatch('getBodyOptions'),
      store.dispatch('getInfiniteMainSearch'),
      store.dispatch('clearSavedSearch'),
      store.dispatch('getHomePageSliders'),
    ])

    return {
      pending: false,
    }
  },

  computed: {
    ...mapGetters(['mainAnnouncements', 'homePageSliders']),
    photos(){
      return{
        photo1_sm : require('@/static/test-images/1-480w.jpg'),
        photo1_lg : require('@/static/test-images/1-800w.jpg')
      }
    }
  },
  methods: {
    ...mapActions(['getInfiniteMainSearch', 'clearSavedSearch']),
    async handleLogoClick() {
      this.$scrollTo('body')
      this.$nuxt.$emit('reset-search-form')
      this.pending = true
      await Promise.all([this.getInfiniteMainSearch(), this.clearSavedSearch()])
      this.pending = false
    },
    gotoRoute(link) {
      if (this.loggedIn) {
        // this.$route.push(link)
        this.$router.push({path: '/qaraj'})
      } else {
        // this.$route.push(link)
        this.$router.push({path: '/login'})
        localStorage.setItem('loginFromSlider', true)
      }
    },

  },
  mounted() {
    if (window.innerWidth < 769) this.absoluteMobileScreen = true
    else this.absoluteMobileScreen = false
    window.addEventListener('resize', (e) => {
      if (window.innerWidth < 769) this.absoluteMobileScreen = true
      else this.absoluteMobileScreen = false
    })
    setTimeout(() => {
      this.gallerySwiper.init()
      this.gallerySwiper.on('slideChange', () => {
        this.currentSlide = this.gallerySwiper.realIndex
      })

      //this.updateTouchEvents();
    }, 100)
    this.$nuxt.$on('logo-click', this.handleLogoClick)
  },
  beforeDestroy() {
    this.$nuxt.$off('logo-click', this.handleLogoCkick)
  },
  beforeRouteLeave(to, from, next) {
    this.$nuxt.$emit('prevent-popstate')
    next()
  },
}
</script>

<style lang="scss">
.swiper-container {
  .btn--green {
    height: 25px !important;
  }

  @media screen and (max-width: 1024px) {
    .btn--green {
      height: 12px !important;
    }
  }
  @media screen and (max-width: 768px) {
    padding-bottom: 40px;
    .swiper-pagination {
      left: 0 !important;
      bottom: 14px !important;
    }
  }


}

.mobileHomePage-slide-item {
  height: 170px;
  position: relative;
  justify-content: flex-start;

  .mobileHomePage-slide-left {
    width: 50%;
  }

  .mobileHomePage-slide-right {
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    clip-path: polygon(43% 0, 100% 0, 100% 100%, 0% 100%);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
