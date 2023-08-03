<template>
   <div class="inner-gallery">
      <div class="position-relative">
         <div
            class="swiper-container"
            v-swiper:gallerySwiper="swiperOps"
            ref="gallerySwiper"
            v-if="showSlider"
         >
            <div class="swiper-wrapper">
               <div
                  class="swiper-slide"
                  :key="index"
                  v-for="(slide, index) in announcement?.media?.main"
               >
                  <div
                     style="width: 100%;"
                     v-if="index === 0 && announcement?.media?.images_360 && announcement?.media?.images_360.length"
                  >
                     <div class="position-relative">
                        <no-ssr>
                           <Interior360Viewer :url="announcement?.media?.interior_360" v-if="showInterior"/>
                           <vue-three-sixty
                              v-else
                              :amount="announcement?.media?.images_360.length"
                              buttonClass="d-none"
                              disableZoom
                              :files="announcement?.media?.images_360"
                           />
                        </no-ssr>
                     </div>
                  </div>

                  <div
                     v-else
                     :class="['swiper-slide-bg', { 'youtube-play': showYtVideo(index) }]"
                     :style="`background-image:url(${showYtVideo(index) ? getYtVideoImage('hq') : slide.main_inner}?width=716)`"
                  >
                     <!--              <loader />-->
                  </div>
               </div>
            </div>
         </div>

         <div class="gallery-overlay" v-if="showSlider">
            <div class="gallery-overlay_top d-flex">
               <ViewAspect
                  :options="viewAspectOptions"
                  v-model="viewAspect"
               />
            </div>

            <div class="gallery-overlay_middle">
               <span class="d-flex justify-content-between">
                  <button id="gallery-prev" class="btn-sq" @click.stop="slidePrev">
                     <!-- <inline-svg src="/icons/chevron-left.svg" :height="25"/> -->
                     <icon name="chevron-left" />
                  </button>

                  <button id="gallery-next" class="btn-sq" @click.stop="slideNext">
                     <icon name="chevron-right" />
                     <!-- <inline-svg src="/icons/chevron-right.svg" :height="25" /> -->
                  </button>
               </span>
            </div>

            <div class="gallery-overlay_bottom">
               <ul class="gallery-overlay__characteristics">
                  <li class="gallery-overlay__characteristics-item" v-if="announcement.tradeable">
                     <inline-svg src="/icons/barter.svg" />
                     <span>{{ $t('tradeable') }}</span>
                  </li>

                  <li class="gallery-overlay__characteristics-item" v-if="announcement.credit">
                     <inline-svg src="/icons/credit.svg" />
                     <span>{{ $t('credit_possible') }}</span>
                  </li>

                  <li class="gallery-overlay__characteristics-item" v-if="announcement.has_360">
                     <inline-svg src="/icons/credit.svg" />
                     <span>360 foto</span>
                  </li>

                  <li class="gallery-overlay__characteristics-item" v-if="announcement.show_vin">
                     <inline-svg src="/icons/vin_2.svg" />
                     <span>VIN kod</span>
                     <span class="badgeMin">{{ $t('is_new') }}</span>
                  </li>
               </ul>
            </div>
         </div>

         <div class="inner-gallery-lightbox" v-touch:swipe.top="handleSwipeTop">
            <template v-if="isMobileBreakpoint">
               <FsLightbox
                  :zoomIncrement="0"
                  :toggler="toggleFsLightbox"
                  :sources="getSourcesFsLightbox"
                  :types="announcement?.media?.main"
                  :slide="currentSlide + 1"
                  :key="lightboxKey"
                  :onClose="refreshLightbox"
                  :onBeforeClose="onBeforeClose"
                  :disableThumbs="true"
                  :onSlideChange="changeLightboxSlide"
               />
            </template>

            <transition-group name="fade">
               <template v-if="(showLightbox && isMobileBreakpoint) ||(!isMobileBreakpoint && showImagesSlider)">
                  <div class="blur-bg" :key="0">
<!--                     <img :src="showYtVideo(currentSlide)? getYtVideoImage('hq'): $withBaseUrl(slides.main[currentSlide])" alt="" />-->
                  </div>

                  <div
                     class="blur-bg_announcement-info"
                     :key="1"
                     v-if="isMobileBreakpoint"
                  >
                     <div class="inner-gallery-lightbox-footer">
                        <template v-if="where === 'announcement'">
                           <h3>{{ getAnnouncementTitle(announcement) }}</h3>
                           <h4>{{ announcement.price }}</h4>
                           <div class="row" v-if="announcement.status != 3">
                              <div class="col" v-if="canSendMessage(announcement)">
                                 <chat-button
                                    :announcement="announcement"
                                    :className="'white-outline'"
                                 />
                              </div>
                              <div class="col">
                                 <call-button :phone="announcement.user.phone"/>
                              </div>
                           </div>
                        </template>

                        <template v-else-if="where === 'catalog'">
                           <h3 v-html="title"></h3>
                           <h4 v-html="subtitle"></h4>
                        </template>
                     </div>
                  </div>

                  <div class="blur-bg_slider" :key="2" v-else>
