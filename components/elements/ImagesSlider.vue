<template>
  <div class="images-slider">
    <div class="toolbar">
      <span>{{ currentSlide + 1 }} / {{ slides.main.length }}</span>
      <span class="cursor-pointer" @click.stop="$emit('close')">
        <icon name="cross" />
      </span>
    </div>
    <div class="container">
      <div class="row" @click.stop>
        <div class="col-auto">
          <button id="slider-prev" class="btn" @click.stop="thumbsPrev" v-if="slides.main.length > 6">
            <icon name="chevron-up" />
          </button>
          <div class="swiper-container" v-swiper:thumbsSwiper="thumbOps" ref="thumbsSwiper">
            <div class="swiper-wrapper">
              <div class="swiper-slide" :key="index" v-for="(slide, index) in (slides.thumbs || slides.main)">
                <div
                  @click="changeSlide(index)"
                  :class="['swiper-thumb-bg', {'yt-play': slides.types && slides.types[index] === 'youtube'}]" 
                  :style="{ backgroundImage: `url('${slide}')` }"
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
            <div class="swiper-container" v-swiper:imagesSwiper="swiperOps" ref="imagesSwiper">
              <div class="swiper-wrapper">
                <div class="swiper-slide" :key="index" v-for="(slide, index) in slides.main">
                  <div
                    :class="['swiper-slide-bg swiper-lazy', {'yt-play': slides.types && slides.types[index] === 'youtube'}]" 
                    :data-background="slide"
                  >
                    <loader />
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    slides: {},
    currentSlide: Number,
    hasSidebar: Boolean,
  },
  data() {
    return {
      swiperOps: {
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        loop: true,
        preloadImages: false,
        lazy: {
          loadPrevNext: false,
          preloaderClass: 'loader'
        },
        initialSlide: this.currentSlide
      },
      thumbOps: {
        initialSlide: this.currentSlide,
        direction: 'vertical',
        slidesPerView: 6
      }
    }
  },
  methods: {
    slidePrev() {
      this.imagesSwiper.slidePrev();
    },
    slideNext() {
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
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.imagesSwiper.thumbs.swiper = this.thumbsSwiper;
      this.imagesSwiper.on('slideChangeTransitionStart', () => {
        setTimeout(() => {
          this.$emit('slide-change', this.imagesSwiper.realIndex);
        }, 0);
      });
    });
  }
}
</script>
