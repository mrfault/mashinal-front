<template>
   <div class="pages-moto-index">
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
               :pending="pending"
               :total-count="$paginate(mainAnnouncements).total"
               :announceType="announceType"
               @pending="pending = true"
            />

            <moto-search-form
               v-else
               :total-count="$paginate(motoAnnouncements).total"
               :pending="pending"
               :category="{}"
               :sorting="sorting"
               @pending="pending = true"
               @submit="searchMoto"
            />
         </div>

         <breadcrumbs :crumbs="crumbs" />

         <grid
            v-if="motoAnnouncements.data.length"
            :announcements="motoAnnouncements.data"
            :paginate="$paginate(motoAnnouncements)"
            :pending="pending"
            :hasContainer="false"
            @change-page="searchMoto"
            escape-duplicates
         >
            <template #cap>
               <Cap :className="'mb40'">
                  <template #left>
                     <h3 v-if="getCarDetails && getCarDetails?.brand">
                        {{ getCarDetails && getCarDetails?.brand }}
                        {{ getCarDetails && getCarDetails?.model }}
                        {{ getCarDetails && getCarDetails?.generation && getCarDetails?.generation[locale] }}
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
                        :objectInValue="true"
                        v-model="sorting"
                     />
                  </template>
               </Cap>
            </template>
         </grid>
         <!--         :title="$t('announcements')"-->

         <no-results v-else/>

         <HandleIds :type="'motorcycles'" :items="motoAnnouncements.data" />
      </div>
   </div>
</template>

<script>
   import {mapGetters, mapActions} from 'vuex';

   import CarSearchForm from "~/components/cars/CarSearchForm.vue";
   import MotoSearchForm from '~/components/moto/MotoSearchForm';
   import Grid from '~/components/announcements/Grid';
   import NoResults from '~/components/elements/NoResults';
   import HandleIds from "~/components/announcements/HandleIds.vue";
   import Cap from "~/components/elements/Cap.vue";

   export default {
      name: 'pages-moto-index',

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
            az: '/moto'
         }
      },

      head() {
         return this.$headMeta({
            title: this.$t('meta-title_moto', {type: this.$t('meta-words_moto-types')[0]}),
            description: this.$t('meta-descr_moto', {type: this.$t('meta-words_moto-types')[0]})
         });
      },

      data() {
         return {
            announceType: 1,
            searchType: 1,
            sorting: { key: 'created_at', value: 'desc', name: this.$t('show_by_date') },
            sortItems: [
               { key: 'created_at', value: 'desc', name: this.$t('show_by_date') },
               { key: 'price', value: 'asc', name: this.$t('show_cheap_first') },
               { key: 'price', value: 'desc', name: this.$t('show_expensive_first') },
               { key: 'mileage', value: 'desc', name: this.$t('mileage') },
               { key: 'year', value: 'desc', name: this.$t('years') }
            ]
         }
      },

      async asyncData({store, route}) {
         let post = {...JSON.parse(route.query.filter || '{}')};
         let page = route.query.page || 1;
         let searchParams = {url: '/moto', prefix: 'moto'}

         await Promise.all([
            store.dispatch('fetchAllAnnouncementsHome'),
            store.dispatch('getBrandsOnlyExists'),
            store.dispatch('fetchBrandsList'),
            store.dispatch('getMotoOptions'),
            store.dispatch('getBodyOptions'),
            store.dispatch('getMotoGearboxV2'),
            store.dispatch('getOptions'),
            store.dispatch('getColors'),
            store.dispatch('getMotoTransmissionsV2'),
            store.dispatch('getMotoFuelTypesV2'),
            store.dispatch('getGridSearch', {...searchParams, post, page}),
            // get model options for brands
            ...Object.keys(post?.additional_brands || {})
               .filter(key => post?.additional_brands?.[key]?.brand)
               .map((key) => {
                  let row = post.additional_brands[key];
                  return store.dispatch('getMotoModels', {category: row.category, id: row.brand, index: key})
               })
         ]);

         return {
            searchParams,
            pending: false
         }
      },

      methods: {
         ...mapActions(['getGridSearch']),

         async searchMoto(page = 1) {
            page = this.$route.query.page || 1;
            let post = JSON.parse(this.$route.query.filter || '{}');
            post = { ...post, sort_by: post.sort_by, sort_order: post.sort_order }

            this.pending = true;
            await this.getGridSearch({...this.searchParams, post, page});
            await this.$store.dispatch('fetchInfiniteMainMonetized', { type: 'moto', data: post });
            this.pending = false;
            // this.scrollTo('.announcements-grid.paginated', [-15, -20]);
         }
      },

      computed: {
         ...mapGetters(['motoAnnouncements', 'getMainMonetized', 'mainAnnouncements', 'brandsList']),

         crumbs() {
            return [
               {name: this.$t('moto')}
            ]
         },

         getMileageOptions() {
            let zeroFirst;
            return [
               {name: this.$t('all2'), key: zeroFirst ? 0 : 1},
               {name: this.$t('new'), key: zeroFirst ? 1 : 2},
               {name: this.$t('with_mileage_2'), key: zeroFirst ? 2 : 3}
               // {name: this.$t(this.meta.type === 'parts' ? 'S_H' : 'with_mileage'), key: zeroFirst ? 2 : 3}
            ];
         },

         getSearchTabs() {
            return [
               { name: this.$t('auto'), key: 1 },
               { name: this.$t('category_moto'), key: 2 }
            ];
         },

         getCarDetails() {
            if (this.$route?.query?.filter) {
               const carInfo = JSON.parse(this.$route.query?.filter);

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

         // sortItems() {
         //    return [
         //       { id: 'created_at_desc', name: this.$t('show_by_date') },
         //       { id: 'price_asc', name: this.$t('show_cheap_first') },
         //       { id: 'price_desc', name: this.$t('show_expensive_first') }
         //    ]
         // }
      },

      mounted() {
         this.searchType = 2;

         if (!Object.keys(this.$route.query)?.length) {
            this.$store.dispatch('fetchInfiniteMainMonetized', { type: 'moto' });
         }
      },

      beforeRouteLeave(to, from, next) {
         this.$nuxt.$emit('prevent-popstate');
         next();
      }
   }
</script>

<style lang="scss" scoped>
   .pages-moto-index {
      padding-top: 32px;

      .announcements-grid {
         margin-top: 30px;
      }
   }
</style>
