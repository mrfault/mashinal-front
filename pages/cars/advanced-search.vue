<template>
   <div class="pages-cars-advanced-search">
      <div class="container">
         <breadcrumbs :crumbs="crumbs"/>

         <car-search-form
            :is-search-page="true"
            :advanced="true"
            :pending="pending"
            @pending="pending = true"
            @submit="searchCars"
         />

         <template v-if="!$route.query.saved">
            <grid
               v-if="carsAnnouncements.data.length"
               :announcements="carsAnnouncements.data"
               :paginate="$paginate(carsAnnouncements)"

               :pending="pending"
               @change-page="searchCars"
               escape-duplicates
            />
<!--            :title="$t('announcements')"-->
            <no-results v-else/>
         </template>
      </div>
   </div>
</template>

<script>
   import CarSearchForm from '~/components/cars/CarSearchForm';
   import Grid from '~/components/announcements/Grid';
   import NoResults from '~/components/elements/NoResults';
   import {mapActions, mapGetters} from "vuex";

   export default {
      name: 'pages-cars-advanced-search',

      layout: 'search',

      components: {
         CarSearchForm,
         Grid,
         NoResults
      },

      nuxtI18n: {
         paths: {
            az: '/masinlar/etrafli-axtaris'
         }
      },

      head() {
         return this.$headMeta({
            title: this.$t('advanced_search')
         });
      },

      async asyncData({store, route, $auth, app, req}) {
         let post = JSON.parse(route.query.car_filter || '{}');
         let page = route.query.page || 1;
         let searchParams = {url: '/grid/cars', prefix: 'cars'}

         if (!store.state.carsAnnouncements.total)
            await store.dispatch('getGridSearch', {...searchParams, post, page})
         await Promise.all([
            store.dispatch('getBrandsOnlyExists'),
            store.dispatch('getBodyOptions'),
            store.dispatch('getOptions'),
            store.dispatch('getAllOtherOptions', '2'),
            store.dispatch('getColors'),
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

      computed: {
         ...mapGetters(['carsAnnouncements']),

         crumbs() {
            return [
               {name: this.$t('cars'), route: '/cars'},
               {name: this.$t('advanced_search')}
            ]
         }
      },

      methods: {
         ...mapActions(['getGridSearch']),

         async searchCars(page = 1) {
            page = this.$route.query.page || 1;
            let post = JSON.parse(this.$route.query.car_filter || '{}');
            this.pending = true;
            await this.getGridSearch({...this.searchParams, post, page});
            this.pending = false;

            if (page === 1) {
               // this.scrollTo('.announcements-grid');
            } else {
               this.scrollTo('.announcements-grid.paginated', [-15, -20]);
            }
         }
      },

      beforeRouteLeave(to, from, next) {
         this.$nuxt.$emit('prevent-popstate');
         next();
      }
   }
</script>
