<template>
   <div class="pages-index">
      <div class="container">
         <div class="filters-container mini">
            <template v-if="isMobileBreakpoint && !advancedSearch" >
               <FiltersMobile
                  :additional-brands="additionalBrands"
                  :meta="{type: 'cars', path: '/cars', param: 'car_filter'}"
                  @openMore="openMore"
               />

<!--               <form-select-->
<!--                  :label="$t('mark')"-->
<!--                  :options="existsBrands"-->
<!--                  :clear-placeholder="true"-->
<!--                  :clear-option="false"-->
<!--                  :input-placeholder="$t('mark_search')"-->
<!--                  v-model="form.additional_brands[0]['brand']"-->
<!--                  ref="www"-->
<!--                  @change="setBrand($event, 0)"-->
<!--                  has-search-->
<!--               />-->
            </template>

            <div v-else>
               <div class="filters-container__top" v-if="isMobileBreakpoint">
                  <inline-svg src="/icons/back.svg" @click="goBack" />

                  <h4>{{ $t('advanced_search') }}</h4>

                  <button class="btn" @click="resetForm(true)">{{ $t('clear_search') }}</button>
               </div>

               <div class="filters-container__head d-flex align-items-center justify-content-between flex-column mb-5">
                  <form-buttons
                     class="announce_types"
                     :options="getMileageOptions"
                     :group-by="3"
                     :btnClass="'blue-new-3'"
                     v-model="announceType"
                  />

                  <form-buttons
                     class="no-bg"
                     :options="getSearchTabs"
                     :group-by="2"
                     :btnClass="'blue-new'"
                     v-model="searchType"
                  />
               </div>

               <car-search-form
                  v-if="searchType === 1"
                  @submit-filters-mobile="additionalBrands = $event"
                  :pending="pending"
                  :announceType="announceType"
                  @pending="pending = true"
               />

               <moto-search-form
                  v-else
                  :pending="pending"
                  :total-count="$paginate(motoAnnouncements).total"
                  @pending="pending = true"
                  :announceType="announceType"
                  :category="{}"
               />
            </div>
         </div>
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
                     <nuxt-link :to="$localePath('/featured-ads')">
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
            :itemDetailsDark="true"
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

      <div class="overflow-hidden bg-white" v-if="carShowroom?.announcements?.length">
         <grid
            :announcements="carShowroom?.announcements"
            :announcementsBanner="carShowroom?.autosalon"
            :pending="pending"
            :showBanner="true"
         >
            <template #cap>
               <Cap :className="'mb40'">
                  <template #left>
                     <h3>{{ $t('external_salon') }}</h3>
                  </template>

                  <template #right>
                     <nuxt-link :to="$localePath('/external-salons')">
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
            :showBanner="true"
            :urlBanner="'/parts'"
            :pending="pending"
         >
            <template #cap>
               <Cap :className="'mb40'">
                  <template #left>
                     <h3>{{ $t('parts') }}</h3>
                  </template>

                  <template #right>
                     <nuxt-link :to="$localePath('/parts')">
                        <span>{{ $t('see_all') }}</span>
                        <icon name="arrow-right"/>
                     </nuxt-link>
                  </template>
               </Cap>
            </template>
         </grid>
      </div>

      <HandleIds :items="handleIdsOptions" :watchIds="false" />
   </div>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   import CarSearchForm from '~/components/cars/CarSearchForm';
   import MotoSearchForm from '~/components/moto/MotoSearchForm';
   import Grid from '~/components/announcements/Grid';
   import PlatesGrid from "~/components/announcements/PlatesGrid.vue";
   import HandleIds from "~/components/announcements/HandleIds.vue";
   import Cap from "~/components/elements/Cap.vue";
   import FiltersMobile from "~/components/elements/FiltersMobile.vue";
   import {SearchMixin} from "~/mixins/search";

   export default {
      name: 'pages-index',

      transition: 'fade-y-20',

      layout: 'search',

      mixins: [SearchMixin],

      middleware: 'payment_redirect',

      components: {
         CarSearchForm,
         MotoSearchForm,
         Grid,
         HandleIds,
         Cap,
         PlatesGrid,
         FiltersMobile
      },

      head() {
         return this.$headMeta({
            title: this.$t('meta-title_main-page'),
            description: this.$t('meta-descr_main-page'),
         })
      },

      data() {
         return {
            additionalBrands: { 0 :{} },
            advancedSearch: false,
            announceType: 0,
            searchType: 1,
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
            store.dispatch('getPopularOptions'),
            store.dispatch('clearSavedSearch'),
            store.dispatch('fetchBrandsList'),
            store.dispatch('getBodyOptions'),
            store.dispatch('getMotoOptions'),
            store.dispatch('getOptions'),
            // store.dispatch('getMotoGearboxV2'),
            // store.dispatch('getMotoTransmissionsV2'),
            // store.dispatch('getMotoFuelTypesV2'),
            store.dispatch('getColors'),
            // store.dispatch('getFavorites'),
         ])
         return {
            pending: false,
         }
      },

      computed: {
         ...mapGetters([
            'mainAnnouncements',
            'motoAnnouncements',
            'homePageSliders',
            'getMainMonetized',
            'singleSavedSearch',
            'carShowroom',
            'plateNumbers',
            'partsHome',
            'existsBrands'
         ]),

         photos() {
            return {
               photo1_sm: require('@/static/test-images/1-480w.jpg'),
               photo1_lg: require('@/static/test-images/1-800w.jpg'),
            }
         },

         getMileageOptions() {
            // let zeroFirst;
            return [
               {name: this.$t('all2'), key: 0},
               {name: this.$t('new'), key: 1},
               {name: this.$t('with_mileage_2'), key: 2}
               // {name: this.$t(this.meta.type === 'parts' ? 'S_H' : 'with_mileage'), key: zeroFirst ? 2 : 3}
            ];
         },

         getSearchTabs() {
            return [
               { name: this.$t('auto'), key: 1 },
               { name: this.$t('category_moto'), key: 2 }
            ];
         },

         handleIdsOptions() {
            let ids = [];

            ids.push({
               type: 'car',
               ids: [
                  ...this.getMainMonetized?.filter(car => car.type === 'light_vehicle').map(item => item.id),
                  ...this.mainAnnouncements?.filter(car => car.type === 'light_vehicle').map(item => item.id)
               ]
            });

            ids.push({
               type: 'motorcycle',
               ids: [
                  ...this.getMainMonetized?.filter(car => car.type === 'motorcycle').map(item => item.id),
                  ...this.mainAnnouncements?.filter(car => car.type === 'motorcycle').map(item => item.id)
               ]
            });

            ids.push({
               type: 'scooter',
               ids: [
                  ...this.getMainMonetized?.filter(car => car.type === 'scooter').map(item => item.id),
                  ...this.mainAnnouncements?.filter(car => car.type === 'scooter').map(item => item.id)
               ]
            });

            ids.push({
               type: 'motoatv',
               ids: [
                  ...this.getMainMonetized?.filter(car => car.type === 'motoatv').map(item => item.id),
                  ...this.mainAnnouncements?.filter(car => car.type === 'motoatv').map(item => item.id)
               ]
            });

            // ids.push({
            //    type: 'commercial',
            //    ids: [
            //       ...this.getMainMonetized?.filter(car => car.type === 'commercial').map(item => item.id),
            //       ...this.mainAnnouncements?.filter(car => car.type === 'commercial').map(item => item.id),
            //       ...this.carShowroom?.filter(car => car.type === 'commercial').map(item => item.id)
            //    ]
            // });

            ids.push({
               type: 'parts',
               ids: [
                  ...this.getMainMonetized?.filter(car => car.type === 'parts').map(item => item.id),
                  ...this.partsHome?.map(item => item.id)
               ]
            });

            ids.push({
               type: 'plate',
               ids: [...this.plateNumbers?.map(item => item.id)
               ]
            });

            return ids;
         }
      },

      methods: {
         ...mapActions([
            'fetchAllAnnouncementsHome',
            'clearSavedSearch',
            'fetchMonetizedAnnouncementsHome',
            'fetchCarShowroomAnnouncementsHome',
            'fetchPartsAnnouncementsHome',
            'getGridSearch',
         ]),

         goBack() {
            this.advancedSearch = false
            if(this.isMobileBreakpoint) {
               this.$nuxt.$emit('submit-car-search-form-mobile')
            }
         },
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

         openMore() {
            console.log("yesss")
            this.advancedSearch = true;
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

         // async searchMoto(page = 1) {
         //    page = this.$route.query.page || 1;
         //    let post = JSON.parse(this.$route.query.filter || '{}');
         //    // this.pending = true;
         //    await this.getGridSearch({...this.searchParams, post, page});
         //    await this.$store.dispatch('fetchInfiniteMainMonetized', { type: 'moto', data: post });
         //    this.pending = false;
         //    this.scrollTo('.announcements-grid.paginated', [-15, -20]);
         // }
      },

      watch: {
         '$route'() {
            this.advancedSearch = false
         },

         searchType() {
            this.announceType = 0;
         }
      },

      mounted() {
         if (window.innerWidth < 769) this.absoluteMobileScreen = true
         else this.absoluteMobileScreen = false

         window.addEventListener('resize', (e) => {
            if (window.innerWidth < 769) this.absoluteMobileScreen = true
            else this.absoluteMobileScreen = false
         })
         // setTimeout(() => {
         //    // this.gallerySwiper.init()
         //    this.gallerySwiper.on('slideChange', () => {
         //       this.currentSlide = this.gallerySwiper.realIndex
         //    })
         // }, 100)
         this.$nuxt.$on('logo-click', this.handleLogoClick)

         // this.getSliderData()

         if (this.$route.query.page === 'plate-announce') {
            this.$router.push(this.$localePath('/profile/announcements'));
         }
      },

      beforeDestroy() {
         this.$nuxt.$off('logo-click', this.handleLogoCkick)
      },

      beforeRouteLeave(to, from, next) {
         this.$nuxt.$emit('prevent-popstate')
         next();
      }
   }
