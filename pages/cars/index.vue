<template>
  <div class="pages-cars">
    <div class="container">
      <div class="card">
        <cars-search-form 
          @submit="searchCars" 
          :total-count="carsAnnouncements.paginate.total"
        />
      </div>
      <grid 
        v-if="carsAnnouncements.vip.length"
        :announcements="carsAnnouncements.vip" 
        :title="$t('vip_announcements')"
        :show-all="$localePath('/vip')"
        :icon-name="'vip'"
      />
      <grid 
        :announcements="carsAnnouncements.standard" 
        :paginate="carsAnnouncements.paginate"
        :title="$t('recent_uploads')"
        @changePage="searchCars"
      />
      <grid 
        v-if="carsAnnouncements.premium.length"
        :announcements="carsAnnouncements.premium" 
        :title="$t('premium_announcements')"
        :show-all="$localePath('/premium')"
        :icon-name="'premium'"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import CarsSearchForm from '~/components/cars/CarsSearchForm';
import Grid from '~/components/announcements/Grid';

export default {
  components: {
    CarsSearchForm,
    Grid
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
      store.dispatch('getBodyOptions'),
      store.dispatch('getOptions'),
      store.dispatch('getAllOtherOptions', '2'),
      store.dispatch('getColors'),
      store.dispatch('getGridSearch', { ...searchParams, post, page }),
      // get model options for brands
      ...Object.keys(post?.additional_brands || {})
        .filter(key => post?.additional_brands?.[key]?.brand)
        .map((key) => {
          let row = post.additional_brands[key];
          console.log('model', key)
          return store.dispatch('getModelsArray', { value: row.brand_slug, index: key })
        }),
      // get generation options for models
      ...Object.keys(post?.additional_brands || {})
        .filter(key => post?.additional_brands?.[key]?.model)
        .map((key) => {
          console.log('generation', key)
          let row = post.additional_brands[key];
          return store.dispatch('getModelGenerationsArray', { value: row.model_slug, brand_slug: row.brand_slug, index: key })
        }),
    ]);

    if($auth.loggedIn) {
      await store.dispatch('fetchSavedSearch', { 
        search_url: `/cars?car_filter=${encodeURI(route.query.car_filter)}` 
      });
    }

    return { searchParams }
  },
  methods: {
    ...mapActions(['getGridSearch']),

    searchCars() {
      let post = JSON.parse(this.$route.query.car_filter || '{}');
      let page = this.$route.query.page || 1;
      this.getGridSearch({ ...this.searchParams, post, page });
    }
  },
  computed: {
    ...mapGetters(['carsAnnouncements'])
  }
}
</script>