<template>
   <div class="images-slider">
      <div class="toolbar">
         <span>{{ currentSlide + 1 }} / {{ slides.main.length }}</span>

         <div class="images-slider__close" style="z-index: 9999" @click.stop="$emit('close')">
            <icon name="cross" />
            <!-- <inline-svg src="/icons/cross.svg" height="14" /> -->
         </div>
      </div>

      <div class="container wider">
         <div :class="['row', { 'has-sidebar': hasSidebar }]" @click.stop>
            <div class="col-auto">
               <button id="slider-prev" class="btn slider-prev" @click.stop="thumbsPrev" v-if="slides.main.length > 6">
                  <icon name="chevron-up"/>
               </button>
               <div class="swiper-container" v-swiper:thumbsSwiper="thumbOps" ref="thumbsSwiper">
                  <div class="swiper-wrapper">
                     <div class="swiper-slide thump" :key="index" v-for="(slide, index) in slides.main">
                        <img @click="changeSlide(index)" :src="`${slide}&width=130&height=77`" class="swiper-lazy img-fluid" alt=""/>
                     </div>
                  </div>
               </div>
               <button id="slider-next" class="btn slider-next" @click.stop="thumbsNext" v-if="slides.main.length > 6">
                  <icon name="chevron-down"/>
               </button>
            </div>

            <div class="col-auto">
               <div class="position-relative">
                  <div id="images-swiper" class="swiper-container" v-swiper:imagesSwiper="swiperOps" ref="imagesSwiper" :auto-update="false">
                     <div class="swiper-wrapper">
                        <div class="swiper-slide" :key="index" v-for="(slide, index) in slides.main">
                           <div class="swiper-slide-bg" @click.stop>
                              <img alt="car_img" :src="`${slide}&width=944&height=944`" class="swiper-lazy"/>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div class="slider-overlay">
                     <div class="slider-overlay_middle">
                         <span class="d-flex justify-content-between">
                           <button id="slider-prev" class="btn-transparent" @click.stop="slidePrev">
                             <!-- <icon name="chevron-left" /> -->
                             <inline-svg src="/icons/chevron-left.svg" :height="14"/>
                           </button>
                           <button id="slider-next" class="btn-transparent" @click.stop="slideNext">
                             <!-- <icon name="chevron-right" /> -->
                             <inline-svg src="/icons/chevron-right.svg" :height="14"/>
                           </button>
                         </span>
                     </div>
                  </div>
               </div>
            </div>

            <div class="col-auto" v-if="hasSidebar">
               <slot name="sidebar"/>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import Interior360Viewer from "~/components/Interior360Viewer";