</script>

<style lang="scss">
   .pages-index {
      padding-top: 32px;
   }

   .filters-container {
      padding: 24px !important;
      border-radius: 12px;
      background-color: #FFFFFF;

      &__top {
         display: flex;
         align-items: center;
         justify-content: space-between;
         margin-bottom: 32px;


         h4 {
            color: #121926;
            font-size: 20px;
            font-weight: 600;
            line-height: 24px
         }

         .btn {
            color: #F81734;
            font-size: 16px;
            font-weight: 500;
            line-height: 20px;
            padding: 0;
            background-color: transparent;
         }
      }

      &__head {
         gap: 32px;

         .form-buttons {
            width: 100%;

            &.announce_types {
               padding: 8px;
               border-radius: 12px;
               background-color: #EEF2F6;
               //gap: 0;

               .form-group {
                  button {
                     height: 42px !important;
                  }
               }
            }
         }
      }

      &.mini {
         .filters-container__head {
            .announce_types {
               .form-group {
                  .btn {
                     height: 36px !important;
                  }
               }
            }

            .form-buttons {
               .btn {
                  height: 42px;
               }
            }
         }
      }
   }

   .dark-mode {
      .filters-container {
         background-color: #1B2434;

         &__top {
            svg {
               path {
                  stroke: #EEF2F6;
               }
            }

            h4 {
               color: #EEF2F6;
            }
         }

         &__head {
            .announce_types {
               background-color: #121926;

               //.btn {
               //   &:not(:has(.active)) {
               //      &:hover {
               //         background-color: #1B2434 !important;
               //
               //         span {
               //            color: #9AA4B2 !important;
               //         }
               //      }
               //   }
               //}
            }

            .no-bg {
               .btn {
                  &:hover {
                     border-color: #155EEF !important;

                     span {
                        color: #FFFFFF !important;
                     }
                  }
               }
            }
         }

         .form-group {
            &.price {
               .form-merged {
                  &__inputs {
                     .form-group {
                        &:first-child {
                           &:before {
                              background-color: rgba(89, 89, 90, .6);
                           }
                        }
                     }
                  }
               }
            }
         }
      }
   }

   @media (min-width: 992px) {
      .filters-container {

         &__head {
            flex-direction: row !important;
            gap: unset;

            .form-buttons {
               width: unset;
            }

            .announce_types {
               .form-group {
                  .btn {
                     width: 110px !important;
                  }
               }
            }
         }
      }
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
