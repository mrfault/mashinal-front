<template>
   <div class="pages-index">
      <div class="container position-relative">
         <car-search-form
            :inMobileScreen="absoluteMobileScreen"
            :pending="pending"
            :total-count="$paginate(mainAnnouncements).total"
            @pending="pending = true"
         />
      </div>

      <div class="overflow-hidden" v-if="getMainMonetized?.length">
         <grid
            :announcements="getMainMonetized"
            :pending="pending"
         >
            <template #cap>
               <Cap :className="'mb40'">
                  <template #left>
                     <h3>{{ $t('featured_ads') }}</h3>
                  </template>

                  <template #right>
                     <nuxt-link :to="$localePath('/cars')">
                        <span>{{ $t('see_all') }}</span>
                        <icon name="arrow-right"/>
                     </nuxt-link>
                  </template>
               </Cap>
            </template>
         </grid>
      </div>

      <div class="overflow-hidden bg-white" v-if="mainAnnouncements.length">
         <grid
            :announcements="mainAnnouncements"
            :pending="pending"
         >
            <template #cap>
               <Cap :className="'mb40'">
                  <template #left>
                     <h3>{{ $t('recent_uploads') }}</h3>
                  </template>

                  <template #right>
                     <nuxt-link :to="$localePath('/cars')">
                        <span>{{ $t('see_all') }}</span>
                        <icon name="arrow-right"/>
                     </nuxt-link>
                  </template>
               </Cap>
            </template>
         </grid>
      </div>

      <div class="overflow-hidden" v-if="plateNumbers.length">
         <div class="container">
            <PlatesGrid
               :items="plateNumbers"
               :showFavoriteBtn="true"
            >
               <template #head>
                  <Cap>
                     <template #left>
                        <h3>{{ $t('registration_marks') }}</h3>
                     </template>

                     <template #right>
                        <nuxt-link :to="$localePath('/plates')">
                           <span>{{ $t('see_all') }}</span>
                           <icon name="arrow-right"/>
                        </nuxt-link>
                     </template>
                  </Cap>
               </template>
            </PlatesGrid>
         </div>
      </div>

      <div class="overflow-hidden bg-white" v-if="carShowroom.length">
         <grid
            :announcements="carShowroom"
            :pending="pending"
         >
            <template #cap>
               <Cap :className="'mb40'">
                  <template #left>
                     <h3>{{ $t('external_salon') }}</h3>
                  </template>

                  <template #right>
                     <nuxt-link :to="$localePath('/cars')">
                        <span>{{ $t('see_all') }}</span>
                        <icon name="arrow-right"/>
                     </nuxt-link>
                  </template>
               </Cap>
            </template>
         </grid>
      </div>

      <div class="overflow-hidden" v-if="partsHome.length">
         <grid
            :announcements="partsHome"
            :pending="pending"
         >
            <template #cap>
               <Cap :className="'mb40'">
                  <template #left>
                     <h3>{{ $t('parts') }}</h3>
                  </template>

                  <template #right>
                     <nuxt-link :to="$localePath('/cars')">
                        <span>{{ $t('see_all') }}</span>
                        <icon name="arrow-right"/>
                     </nuxt-link>
                  </template>
               </Cap>
            </template>
         </grid>
      </div>

