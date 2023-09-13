<template>
   <div class="pages-cars-index">
      <div class="container">
         <div class="filters-container mb-5">
            <template v-if="isMobileBreakpoint && !advancedSearch">
               <FiltersMobile :additional-brands="additionalBrands" @pending="pending = true" @openMore="openMore"
                              @submit="submitOnMobile" :meta="{type: 'cars',
            path: '/cars',
            param: 'car_filter'}"/>
            </template>

            <template v-else>
               <div class="filters-container__top" v-if="isMobileBreakpoint">
                  <inline-svg src="/icons/back.svg" @click="goBack"/>

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
                  @submit-filters-mobile="additionalBrands = $event"
                  v-if="searchType === 1"
                  :only-saved-search="!!$route.query.saved || false"
                  :pending="pending"
                  :sorting="sorting"
                  :announceType="announceType"
                  @pending="pending = true"
                  @submit="searchCars"
               />

               <moto-search-form
                  v-else
                  :pending="pending"
                  @pending="pending = true"
                  :announceType="announceType"
                  :category="{}"
               />
            </template>
         </div>

         <breadcrumbs :crumbs="crumbs"/>

         <grid
            class="mt-2"
            v-if="monetizedCars?.length"
            :announcements="monetizedCars"
            :numberOfAds="monetizedCars?.length"
            :hasContainer="false"
            escape-duplicates
         >
            <template #cap>
               <Cap :className="'mb40'">
                  <template #left>
                     <h3>{{ $t('featured_ads') }}</h3>
                  </template>
               </Cap>
            </template>
         </grid>

         <grid
            v-if="carsAnnouncements?.meta?.total > 0"
            :announcements="carsAnnouncements?.data"
            :paginate="carsAnnouncements?.meta"
            :hasContainer="false"
            :numberOfAds="carsAnnouncements?.total"
            :pending="pending"
            @change-page="searchCars"
            escape-duplicates
         >
            <template #cap>
               <Cap :className="'mb40'">
                  <template #left>
                     <h3>
                        <template v-if="getCarDetails && getCarDetails.brand">
                           {{ getCarDetails && getCarDetails.brand }}
                           {{ getCarDetails && getCarDetails.model }}
                           {{ getCarDetails && getCarDetails.generation && getCarDetails.generation[locale] }}
                        </template>

                        <template v-else>{{ $t('announcements') }}</template>
                     </h3>
                  </template>

                  <template #right>
                     <form-select
                        :label="$t('sorting_2')"
                        :options="sortItems"
                        :clearPlaceholder="true"
                        :clear-option="false"
                        :allowClear="false"
                        :objectInValue="true"
                        v-model="sorting"
                     />
                  </template>
               </Cap>
            </template>
         </grid>

         <no-results
            :type="'car'"
            v-else
         />

         <HandleIds :items="handleIdsOptions"/>
      </div>
   </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import {SearchMixin} from '~/mixins/search';
import CarSearchForm from '~/components/cars/CarSearchForm';
import MotoSearchForm from "~/components/moto/MotoSearchForm.vue";
import Grid from '~/components/announcements/Grid';
import NoResults from '~/components/elements/NoResults';
import brand from "../../components/moderator/brand.vue";
import HandleIds from "~/components/announcements/HandleIds.vue";
import Cap from "~/components/elements/Cap.vue";
import FiltersMobile from "~/components/elements/FiltersMobile.vue";