<!--                     <pre>{{announcement?.media?.main}}</pre>-->

                     <images-slider
                        :announcement="announcement"
                        :current-slide="currentSlide"
                        :slides="announcement?.media?.main"
                        :has-sidebar="where === 'announcement'"
                        @close="closeLightbox"
                        @slide-change="currentSlide = $event"
                     >
                        <template #sidebar v-if="where === 'announcement'">
                           <slot/>
                        </template>
                     </images-slider>
                  </div>
               </template>
            </transition-group>
         </div>
      </div>
   </div>
</template>

<script>
   import FsLightbox from 'fslightbox-vue'
   import CallButton from '~/components/announcements/CallButton'
   import ChatButton from '~/components/announcements/ChatButton'
   import AddFavorite from '~/components/announcements/AddFavorite'
   import AddComparison from '~/components/announcements/AddComparison'
   import AddComplaint from '~/components/announcements/AddComplaint'
   import ImagesSlider from '~/components/elements/ImagesSlider'
   import Interior360Viewer from "~/components/Interior360Viewer";
   import ViewAspect from "~/components/announcements/inner/ViewAspect.vue";
   import { mapGetters } from 'vuex'

   export default {
      props: {
         where: {
            type: String,
            default: 'announcement',
         },
         media: {},
         title: String,
         subtitle: String,
         showSlider: {
            type: Boolean,
            default: true,
         },
      },

      components: {
         Interior360Viewer,
         FsLightbox,
         CallButton,
         ChatButton,
         AddFavorite,
         AddComparison,
         AddComplaint,
         ImagesSlider,
         ViewAspect
      },

      data() {
         return {
            showInterior: false,
            toggleFsLightbox: false,
            showImagesSlider: false,
            showLightbox: false,
            lightboxKey: 0,
            currentSlide: 0,
            viewAspect: 1,
            swiperOps: {
               init: false,
               effect: 'fade',
               allowTouchMove: false,
               fadeEffect: {
                  crossFade: true,
               },
               loop: false,
               preloadImages: false
            }
         }
      },

      methods: {
         switchInterior() {
            this.showInterior = !this.showInterior;
            this.lightboxKey++
            this.toggleFsLightbox = false

            setTimeout(() => {
               this.toggleFsLightbox = true;
            }, 1)
         },

         openLightbox(index) {
            if (index || index === 0) this.currentSlide = index;

            if (this.isMobileBreakpoint) {
               this.showLightbox = true;
               this.toggleFsLightbox = !this.toggleFsLightbox;
            } else {
               this.showImagesSlider = true;
            }
            this.setBodyOverflow('hidden');
         },

         refreshLightbox() {
            this.onBeforeClose()
            this.lightboxKey++
         },

         onBeforeClose() {
            this.showLightbox = false
            this.setBodyOverflow('scroll')
         },

         changeSlide(index) {
            if (!this.showSlider) return
            this.gallerySwiper.slideTo(index, 0)
         },

         slidePrev() {
            if (!this.showSlider) return
            if (this.gallerySwiper.activeIndex === 0) {
               this.gallerySwiper.slideTo(this.announcement?.media?.main.length - 1)
            } else this.gallerySwiper.slidePrev()
            this.updateTouchEvents()
         },

         slideNext() {
            if (!this.showSlider) return
            if (this.announcement?.media?.main.length - 1 === this.gallerySwiper.activeIndex) {
               this.gallerySwiper.slideTo(0)
            } else this.gallerySwiper.slideNext()
            this.updateTouchEvents()
         },

         changeLightboxSlide(fsBox) {
            this.currentSlide = fsBox.stageIndexes.current
            this.changeSlide(this.currentSlide)
         },

         getMediaByKey(media, key) {
            key = media[key] ? key : Object.keys(media)[0]
            return media[key] instanceof Array ? media[key].map((item) => this.$withBaseUrl(item)) : []
         },

         closeLightbox() {
            if (this.isMobileBreakpoint) {
               if (this.showLightbox) this.toggleFsLightbox = !this.toggleFsLightbox;
            } else this.showImagesSlider = false;

            this.setBodyOverflow('scroll');
         },

         handleSwipeTop() {
            if (document.body.classList.contains('zooming')) return
            //this.closeLightbox()
         },

         showYtVideo(index) {
            return this.announcement?.youtube_id && index === 1
         },

         getYtVideoImage(size) {
            return `https://img.youtube.com/vi/${this.announcement.youtube_id}/${size}default.jpg`
         },

         updateTouchEvents() {
            if (this.gallerySwiper.activeIndex > 0) {
               this.gallerySwiper.simulateTouch = this.isMobileBreakpoint
               this.gallerySwiper.allowTouchMove = this.isMobileBreakpoint
            } else {
               this.gallerySwiper.simulateTouch = false
               this.gallerySwiper.allowTouchMove = false
            }
         }
      },

      computed: {
         ...mapGetters(['announcement']),

         showInteriorCondition() {
            return this.currentSlide === 0 &&
               this.announcement.images_360 &&
               this.announcement.images_360.length &&
               this.announcement.interior_360
         },

         getSourcesFsLightbox() {
            // if (this.slides.types[0] === 'custom') {
            //    return [
            //       {
            //          component: this.showInterior ? 'interior360-viewer' : 'vue-three-sixty',
            //          props: {
            //             onFsLightBox: true,
            //             url: this.announcement?.media?.interior_360,
            //             files: this.announcement?.media?.images_360,
            //             amount: this.announcement?.media?.images_360.length,
            //             fromFsPopup: true,
            //          },
            //       },
            //       ...this.announcement?.media?.main.slice(1, this.announcement?.media?.main.length),
            //    ]
            // }
            return this.announcement?.media?.main
         },

         slides() {
            let thumbs = [],
               main = [],
               types = [],
               hasVideo = false,
               has360 = false
            if (this.where === 'catalog') {
               thumbs = this.getMediaByKey(this.media, 'thumb')
               main = this.getMediaByKey(this.media, 'main')
            } else if (this.where === 'announcement') {
               let media = this.announcement.media
               if (media.length === 0) return []
               thumbs = this.getMediaByKey(media, 'thumb_inner')
               main = this.getMediaByKey(media, 'main_inner')
               if (this.announcement.youtube_id) {
                  hasVideo = true
                  thumbs.splice(1, 0, this.getYtVideoImage('hq'))
                  main.splice(
                     1,
                     0,
                     `https://www.youtube.com/watch?v=${this.announcement.youtube_id}`,
                  )
               }
               if (
                  this.announcement.images_360 &&
                  this.announcement.images_360.length
               ) {
                  thumbs.splice(0, 0, this.announcement.images_360[0])
                  main.splice(0, 0, this.announcement.images_360[0])
                  has360 = true
               }
               //360 here
            } else if (this.where === 'salon') {
               thumbs = this.media[1]
               main = this.media[0]
            }
            types = [...main.map((_) => 'image')]

            if (hasVideo) types.splice(1, 0, 'youtube')
            if (has360) types.splice(0, 0, 'custom')
            return {thumbs, main, types}
         },

         viewAspectOptions() {
            return [
               { id: 1, name: this.$t('exterior') },
               { id: 2, name: this.$t('interior') },
            ]
         },

         // characteristics() {
         //    return [
         //       { id: 1, icon: '/icons/barter.svg', name: this.$t('tradeable') },
         //       { id: 2, icon: '/icons/credit.svg', name: this.$t('credit_possible') },
         //       { id: 3, icon: '/icons/360_deg_2.svg', name: '360 foto' },
         //       { id: 4, icon: '/icons/vin_2.svg', name: 'VIN kod', badge: true },
         //    ]
         // },
      },

      watch: {
         breakpoint() {
            this.showImagesSlider = false
            if (this.showSlider) this.updateTouchEvents()
            this.refreshLightbox()
         }
      },

      mounted() {
         let swiperTouchStartX;

         this.$nextTick(() => {
            this.$nuxt.$on('switchInterior', () => {
               this.switchInterior();
            });

            if (this.showSlider) {
               setTimeout(() => {
                  this.gallerySwiper.init()
                  this.gallerySwiper.on('slideChange', () => {
                     this.updateTouchEvents()
                     this.currentSlide = this.gallerySwiper.realIndex
                  })
                  this.gallerySwiper.on('touchStart', (e) => {
                     if (e.type === 'touchstart') {
                        swiperTouchStartX = e.touches[0].clientX
                     } else {
                        swiperTouchStartX = e.clientX
                     }
                  })

                  this.gallerySwiper.on('touchEnd', (e) => {
                     const tolerance = 100
                     const totalSlidesLen = this.gallerySwiper.slides.length

                     const diff = (() => {
                        if (e.type === 'touchend') {
                           return e.changedTouches[0].clientX - swiperTouchStartX
                        } else {
                           return e.clientX - swiperTouchStartX
                        }
                     })()

                     if (this.gallerySwiper.isBeginning && diff >= tolerance) {
                        //this.gallerySwiper.slideTo(totalSlidesLen - 1);
                     } else if (this.gallerySwiper.isEnd && diff <= -tolerance) {
                        setTimeout(() => {
                           this.gallerySwiper.slideTo(0)
                        }, 1)
                     }
                  })

                  this.gallerySwiper.on('click', (event) => {
                     this.openLightbox(this.currentSlide)
                  })
                  this.updateTouchEvents()
               }, 100)
            }

            if (this.showSlider)
               this.$nuxt.$on('show-gallery-slide', this.changeSlide)
               this.$nuxt.$on('show-lightbox', this.openLightbox)
         })
      },

      beforeDestroy() {
         if (this.showSlider) this.$nuxt.$off('show-gallery-slide', this.changeSlide)
         if (this.showImagesSlider || this.showLightbox) this.closeLightbox()
         this.$nuxt.$off('show-lightbox', this.openLightbox)
      }
   }
</script>

<style lang="scss">
   @media only screen and (min-width: 1024px) {
      .inner-gallery .swiper-wrapper {
         max-height: 630px;
      }
   }

   .fslightbox-source {
      width: 100vw !important;
   }

   .inner-gallery .swiper-slide {

      display: flex;
      align-items: center;
   }
</style>