<!--      <div class="overflow-hidden bg-white" v-if="brandsList.length">-->
<!--         <BrandsList :options="brandsList" />-->
<!--      </div>-->

      <HandleIds v-if="getMainMonetized.length" :items="getMainMonetized" :watchIds="false"/>
   </div>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   import CarSearchForm from '~/components/cars/CarSearchForm'
   import Grid from '~/components/announcements/Grid'
   import PlatesGrid from "~/components/announcements/PlatesGrid.vue";
   import HandleIds from "~/components/announcements/HandleIds.vue";
   import Cap from "~/components/elements/Cap.vue";

   export default {
      name: 'pages-index',

      transition: 'fade-y-20',

      layout: 'search',

      middleware: 'payment_redirect',

      components: {
         CarSearchForm,
         Grid,
         HandleIds,
         Cap,
         PlatesGrid,
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

      async asyncData({ store }) {
         await Promise.all([
            store.dispatch('fetchCarShowroomAnnouncementsHome'),
            store.dispatch('fetchMonetizedAnnouncementsHome'),
            store.dispatch('fetchPartsAnnouncementsHome'),
            store.dispatch('fetchAllAnnouncementsHome'),
            store.dispatch('getAllOtherOptions', '2'),
            store.dispatch('fetchPlateNumbersHome'),
            store.dispatch('getBrandsOnlyExists'),
            store.dispatch('clearSavedSearch'),
            store.dispatch('fetchBrandsList'),
            store.dispatch('getBodyOptions'),
            store.dispatch('getPopularOptions'),
            // store.dispatch('getFavorites'),
            store.dispatch('getOptions'),
            store.dispatch('getColors'),
         ])
         return {
            pending: false,
         }
      },

      computed: {
         ...mapGetters([
            'mainAnnouncements',
            'homePageSliders',
            'getMainMonetized',
            'singleSavedSearch',
            'carShowroom',
            'plateNumbers',
            'partsHome',
         ]),

         photos() {
            return {
               photo1_sm: require('@/static/test-images/1-480w.jpg'),
               photo1_lg: require('@/static/test-images/1-800w.jpg'),
            }
         },
      },

      methods: {
         ...mapActions([
            'fetchAllAnnouncementsHome',
            'clearSavedSearch',
            'fetchMonetizedAnnouncementsHome',
            'fetchCarShowroomAnnouncementsHome',
            'fetchPartsAnnouncementsHome',
         ]),

         async handleLogoClick() {
            this.$scrollTo('body')
            this.$nuxt.$emit('reset-search-form')
            this.pending = true
            await Promise.all([
               this.fetchAllAnnouncementsHome(),
               this.clearSavedSearch(),
               this.fetchMonetizedAnnouncementsHome(),
               this.fetchCarShowroomAnnouncementsHome()
            ])
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
            // this.gallerySwiper.init()
            this.gallerySwiper.on('slideChange', () => {
               this.currentSlide = this.gallerySwiper.realIndex
            })
         }, 100)
         this.$nuxt.$on('logo-click', this.handleLogoClick)

         this.getSliderData()

         if (this.$route.query.page === 'plate-announce') {
            this.$router.push(this.$localePath('/profile/announcements'));
         }
      },

      beforeDestroy() {
         this.$nuxt.$off('logo-click', this.handleLogoCkick)
      },

      beforeRouteLeave(to, from, next) {
         this.$nuxt.$emit('prevent-popstate')
         next()
      }
   }
</script>

<style lang="scss">
   .pages-index {
      margin-top: 32px;
   }
   //.swiper-container {
   //   .btn--green {
   //      height: 25px !important;
   //   }
   //
   //   @media screen and (max-width: 1024px) {
   //      .btn--green {
   //         height: 12px !important;
   //      }
   //   }
   //   @media screen and (max-width: 768px) {
   //      .swiper-pagination {
   //         left: 0 !important;
   //         bottom: 14px !important;
   //      }
   //      .swiper-pagination-bullet {
   //         position: absolute;
   //         top: -6px;
   //         left: 44%;
   //         z-index: 111;
   //
   //         &:first-child {
   //            top: -6px;
   //            left: 49%;
   //         }
   //      }
   //   }
   //}
   //
   //.mobileHomePage-slide-item {
   //   height: 170px;
   //   position: relative;
   //   justify-content: flex-start;
   //
   //   .mobileHomePage-slide-left {
   //      width: 50%;
   //   }
   //
   //   .mobileHomePage-slide-right {
   //      position: absolute;
   //      top: 0;
   //      right: 0;
   //      width: 50%;
   //      height: 100%;
   //      box-sizing: border-box;
   //      overflow: hidden;
   //      clip-path: polygon(43% 0, 100% 0, 100% 100%, 0% 100%);
   //
   //      img {
   //         width: 100%;
   //         height: 100%;
   //         object-fit: cover;
   //      }
   //   }
   //}
</style>