export default {
   name: 'pages-cars-index',

   layout: 'search',

   mixins: [SearchMixin],

   components: {
      CarSearchForm,
      MotoSearchForm,
      Grid,
      NoResults,
      HandleIds,
      Cap,
      FiltersMobile
   },

   nuxtI18n: {
      paths: {
         az: '/masinlar'
      }
   },

   head() {
      return this.$headMeta({
         // title: this.$t('meta-title_cars'),
         // description: this.$t('meta-descr_cars'),

         title: this.getHeadDetails,
         description: this.getHeadDetails
      });
   },

   data() {
      return {
         additionalBrands: {0: {}},
         advancedSearch: false,
         announceType: 0,
         searchType: 1,
         sorting: {key: 'created_at', value: 'desc', name: this.$t('show_by_date')},
         sortItems: [
            {key: 'created_at', value: 'desc', name: this.$t('show_by_date')},
            {key: 'price_asc', value: 'asc', name: this.$t('show_cheap_first')},
            {key: 'price_desc', value: 'desc', name: this.$t('show_expensive_first')},
            {key: 'mileage', value: 'asc', name: this.$t('mileage')},
            {key: 'year', value: 'desc', name: this.$t('years')}
         ]
      }
   },

   watch: {
      '$route.query'(query) {
         if (query && query.with_panorama == 'true') {
            this.searchCars(1, true);
         }
      },

      // searchType() {
      //    this.announceType = 0;
      // }
   },

   async asyncData({store, route, $auth}) {
      let post = JSON.parse(route.query.car_filter || '{}');
      if (route.query.with_panorama == 'true') {
         post = {...post, with_video: true}
      }
      let page = route.query.page || 1;
      let searchParams = {url: '/car', prefix: 'cars'}
      if (!store.state.carsAnnouncements.total) await store.dispatch('getGridSearch', {...searchParams, post, page})

      // if (route.query.monetized) {
      //    store.dispatch('fetchMonetizedAnnouncementsHome');
      //    console.log('1')
      // } else {
      //    console.log('2')

      await Promise.all([
         store.dispatch('getAllOtherOptions', '2'),
         store.dispatch('getBrandsOnlyExists'),
         store.dispatch('getBodyOptions'),
         store.dispatch('getOptions'),
         store.dispatch('fetchBrandsList'),
         store.dispatch('getMotoOptions'),
         store.dispatch('getColors'),
         store.dispatch('getPopularOptions'),
         store.dispatch('fetchMonetizedCarsSearch', post),
         // store.dispatch('fetchMonetizedCars'),

         // get model options for brands
         ...Object.keys(post?.additional_brands || {})
            .filter(key => post?.additional_brands?.[key]?.brand)
            .map((key) => {
               let row = post.additional_brands[key];
               return store.dispatch('getModelsArray', {value: row.brand_slug, index: key})
            }),
         // get generation options for models
         ...Object.keys(post?.additional_brands || {})
            .filter(key => post?.additional_brands?.[key]?.model)
            .map((key) => {
               let row = post.additional_brands[key];
               return store.dispatch('getModelGenerationsArray', {
                  value: row.model_slug,
                  brand_slug: row.brand_slug,
                  index: key
               })
            }),
      ]);
      // }

      if ($auth.loggedIn) {
         await store.dispatch('fetchSavedSearch', {
            search_url: `/cars?car_filter=${encodeURI(JSON.stringify(post))}`
         });
      }

      return {
         searchParams,
         pending: false
      }
   },

   mounted() {
      this.searchType = 1;

      if (!Object.keys(this.$route.query).length) {
         this.$store.dispatch('fetchInfiniteMainMonetized', {type: 'cars'});
      }

      if (this.$route.query?.car_filter) {
         let filters = JSON.parse(this.$route.query?.car_filter)

         if (filters.sort_by === 'price') {
            this.sorting.key = `${filters.sort_by}_${filters.sort_order}`;
            this.sorting.value = filters.sort_order;
         } else {
            this.sorting.key = filters.sort_by;
            this.sorting.value = filters.sort_order;
         }

         this.announceType = filters.announce_type || 0;
         this.additionalBrands[0] = filters.additional_brands[0];
      }
      this.$nuxt.$on("submitSearchMixin", this.submitOnMobile)
   },

   methods: {
      ...mapActions(['getGridSearch']),
      goBack() {
         this.advancedSearch = false
         if (this.isMobileBreakpoint) {
            this.$nuxt.$emit('submit-car-search-form-mobile')
         }
      },
      openMore() {
         this.advancedSearch = true;
      },

      submitOnMobile() {
         this.searchCars()
      },

      async searchCars(page = 1, with_panorama = false) {
         this.advancedSearch = false;
         page = this.$route.query.page || 1;
         let post = JSON.parse(this.$route.query.car_filter || '{}');

         if (!post?.brandsList) {
            if (with_panorama) {
               post = {...post, with_video: true};
            } else {
               post = {...post, sort_by: post.sort_by, sort_order: post.sort_order};
            }
            this.pending = true;
            await this.getGridSearch({...this.searchParams, post, page});
            await this.$store.dispatch('fetchMonetizedCarsSearch', post);
            // await this.$store.dispatch('fetchInfiniteMainMonetized', { type: 'cars', data: post });
            this.pending = false;
            this.scrollTo('.breadcrumbs', [20, -120]);
         }
      }
   },

   computed: {
      ...mapGetters([
         'carsAnnouncements',
         'getMainMonetized',
         'singleSavedSearch',
         'brandsList',
         'monetizedCars',
         'motoAnnouncements',
         'popularOptions',
         'filterVehicle'
      ]),

      brand() {
         return brand
      },

      crumbs() {
         return [
            {name: this.$t('cars')}
         ]
      },

      getCarDetails() {
         let carInfo;
         if (this.$route?.query?.car_filter) {
            carInfo = JSON.parse(this.$route?.query?.car_filter);
            this.additionalBrands[0] = carInfo.additional_brands[0];
         }

         if (!carInfo?.additional_brands[1]?.brand) {
            for (let i = 0; i < this.brandsList?.length; i++) {
               if (this.brandsList[i]?.id === carInfo?.additional_brands[0]?.brand) {
                  return {
                     brand: this.brandsList[i]?.name,
                     model: carInfo?.additional_brands[0]?.model_name,
                     generation: carInfo?.additional_brands[0]?.generation_name
                  }
               }
            }
         }
      },

      getHeadDetails() {
         if (this.getCarDetails?.brand) {
            return `
                  ${this.getCarDetails?.brand}
                  ${this.getCarDetails?.model ? this.getCarDetails?.model : ''}
                  ${this.getCarDetails?.generation ? this.getCarDetails?.generation[this.locale] : ''}
               `
         } else {
            return this.$t('meta-title_cars');
         }
      },

      // sortItems() {
      //    return [
      //       { key: 'created_at', value: 'desc', name: this.$t('show_by_date') },
      //       { key: 'price', value: 'asc', name: this.$t('show_cheap_first') },
      //       { key: 'price', value: 'desc', name: this.$t('show_expensive_first') },
      //       { key: 'mileage', value: 'desc', name: this.$t('mileage') },
      //       { key: 'year', value: 'desc', name: this.$t('years') }
      //    ]
      // },

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
            {name: this.$t('auto'), key: 1},
            {name: this.$t('category_moto'), key: 2}
         ];
      },

      handleIdsOptions() {
         let ids = [];

         ids.push({
            type: 'car',
            ids: [
               ...this.carsAnnouncements.data.map(item => item.id),
               ...this.monetizedCars.map(item => item.id)
            ]
         });

         return ids;
      }
   },
   beforeDestroy() {
      this.$nuxt.$off("submitSearchMixin", this.submitOnMobile)
   },

   beforeRouteLeave(to, from, next) {
      this.$nuxt.$emit('prevent-popstate');
      next();
   }
}
</script>

<style lang="scss">
.pages-cars-index {
   margin-top: 32px;

   &__title {
      font-weight: 600;
      font-size: 32px;
      line-height: 38px;
      color: #121926;
      margin-bottom: 32px;
   }

   .announcements-grid {
      margin-top: 30px;
   }
}
</style>