export default {
   components: {
      Interior360Viewer
   },

   props: {
      slides: [],
      announcement: {},
      currentSlide: Number,
      hasSidebar: Boolean,
   },

   data() {
      return {
         showFirst: false,
         showInterior: false,
         zoom: 0,
         swiperOps: {
            initialSlide: this.currentSlide,
            allowTouchMove: false,
            effect: 'fade',
            fadeEffect: {
               crossFade: true,
            },
            loop: false,
            preloadImages: false,
            lazy: {
               loadPrevNext: false,
               preloaderClass: 'loader',
            },
            keyboard: {
               enabled: true,
            },
         },
         thumbOps: {
            initialSlide: this.currentSlide,
            direction: 'vertical',
            slidesPerView: 'auto',
            spaceBetween: 10,
            keyboard: {
               enabled: true,
               pageUpDown: true,
            },
         },
         showIframe: true,
      }
   },

   methods: {
      slidePrev() {
         if (this.imagesSwiper.activeIndex === 0) {
            this.imagesSwiper.slideTo(this.slides.main.length - 1)
         } else this.imagesSwiper.slidePrev()

         this.updateTouchEvents()
      },
      slideNext() {
         if (this.slides.main.length - 1 === this.imagesSwiper.activeIndex) {
            this.imagesSwiper.slideTo(0)
         } else this.imagesSwiper.slideNext()

         this.updateTouchEvents()
      },
      thumbsPrev() {
         this.thumbsSwiper.slidePrev()
      },
      updateTouchEvents() {
         this.imagesSwiper.allowTouchMove = this.imagesSwiper.activeIndex > 0;
      },
      thumbsNext() {
         this.thumbsSwiper.slideNext()
      },
      changeSlide(index) {
         this.imagesSwiper.slideTo(index, 0)
      },
      handleEscapeKey(e) {
         if (e.key === 'Escape') {
            this.$emit('close')
         }
         // if(e.key === "ArrowLeft") {
         //   this.slidePrev();
         //   //Left arrow pressed
         // }

         if (e.key === "ArrowRight" && this.slides.main.length - 1 === this.imagesSwiper.activeIndex) {
            if (this.showFirst) {
               this.imagesSwiper.slideTo(0);
               this.showFirst = false;
            } else {
               this.showFirst = true;
            }
         }

         if (e.key === "ArrowLeft" && this.imagesSwiper.activeIndex === 0) {
            if (this.showFirst) {
               this.imagesSwiper.slideTo(this.slides.main.length - 1)
               this.showFirst = false;
            } else {
               this.showFirst = true;
            }
         }
      },
   },

   mounted() {
      // console.log(this.slides);
      window.addEventListener('keydown', this.handleEscapeKey);
      this.$nextTick(() => {
         this.imagesSwiper.thumbs.swiper = this.thumbsSwiper
         this.imagesSwiper.on('slideChange', () => {
            this.showIframe = false
            this.$refs.video?.[0]?.pause()
            this.$nextTick(() => {
               this.showIframe = true

               this.$emit('slide-change', this.imagesSwiper.realIndex)
               this.updateTouchEvents()


            })
         })
         let swiperTouchStartX
         this.imagesSwiper.on('touchStart', (e) => {
            if (e.type === 'touchstart') {
               swiperTouchStartX = e.touches[0].clientX
            } else {
               swiperTouchStartX = e.clientX
            }
         })

         this.imagesSwiper.on('touchEnd', (e) => {
            const tolerance = 100
            const totalSlidesLen = this.imagesSwiper.slides.length

            const diff = (() => {
               if (e.type === 'touchend') {
                  return e.changedTouches[0].clientX - swiperTouchStartX
               } else {
                  return e.clientX - swiperTouchStartX
               }
            })()

            if (this.imagesSwiper.isBeginning && diff >= tolerance) {
               //this.gallerySwiper.slideTo(totalSlidesLen - 1);
            } else if (this.imagesSwiper.isEnd && diff <= -tolerance) {
               setTimeout(() => {
                  this.imagesSwiper.slideTo(0)
               }, 1)
            }
         })
      })
   },

   beforeDestroy() {
      window.removeEventListener('keydown', this.handleEscapeKey)
   }
}
</script>
<style lang="scss" scoped>
.interior-btn {
   display: flex;
   align-items: center;
   justify-content: center;
   font-weight: 500;
   height: 40px;
   min-width: 76px;
   border-radius: 4px;
   color: #fff;
   background-color: #246EB2;
   padding: 0 14px;
}

.interior-switcher {
   position: absolute;
   top: 10px;
   left: 75px;
   z-index: 11233;
   border-radius: 5px;
   display: flex;
   flex-direction: column;
   align-items: center;
   width: 32px;
   font-size: 16px;
   text-align: center;
}
.swiper-slide.thump img{
   width: 130px;
   height: 77px;
   object-fit: cover;
}
.blur-bg_slider{
   display: flex;
   align-items: center;
   justify-content: center;
}
.blur-bg img{
   display: none;
}
.images-slider .toolbar{
   z-index: 99999;
   position: fixed;
   display: flex;
   justify-content: space-between;
   padding: 0 15px;
}
.images-slider .slider-overlay_middle{
   margin: auto 0px;
}
.layout.wider, .container.wider{
   z-index: 0;
}
.col-auto:first-child{
   width: 10%;
}

.col-auto:first-child  .swiper-slide{
   height: max-content;
}
.col-auto:first-child  .swiper-container{
   padding-right: 2px;
}
.col-auto:last-child{
   width: 90%;
}

.images-slider .swiper-slide{
   height: 70vh;
}

.slider-next,
.slider-prev{
   width: 99%;
   padding: 0;
   margin: 0;
   height: max-content;
   padding: 5px 0;
   display: flex;
   justify-content: center;
   align-items: center;
}
.slider-next{
   margin-top: 10px;
}
.slider-prev{
   margin-bottom: 10px;
}
.slider-prev i{
   margin: 0;
}
.images-slider .swiper-wrapper {
   max-height: 513px !important;
}
.swiper-slide.thump img {
   width: 100%;
}
.swiper-slide.thump.swiper-slide-thumb-active{
   border: 1px solid #000;
}

@media (max-height: 700px) {
   .images-slider .swiper-wrapper {
      max-height: 424px !important;
   }
}

@media (max-height: 600px) {
   .images-slider .swiper-wrapper {
      max-height: 336px !important;
   }
}

@media (max-height: 500px) {
   .images-slider .swiper-wrapper {
      max-height: 248px !important;
   }
}

@media (max-height: 400px) {
   .images-slider .swiper-wrapper {
      max-height: 160px !important;
   }
}

@media (max-height: 300px) {
   .images-slider .swiper-wrapper {
      max-height: 72px !important;
   }
}
</style>
