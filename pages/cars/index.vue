<template>
  <div class="pages-cars-index">
    <div class="container"> 
      <breadcrumbs :crumbs="crumbs" />
      <car-search-form 
        :total-count="carsAnnouncements.paginate.total"
        :pending="pending"
        @pending="pending = true"
        @submit="searchCars" 
      />
      <grid 
        v-if="carsAnnouncements.vip.length"
        :announcements="carsAnnouncements.vip" 
        :title="$t('vip_announcements')"
        :show-all="$localePath('/cars/vip')"
        :icon-name="'vip'"
        :pending="pending"
      />
      <grid 
        v-if="carsAnnouncements.standard.length"
        :announcements="carsAnnouncements.standard" 
        :paginate="carsAnnouncements.paginate"
        :title="$t('recent_uploads')"
        :pending="pending"
        @change-page="searchCars"
      />
      <no-results v-else />
      <grid 
        v-if="carsAnnouncements.premium.length"
        :announcements="carsAnnouncements.premium" 
        :title="$t('premium_announcements')"
        :show-all="$localePath('/cars/premium')"
        :icon-name="'premium'"
        :pending="pending"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import CarSearchForm from '~/components/cars/CarSearchForm';
import Grid from '~/components/announcements/Grid';
import NoResults from '~/components/elements/NoResults';

export default {
  name: 'pages-cars-index',
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
      title: this.$t('meta-title_cars'),
      descr: this.$t('meta-descr_cars')
    });
  },
  async asyncData({ store, route, $auth }) {
    let post = JSON.parse(route.query.car_filter || '{}');
    let page = route.query.page || 1;
    let searchParams = { url: '/grid/cars', prefix: 'cars' }

    await Promise.all([
      store.dispatch('getBrands'),
      store.dispatch('getOptions'),
      store.dispatch('getGridSearch', { ...searchParams, post, page }),
      // get model options for brands
      ...Object.keys(post?.additional_brands || {})
        .filter(key => post?.additional_brands?.[key]?.brand)
        .map((key) => {
          let row = post.additional_brands[key];
          return store.dispatch('getModelsArray', { value: row.brand_slug, index: key })
        }),
      // get generation options for models
      ...Object.keys(post?.additional_brands || {})
        .filter(key => post?.additional_brands?.[key]?.model)
        .map((key) => {
          let row = post.additional_brands[key];
          return store.dispatch('getModelGenerationsArray', { value: row.model_slug, brand_slug: row.brand_slug, index: key })
        }),
    ]);

    if($auth.loggedIn) {
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

    async searchCars(page = 1) {
      page = this.$route.query.page || 1;
      let post = JSON.parse(this.$route.query.car_filter || '{}');
      this.pending = true;
      await this.getGridSearch({ ...this.searchParams, post, page });
      this.pending = false;
      if(page === 1) {
        this.scrollTo('.announcements-sorting');
      } else {
        this.scrollTo('.announcements-grid.paginated', [-15, -20]);
      }
    }
  },
  computed: {
    ...mapGetters(['carsAnnouncements']),
    
    crumbs() {
      return [
        { name: this.$t('cars') }
      ]
    }
  }
}
</script>