<template>
   <div class="pages-cars-index">
      <div class="container">
         <breadcrumbs :crumbs="crumbs"/>

         <h1 class="pages-cars-index__title" v-if="getCarDetails && getCarDetails.brand">
            {{ getCarDetails && getCarDetails.brand }}
            {{ getCarDetails && getCarDetails.model }}
            {{ getCarDetails && getCarDetails.generation && getCarDetails.generation[locale] }}
         </h1>

         <car-search-form
            :only-saved-search="!!$route.query.saved || false"
            :total-count="$paginate(carsAnnouncements).total"
            :pending="pending"
            @pending="pending = true"
            @submit="searchCars"
         />

         <template v-if="!$route.query.saved">
            <grid
               v-if="carsAnnouncements.total > 0"
               :announcements="carsAnnouncements.data"
               :paginate="$paginate(carsAnnouncements)"
               :title="$t('announcements')"
               :pending="pending"
               @change-page="searchCars"
               escape-duplicates
            />
            <no-results v-else/>
         </template>
      </div>
   </div>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex';
   import CarSearchForm from '~/components/cars/CarSearchForm';
   import Grid from '~/components/announcements/Grid';
   import NoResults from '~/components/elements/NoResults';
   import brand from "../../components/moderator/brand.vue";

   export default {
      name: 'pages-cars-index',
      layout: 'search',
      components: {
         CarSearchForm,
         Grid,
         NoResults
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

            title: `${this.getCarDetails?.brand} ${this.getCarDetails?.model} ${this.getCarDetails?.generation && this.getCarDetails?.generation[this.locale]}`,
            description: `${this.getCarDetails?.brand} ${this.getCarDetails?.model} ${this.getCarDetails?.generation && this.getCarDetails?.generation[this.locale]}`
         });
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
         let searchParams = {url: '/grid/cars', prefix: 'cars'}
         if (!store.state.carsAnnouncements.total)
            await store.dispatch('getGridSearch', {...searchParams, post, page})
            await Promise.all([
               store.dispatch('getBrands'),
               store.dispatch('getBodyOptions'),
               store.dispatch('getOptions'),

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
            this.pending = false;
            if (page === 1) {
               this.scrollTo('.announcements-sorting');
            } else {
               this.scrollTo('.announcements-grid.paginated', [-15, -20]);
            }
         }
      },
      computed: {
         ...mapGetters(['carsAnnouncements', 'brands']),

         brand() {
            return brand
         },

         crumbs() {
            return [
               {name: this.$t('cars')}
            ]
         },

         getCarDetails() {
            const carInfo = JSON.parse(this.$route.query.car_filter || '{}');

            for (let i = 0; i < this.brands.length; i++) {
               if (this.brands[i].id == carInfo.additional_brands[0].brand) {
                  return {
                     brand: this.brands[i].name,
                     model: carInfo?.additional_brands[0]?.model_name,
                     generation: carInfo?.additional_brands[0]?.generation_name
                  }
               }
            }
         }
      },
      beforeRouteLeave(to, from, next) {
         this.$nuxt.$emit('prevent-popstate');
         next();
      }
   }
</script>

<style lang="scss">
   .pages-cars-index {
      &__title {
         font-weight: 600;
         font-size: 32px;
         line-height: 38px;
         color: #121926;
         margin-bottom: 32px;
      }
   }
</style>