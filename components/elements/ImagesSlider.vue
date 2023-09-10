<template>
   <div class="images-slider" :class="{'ma-protocol-media': isProtocolMedia}">
      <div class="images-slider__container">
         <div :class="['images-slider__grid', { 'has-sidebar': hasSidebar }]" @click.stop>
            <div class="images-slider__grid-item">
               <button
                  v-if="slides?.length > 6"
                  id="slider-prev"
                  class="btn"
                  @click.stop="thumbsPrev"
               >
                  <icon name="chevron-up"/>
               </button>

               <div
                  ref="thumbsSwiper"
                  v-swiper:thumbsSwiper="thumbOps"
                  class="swiper-container"
               >
                  <div class="swiper-wrapper">
                     <div
                        v-for="(slide, index) in slides?.thumbs"
                        :key="index"
                        class="swiper-slide"
                     >
                        <div class="protocolVideoThumb" v-if="slides.types[index] == 'video' && isProtocolMedia"
                             @click="changeSlide(index)"
                        />
                        <div
                           v-else
                           :style="{ backgroundImage: `url('${slide}')` }"
                           :class="{'protocolImageThumb': isProtocolMedia}"
                           @click="changeSlide(index)"
                        ></div>
                     </div>
                  </div>
               </div>

               <button
                  v-if="slides?.length > 6"
                  id="slider-next"
                  class="btn"
                  @click.stop="thumbsNext"
               >
                  <icon name="chevron-down"/>
               </button>
            </div>

            <div class="images-slider__grid-item">
               <div class="position-relative">
                  <div
                     id="images-swiper"
                     ref="imagesSwiper"
                     v-swiper:imagesSwiper="swiperOps"
                     :auto-update="false"
                     class="swiper-container"
                  >
                     <div class="swiper-wrapper">
                        <div
                           v-for="(slide, index) in slides.main"
                           :key="index"
                           class="swiper-slide"
                           :class="{'ma-protocol-media__center': isProtocolMedia}"
                        >
                           <div class="swiper-slide-bg" @click.stop>
                              <div
                                 v-if="slides.types && slides.types[index] === 'youtube'"
                                 class="iframe"
                              >
                                 <iframe
                                    v-if="showIframe"
                                    :src="`https://www.youtube.com/embed/${slide.split('?v=')[1]}`"
                                    allowfullscreen
                                    frameborder="0"
                                 ></iframe>
                              </div>
                              <div
                                 v-else-if="slides.types && slides.types[index] === 'video'"
                                 class="video"
                              >
                                 <video ref="video" controls>
                                    <source :src="slide"/>
                                 </video>
                              </div>
                              <div
                                 v-else-if="slides.types && slides.types[index] === 'custom'"
                                 class="position-relative"
                                 style="width: 100%;overflow: hidden;"
                              >
                                 <no-ssr>
                                    <div v-if="announcement.media.interior_360" class="interior-switcher">
                                       <form-switch v-model="showInterior" :options="interiorOptions"
                                                    auto-width
                                                    class="interior-exterior-switcher" style="width: fit-content;pointer-events: all;"/>
                                    </div>
                                    <interior360-viewer v-if="showInterior" :url="announcement.media.interior_360"/>
                                    <vue-three-sixty
                                       v-else
                                       :amount="announcement?.media.images_360?.length"
                                       :files="announcement?.media.images_360"
                                       :show-interior="showInterior"
                                       buttonClass="d-none"
                                       disable-zoom
                                       showZoom
                                       @interiorChange="showInterior = !showInterior"
                                    />
                                 </no-ssr>
                              </div>
                              <div
                                 class="position-relative"
                                 style="width: 100%;overflow: hidden;"
                                 v-else-if="slides.types && slides.types[index] === 'custom_interior'"
                              >
                                 <no-ssr>
                                    <interior360-viewer :url="announcement?.media?.interior_360"/>
                                 </no-ssr>
                              </div>
                              <template v-else-if="isProtocolMedia">
                                 <img :src="`${slide}`" alt="car_img" class="swiper-lazy"/>
                                 <loader/>
                              </template>

                              <template v-else>
                                 <img :src="`${slide}&width=944`" alt="car_img" class="swiper-lazy"/>
                                 <loader/>
                              </template>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div class="slider-overlay">
                     <div class="slider-overlay_middle">
                        <span class="d-flex justify-content-between">
                           <button
                              id="slider-prev"
                              class="btn-transparent"
                              @click.stop="slidePrev"
                           >
                          <!-- <icon name="chevron-left" /> -->
                              <inline-svg :height="14" src="/icons/chevron-left.svg"/>
                           </button>

                           <button
                              id="slider-next"
                              class="btn-transparent"
                              @click.stop="slideNext"
                           >
                              <!-- <icon name="chevron-right" /> -->
                              <inline-svg :height="14" src="/icons/chevron-right.svg"/>
                           </button>
                      </span>
                     </div>
                  </div>
               </div>
            </div>

