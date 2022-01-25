<template>
  <div class="pages-index" :style="!isMobileBreakpoint ? 'margin-top: -162px;' : ''">
    <div class="swiper-container" v-swiper:gallerySwiper="swiperOps" v-if="!isMobileBreakpoint">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="homePageSlider in homePageSliders">
          <div class=" homePage-slide-item" >
            <div class="homePage-slide-left">
              <img :src="homePageSlider.image">
            </div>
            <div class="homePage-slide-right" :style="!isDarkMode ? `background:${homePageSlider.overlay_color}`:''">
              <div class="before-slider-right" :style="` border-top: 600px solid ${!isDarkMode ? homePageSlider.overlay_color:'#D0DBF9'};`"></div>
              <div class="homePage-text-section">
                <div class="homePage-text-section-title">

                  <img :src="isDarkMode ? homePageSlider.icon_dark : homePageSlider.icon">
                  <h3>{{ homePageSlider.title[locale] }}</h3>
                </div>
                <p>{{ homePageSlider.description[locale] }}</p>

                <nuxt-link :to="$localePath(homePageSlider.button_link)" class="btn  btn--green text-left" v-if="homePageSlider.button_link">{{homePageSlider.button_text[locale]}}</nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="swiper-pagination" slot="pagination"></div>

    </div>
    <div class="swiper-container" v-swiper:gallerySwiper="swiperOps" v-if="isMobileBreakpoint">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="homePageSlider in homePageSliders">
          <div class=" mobileHomePage-slide-item" :style="!isDarkMode ? `background:${homePageSlider.overlay_color}`:''">
            <div class="mobileHomePage-slide-left">
              <h3>{{ homePageSlider.title[locale] }}</h3>
              <p>{{ homePageSlider.description[locale] }}</p>
              <a :href="homePageSlider.button_link" class="btn  btn--green text-left" v-if="homePageSlider.button_link">{{homePageSlider.button_text[locale]}}</a>
            </div>
            <div class="mobileHomePage-slide-right">
              <img :src="homePageSlider.image">
            </div>
          </div>
        </div>
      </div>
      <div class="swiper-pagination" slot="pagination"></div>

    </div>
    <div class="container">
      <car-search-form
        :total-count="$paginate(mainAnnouncements).total"
        :pending="pending"
        @pending="pending = true"
      />
    </div>
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
      action="getInfiniteMainSearch"
      getter="mainAnnouncements"
      action-b="getInfiniteMainPartsSearch"
      getter-b="mainPartsAnnouncements"
      :per-page="20"
      :per-page-b="4"
    />
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import CarSearchForm from '~/components/cars/CarSearchForm';
import Grid from '~/components/announcements/Grid';

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
      description: this.$t('meta-descr_main-page')
    });
  },
  data() {
    return {
      currentSlide: 0,

      swiperOps: {
        init:false,

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
      }
    }
  },
  async asyncData({store}) {
    await Promise.all([
      store.dispatch('getBrands'),
      store.dispatch('getOptions'),
      store.dispatch('getBodyOptions'),
      store.dispatch('getInfiniteMainSearch'),
      store.dispatch('clearSavedSearch'),
      store.dispatch('getHomePageSliders')
    ]);

    return {
      pending: false
    }
  },

  computed: {
    ...mapGetters(['mainAnnouncements','homePageSliders'])
  },
  methods: {
    ...mapActions(['getInfiniteMainSearch', 'clearSavedSearch']),


    async handleLogoClick() {
      this.$scrollTo('body');
      this.$nuxt.$emit('reset-search-form');
      this.pending = true;
      await Promise.all([
        this.getInfiniteMainSearch(),
        this.clearSavedSearch()
      ]);
      this.pending = false;
    }
  },
  mounted() {
    setTimeout(() => {
      this.gallerySwiper.init();
      this.gallerySwiper.on('slideChange', () => {
        this.currentSlide = this.gallerySwiper.realIndex;
      });

      //this.updateTouchEvents();
    }, 100);
    this.$nuxt.$on('logo-click', this.handleLogoClick);
  },
  beforeDestroy() {
    this.$nuxt.$off('logo-click', this.handleLogoCkick);
  },
  beforeRouteLeave(to, from, next) {
    this.$nuxt.$emit('prevent-popstate');
    next();
  }
}
</script>
