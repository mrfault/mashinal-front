<template>
   <div class="pages-cars-index">
      <div class="container">
         <div class="filters-container mb-5">
            <div class="filters-container__head d-flex align-items-center justify-content-between flex-column mb-5">
               <form-buttons
                  class="announce_types"
                  :options="getMileageOptions"
                  :group-by="3"
                  :btnClass="'blue-new'"
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
               :only-saved-search="!!$route.query.saved || false"
               :total-count="$paginate(carsAnnouncements).total"
               :pending="pending"
               @pending="pending = true"
               @submit="searchCars"
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

         <breadcrumbs :crumbs="crumbs" />

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

<!--         <template v-if="!$route.query.saved">-->
            <grid
               v-if="carsAnnouncements?.meta?.total > 0"
               :announcements="carsAnnouncements?.data"
               :paginate="$paginate(carsAnnouncements)"
               :hasContainer="false"
               :numberOfAds="carsAnnouncements?.total"
               :pending="pending"
               @change-page="searchCars"
               escape-duplicates
            >
               <template #cap>
                  <Cap :className="'mb40'">
                     <template #left>
                        <h3 v-if="getCarDetails && getCarDetails.brand">
                           {{ getCarDetails && getCarDetails.brand }}
                           {{ getCarDetails && getCarDetails.model }}
                           {{ getCarDetails && getCarDetails.generation && getCarDetails.generation[locale] }}
                        </h3>

                        <h3 v-else>{{ $t('announcements') }}</h3>
                     </template>

                     <template #right>
                        <form-select
                           :label="$t('sorting_2')"
                           :options="sortItems"
                           :clearPlaceholder="true"
                           :clear-option="false"
                           :allowClear="false"
                           v-model="sorting"
                        />
                     </template>
                  </Cap>
               </template>
            </grid>

            <no-results v-else />
<!--         </template>-->

         <HandleIds :items="carsAnnouncements.data" />
      </div>
   </div>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex';
   import CarSearchForm from '~/components/cars/CarSearchForm';
   import MotoSearchForm from "~/components/moto/MotoSearchForm.vue";
   import Grid from '~/components/announcements/Grid';
   import NoResults from '~/components/elements/NoResults';
   import brand from "../../components/moderator/brand.vue";
   import HandleIds from "~/components/announcements/HandleIds.vue";
   import Cap from "~/components/elements/Cap.vue";

   export default {
      name: 'pages-cars-index',

      layout: 'search',

      components: {
         CarSearchForm,
         MotoSearchForm,
         Grid,
         NoResults,
         HandleIds,
         Cap
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
           announceType: 1,
           searchType: 1,
           sorting: ''
        }
      },

      watch: {
         '$route.query'(query) {
            if (query && query.with_panorama == 'true') {
               this.searchCars(1, true);
            }
         }
      },

      async asyncData({store, route, $auth}) {
         let post = JSON.parse(route.query.car_filter || '{}');
         if (route.query.with_panorama == 'true') {
            post = {...post, with_video: true}
         }
         let page = route.query.page || 1;
         let searchParams = { url: '/car', prefix: 'cars' }
         if (!store.state.carsAnnouncements.total) await store.dispatch('getGridSearch', {...searchParams, post, page})

         // if (route.query.monetized) {
         //    store.dispatch('fetchMonetizedAnnouncementsHome');
         //    console.log('1')
         // } else {
         //    console.log('2')

            await Promise.all([
               store.dispatch('getBrandsOnlyExists'),
               store.dispatch('getBodyOptions'),
               store.dispatch('getOptions'),
               store.dispatch('fetchBrandsList'),
               store.dispatch('getMotoOptions'),
               store.dispatch('getPopularOptions'),
               // store.dispatch('fetchMonetizedCarsSearch'),
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
            this.$store.dispatch('fetchInfiniteMainMonetized', { type: 'cars' });
         }
      },

      methods: {
         ...mapActions(['getGridSearch']),

         async searchCars(page = 1, with_panorama = false) {
            page = this.$route.query.page || 1;
            let post = JSON.parse(this.$route.query.car_filter || '{}');
            if (with_panorama) {
               post = {...post, with_video: true}
            }
            this.pending = true;
            await this.getGridSearch({...this.searchParams, post, page});
            await this.$store.dispatch('fetchInfiniteMainMonetized', { type: 'cars', data: post });
            // console.log('post', post)
            this.pending = false;
            if (page === 1) {
               this.scrollTo('.announcements-sorting');
            } else {
               this.scrollTo('.announcements-grid.paginated', [-15, -20]);
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
            'popularOptions'
         ]),

         brand() {
            return brand
         },

         crumbs() {
            return [
               { name: this.$t('cars') }
            ]
         },

         getCarDetails() {
            let carInfo;

            if (this.$route?.query?.car_filter) {
               carInfo = JSON.parse(this.$route?.query?.car_filter);
            }

            for (let i = 0; i < this.brandsList?.length; i++) {
               if (this.brandsList[i]?.id === carInfo?.additional_brands[0]?.brand) {
                  return {
                     brand: this.brandsList[i]?.name,
                     model: carInfo?.additional_brands[0]?.model_name,
                     generation: carInfo?.additional_brands[0]?.generation_name
                  }
               }
            }
         },

         getHeadDetails() {
            if (this.getCarDetails?.brand) {
               return `
                  ${this.getCarDetails?.brand}
                  ${this.getCarDetails?.model ? this.getCarDetails?.model : ''}
                  ${this.getCarDetails?.generation ? this.getCarDetails?.generation[this.locale] : '' }
               `
            } else {
               return this.$t('meta-title_cars');
            }
         },

         sortItems() {
            return [
               { id: 'created_at_desc', name: this.$t('show_by_date') },
               { id: 'price_asc', name: this.$t('show_cheap_first') },
               { id: 'price_desc', name: this.$t('show_expensive_first') }
            ]
         },

         getMileageOptions() {
            let zeroFirst;
            return [
               {name: this.$t('all2'), key: zeroFirst ? 0 : 1},
               {name: this.$t('new'), key: zeroFirst ? 1 : 2},
               {name: this.$t('S_H'), key: zeroFirst ? 2 : 3}
               // {name: this.$t(this.meta.type === 'parts' ? 'S_H' : 'with_mileage'), key: zeroFirst ? 2 : 3}
            ];
         },

         getSearchTabs() {
            return [
               { name: this.$t('auto'), key: 1 },
               { name: this.$t('category_moto'), key: 2 }
            ];
         },
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
