<template>
  <div
    :style="!isMobileBreakpoint ? 'margin-top: -40px;' : ''"
    class="pages-index"
  >
    <!-- slider desktop -->
    <div class="container p-0">
      <client-only>
        <div
          v-swiper:gallerySwiper="swiperOps"
          class="swiper-container swiper-container-desktop"
        >
          <div class="swiper-wrapper">
            <div
              v-for="(homePageSlider, index) in homePageSliders"
              :key="index"
              class="swiper-slide"
              @click="$router.push($localePath(homePageSlider.button_link))"
            >
              <div class="homePage-slide-item">
                <div
                  v-if="homePageSlider.video"
                  class="homePage-slide-item-left"
                >
                  <video
                    v-if="homePageSlider.video"
                    id="sliderVideo"
                    autoplay
                    controls
                    loop
                    playsinline
                    muted
                    width="400">
                    <source :src="homePageSlider.video" type="video/mp4">
                  </video>
                </div>
                <div v-else class="homePage-slide-item-left">
                  <img
                    :src="
                      isMobileBreakpoint
                        ? `${homePageSlider.media.image[0]} 640w`
                        : `${homePageSlider.media.image[1]} 1024w`
                    "
                    alt="mashinal cover image"
                    sizes="(min-width: 36em) 33.3vw, 100vw"
                  />
                </div>
                <div
                  :style="
                    !isDarkMode
                      ? `background:${homePageSlider.overlay_color}`
                      : ''
                  "
                  class="homePage-slide-item-right"
                >
                  <div
                    :style="` border-top: 600px solid ${
                      !isDarkMode ? homePageSlider.overlay_color : '#D0DBF9'
                    };`"
                    class="before-slider-right"
                  ></div>
                  <div
                    :style="!isMobileBreakpoint ? `margin-left: -150px;` : ''"
                    class="homePage-text-section"
                  >
                    <div
                      class="homePage-text-section-title"
                      style="margin-left: -3px;"
                    >
                      <!-- <img :src="homePageSlider.icon" /> -->
                      <img class="swiper-lazy"
                        :data-src="
                          isDarkMode
                            ? homePageSlider.icon_dark
                            : homePageSlider.icon
                        "/>

                      <h3>{{ homePageSlider.title[locale] }}</h3>
                    </div>
                    <p>{{ homePageSlider.description[locale] }}</p>

                    <nuxt-link
                      v-if="homePageSlider.button_link"
                      :to="$localePath(homePageSlider.button_link)"
                      class="btn btn--green text-left"
                    >
                      <icon name="plus-circle"/>
                      {{ homePageSlider.button_text[locale] }}
                    </nuxt-link>
                    <button
                      v-if="false"
                      class="btn btn--green text-left"
                      @click="
                        gotoRoute($localePath(homePageSlider.button_link))
                      "
                    >
                      {{ homePageSlider.button_text[locale] }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div slot="pagination" class="swiper-pagination"></div>
        </div>
      </client-only>
    </div>

    <!-- car search form -->
    <div class="container position-relative p-lg-0">
      <car-search-form
        :inMobileScreen="absoluteMobileScreen"
        :pending="pending"
        :total-count="$paginate(mainAnnouncements).total"
        @pending="pending = true"
      />
    </div>
    <!-- grid -->
    <div class="overflow-hidden">
      <grid
        :announcements="mainAnnouncements.data"
        :banner="'/img/parts-{count}-{locale}.jpg'"
        :banner-count="4"
        :banner-for="'Part'"
        :banner-link="'/parts'"
        :banner-place="29"
        :escape-duplicates="true"
        :has-container="true"
        :pending="pending"
      />
    </div>
    <infinite-loading
      :per-page="20"
      :per-page-b="4"
      action="getInfiniteMainSearchWithoutMutate"
      action-b="getInfiniteMainPartsSearchWithoutMutate"
      getter="mainAnnouncements"
      getter-b="mainPartsAnnouncements"
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
          delay: 8000,
        },
        videoAutoplay: false,
        fadeEffect: {
          crossFade: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        lazy: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true,
        },
        loop: true,
        preloadImages: false,
/*        lazy: {
          loadPrevNext: false,
          preloaderClass: 'loader',
        },*/
      },
      absoluteMobileScreen: true,

      //video
      cld: null,
      video: "https://dev.mashin.al/storage/1504928/Xaliq-Video.mp4?_=1669299016",
      player: null,
    }
  },
  async asyncData({store}) {
    await Promise.all([
      store.dispatch('getBrands'),
      store.dispatch('getOptions'),
      store.dispatch('getBodyOptions'),
      store.dispatch('getInfiniteMainSearch'),
      store.dispatch('clearSavedSearch'),
    ])

    return {
      pending: false,
    }
  },
  computed: {
    ...mapGetters(['mainAnnouncements', 'homePageSliders']),
    photos() {
      return {
        photo1_sm: require('@/static/test-images/1-480w.jpg'),
        photo1_lg: require('@/static/test-images/1-800w.jpg'),
      }
    },
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

    async getSliderData() {
      if (this.homePageSliders && this.homePageSliders.length) {
        return;
      } else {
        await this.$store.dispatch('getHomePageSliders');
        this.homePageSliders.forEach(el => {
          if (el.video) {
            this.video = el.video;
          }
        })
      }
    },
    //video
    playVideo(url) {
      if (document) {
        var vid = document.getElementById('sliderVideo')
      }
      if (vid) {
        vid.pause();
        vid.play()
      }
      return url
    },
    onElementObserved() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0) {
            this.player.play();
          } else {
            this.player.pause();
          }
        });
      });
      observer.observe(this.$refs.theVideo);
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
    }, 100)
    this.$nuxt.$on('logo-click', this.handleLogoClick)

    this.getSliderData()


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
    .swiper-pagination {
      left: 0 !important;
      bottom: 14px !important;
    }
    .swiper-pagination-bullet {
      position: absolute;
      top: -6px;
      left: 44%;
      z-index: 111;

      &:first-child {
        top: -6px;
        left: 49%;
      }
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

