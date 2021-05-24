<template>
  <div class="inner-gallery">
    <div class="position-relative">
      <div class="swiper-container" v-swiper:gallerySwiper="swiperOps" ref="gallerySwiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide" :key="index" v-for="(slide, index) in slides.thumbs">
            <div @click="currentSlide = index, openLightbox()"
              :class="['swiper-slide-bg swiper-lazy', {'yt-play': announcement.youtube_id && index === 1}]" 
              :data-background="slide"
            >
              <div class="loader"><div></div><div></div><div></div></div>
            </div>
          </div>
        </div>
      </div>
      <div class="gallery-overlay">
        <div class="gallery-overlay_top d-flex">
          <span class="badge from-border" v-if="announcement.is_autosalon">{{ $t('is_autosalon') }}</span>
          <span class="d-flex">
            <span class="badge squared" v-if="announcement.type[1]">
              <icon name="vip" />
            </span>
            <span class="badge squared" v-if="announcement.type[2]">
              <icon name="premium" />
            </span>
          </span>
        </div>
        <div class="gallery-overlay_middle">
          <span class="d-flex justify-content-between">
            <button id="gallery-prev" class="btn-sq" @click.stop="slidePrev">
              <icon name="chevron-left" />
            </button>
            <button id="gallery-next" class="btn-sq" @click.stop="slideNext">
              <icon name="chevron-right" />
            </button>
          </span>
        </div>
        <div class="gallery-overlay_bottom d-flex">
          <span class="d-flex">
            <button class="btn-sq btn-sq--color-red" @click.stop>
              <icon name="compare" />
            </button>
            <button class="btn-sq btn-sq--color-dark-blue" @click.stop>
              <icon name="star" />
            </button>
          </span>
          <button class="btn-sq btn-sq--color-dark-blue" @click.stop>
            <icon name="alert" />
          </button>
        </div>
      </div>
      <div v-touch:swipe.top="handleSwipeTop">
        <FsLightbox
          :toggler="toggleFsLightbox"
          :sources="slides.main"
          :types="slides.types"
          :slide="currentSlide + 1"
          :key="lightboxKey"
          :onClose="refreshLightbox"
          :onBeforeClose="onBeforeClose"
          :showThumbsOnMount="!isMobileBreakpoint"
          :disableThumbs="isMobileBreakpoint"
          :onSlideChange="changeLightboxSlide"
        />
        <transition name="fade">
          <div v-if="showLightbox" class="fslightbox-blur-bg">
            <img :src="$env.BASE_URL + slides.main[currentSlide]" alt="" />
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import FsLightbox from 'fslightbox-vue';

export default {
  components: {
    FsLightbox
  },
  data() {
    return {
      toggleFsLightbox: false,
      showLightbox: false,
      lightboxKey: 0,
      currentSlide: 0,
      swiperOps: {
        init: false,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
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
  methods: {
    openLightbox(index) {
      if(index) this.currentSlide = index;
      this.showLightbox = true;
      this.toggleFsLightbox = !this.toggleFsLightbox;
      this.setBodyOverflow('hidden');
    },
    refreshLightbox() {
      this.onBeforeClose();
      this.lightboxKey++;
    },
    onBeforeClose() {
      this.showLightbox = false;
      this.setBodyOverflow('scroll');
    },
    onSlide() {
      this.currentSlide = this.gallerySwiper.realIndex;
    },
    changeSlide(index) {
      this.gallerySwiper.slideTo(index + 1, 0);
    },
    slidePrev() {
      this.gallerySwiper.slidePrev();
    },
    slideNext() {
      this.gallerySwiper.slideNext();
    },
    changeLightboxSlide(fsBox) {
      this.currentSlide = fsBox.stageIndexes.current;
      this.changeSlide(this.currentSlide);
    },
    getMediaByKey(media, key) {
      key = media[key] ? key : Object.keys(media)[0];
      return media[key] instanceof Array ? media[key].map(item => `${this.$env.BASE_URL}${item}`) : [];
    },
    closeLightbox() {
      if(this.showLightbox) {
        this.toggleFsLightbox = !this.toggleFsLightbox;
      }
    },
    handleSwipeTop() {
      if(document.querySelector('body').classList.contains('zooming')) return;
      this.closeLightbox();
    }
  },
  computed: {
    ...mapGetters(['announcement']),

    slides() {
      let media = this.announcement.media;
      let yt_video = this.announcement.youtube_id;
      if (media.length === 0) return [];
      let thumbs = this.getMediaByKey(media, 'main');
      let main = this.getMediaByKey(media, 'main_inner');
      let types = main.map(_ => 'image');
      if(yt_video) {
        thumbs.splice(1, 0, `https://img.youtube.com/vi/${yt_video}/hqdefault.jpg`);
        main.splice(1, 0, `https://www.youtube.com/watch?v=${yt_video}`);
        types.splice(1, 0, 'youtube');
      }
      return { thumbs, main, types };
    }
  },
  watch: {
    breakpoint() {
      this.refreshLightbox();
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.gallerySwiper.init();
      }, 0);

      this.$nuxt.$on('show-gallery-slide', this.changeSlide);
      this.$nuxt.$on('show-lightbox', this.openLightbox);
    });
  },
  beforeDestroy() {
    this.$nuxt.$off(['show-gallery-slide', 'show-lightbox']);
  }
}
</script>