<!--            <div class="images-slider__grid-item" v-if="hasSidebar" >-->
<!--               <slot name="sidebar"/>-->
<!--            </div>-->
         </div>

         <div class="toolbar" @click.stop>
            <div class="toolbar__item">
               <h2 v-if="type === 'cars'">
                  {{ announcement?.car_catalog?.brand?.name }} {{ announcement?.car_catalog?.model?.name }}
               </h2>

               <h2 v-else-if="type === 'moto'">
                  {{ announcement?.brand?.name }} {{ announcement?.model?.name }}
               </h2>

               <h2 v-else-if="type === 'parts'">
                  {{ announcement?.title }}
               </h2>

<!--               <h2 v-else-if="type === 'catalog'">-->
<!--                  {{ announcement?.title }}-->
<!--               </h2>-->

               <h3>{{ announcement?.price }}</h3>
            </div>

            <div class="toolbar__item">
               <call-button-multiple
                  v-if="announcement?.is_auto_salon"
                  :phones="announcement?.user?.auto_salon?.phones"
                  :announcement-id="announcement?.id_unique"
               />

               <call-button
                  v-else
                  :phone="contact?.phone"
                  :announcement-id="announcement?.id_unique"
                  :callAtOnce="'new-green-2'"
               />

               <chat-button
                  :announcement="announcement"
                  has-after-login
               />

               <add-favorite
                  :template="'btn'"
                  :announcement="announcement"
                  v-if="![0,2,3].includes(announcement.status)"
               />

               <add-comparison
                  v-if="comparisonExceptions"
                  :template="'btn'"
                  :id="announcement.id_unique"
               />
            </div>
         </div>
      </div>
   </div>
</template>

<script>
   import CallButton from "~/components/announcements/CallButton.vue";
   import CallButtonMultiple from "~/components/announcements/CallButtonMultiple.vue";
   import ChatButton from "~/components/announcements/ChatButton.vue";
   import AddFavorite from "~/components/announcements/AddFavorite.vue";
   import AddComparison from "~/components/announcements/AddComparison.vue";
   import Interior360Viewer from "~/components/Interior360Viewer";

   export default {
      components: {
         CallButton,
         CallButtonMultiple,
         ChatButton,
         AddFavorite,
         AddComparison,
         Interior360Viewer
      },

      props: {
         type: String,
         slides: [],
         announcement: {},
         currentSlide: Number,
         hasSidebar: Boolean,
         isProtocolMedia: Boolean,
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
               spaceBetween: 12,
               keyboard: {
                  enabled: true,
                  pageUpDown: true,
               },
               mousewheel: {
                  sensitivity: 1,
               }
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
            if (this.imagesSwiper.activeIndex > 0) {
               this.imagesSwiper.allowTouchMove = true
            } else {
               this.imagesSwiper.allowTouchMove = false
            }
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

      computed: {
         contact() {
            return this.getAnnouncementContact(this.announcement)
         },

         comparisonExceptions() {
            return this.type === 'cars' && ![0,2,3].includes(this.announcement.status);
         }
      },

      mounted() {
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

<style>
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
</style>
