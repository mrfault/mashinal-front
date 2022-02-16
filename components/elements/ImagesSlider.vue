<template>
  <div class="images-slider">
    <div class="toolbar">
      <span>{{ currentSlide + 1 }} / {{ slides.main.length }}</span>
      <span class="cursor-pointer" @click.stop="$emit('close')">
        <icon name="cross" />
      </span>
    </div>
    <div class="container wider">
      <div :class="['row', { 'has-sidebar': hasSidebar}]" @click.stop>
        <div class="col-auto">
          <button id="slider-prev" class="btn" @click.stop="thumbsPrev" v-if="slides.main.length > 6">
            <icon name="chevron-up" />
          </button>
          <div class="swiper-container" v-swiper:thumbsSwiper="thumbOps" ref="thumbsSwiper">
            <div class="swiper-wrapper">
              <div class="swiper-slide" :key="index" v-for="(slide, index) in (slides.thumbs || slides.main)">
                <div
                  @click="changeSlide(index)"
                  :class="['swiper-thumb-bg', {[`${slides.types[index]}-play`]: slides.types && ['youtube','video'].includes(slides.types[index])}]"
                  :style="slide ? { backgroundImage: `url('${slide}')` } : {}"
                ></div>
              </div>
            </div>
          </div>
          <button id="slider-next" class="btn" @click.stop="thumbsNext" v-if="slides.main.length > 6">
            <icon name="chevron-down" />
          </button>
        </div>
        <div class="col-auto">
          <div class="position-relative">
            <div id="images-swiper" class="swiper-container" v-swiper:imagesSwiper="swiperOps" ref="imagesSwiper" :auto-update="false">
              <div class="swiper-wrapper">
                <div class="swiper-slide" :key="index" v-for="(slide, index) in slides.main">
                  <div class="swiper-slide-bg" @click.stop>
                    <div class="iframe" v-if="slides.types && slides.types[index] === 'youtube'">
                      <iframe v-if="showIframe" :src="`https://www.youtube.com/embed/${slide.split('?v=')[1]}`" frameborder="0" allowfullscreen></iframe>
                    </div>
                    <div class="video" v-else-if="slides.types && slides.types[index] === 'video'">
                      <video ref="video" controls><source :src="slide"></video>
                    </div>
                    <vue-three-sixty
                      :amount="announcement.images_360.length"
                      v-else-if="slides.types && slides.types[index] === 'custom'"
                      buttonClass="d-none"
                      disableZoom
                      :files="announcement.images_360"
                    />
                    <template v-else>
                      <img alt="" :data-src="slide" class="swiper-lazy" />
                      <loader />
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <div class="slider-overlay">
              <div class="slider-overlay_middle">
                <span class="d-flex justify-content-between">
                  <button id="slider-prev" class="btn-sq" @click.stop="slidePrev">
                    <icon name="chevron-left" />
                  </button>
                  <button id="slider-next" class="btn-sq" @click.stop="slideNext">
                    <icon name="chevron-right" />
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-auto" v-if="hasSidebar">
          <slot name="sidebar" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    slides: {},
    announcement:{},
    currentSlide: Number,
    hasSidebar: Boolean
  },
  data() {
    return {
      swiperOps: {
        initialSlide: this.currentSlide,
        allowTouchMove: false,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        loop: false,
        preloadImages: false,
        lazy: {
          loadPrevNext: false,
          preloaderClass: 'loader'
        },
        keyboard: {
          enabled: true
        }
      },
      thumbOps: {
        initialSlide: this.currentSlide,
        direction: 'vertical',
        slidesPerView: 'auto',
        spaceBetween: 20,
        keyboard: {
          enabled: true,
          pageUpDown: true
        }
      },
      showIframe: true
    }
  },
  methods: {
    slidePrev() {
      this.imagesSwiper.slidePrev();
    },
    slideNext() {
      if(this.slides.main.length-1 === this.imagesSwiper.activeIndex) {
        this.imagesSwiper.slideTo(0);
      }else
        this.imagesSwiper.slideNext();
    },
    thumbsPrev() {
      this.thumbsSwiper.slidePrev();
    },
    thumbsNext() {
      this.thumbsSwiper.slideNext();
    },
    changeSlide(index) {
      this.imagesSwiper.slideTo(index + 1, 0);
    },
    handleEscapeKey(e) {
      if (e.key === 'Escape'){
        this.$emit('close');
      }
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleEscapeKey);
    this.$nextTick(() => {
      this.imagesSwiper.thumbs.swiper = this.thumbsSwiper;
      this.imagesSwiper.on('slideChange', () => {
        this.showIframe = false;
        this.$refs.video?.[0]?.pause();
        this.$nextTick(() => {
          this.showIframe = true;

          this.$emit('slide-change', this.imagesSwiper.realIndex);
        });
      });
    });
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleEscapeKey);
  }
}
</script>
