<template>
  <div class="pages-cars">
    <div class="container">
      <div class="card">
        <cars-search-form @submit="searchCars" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import CarsSearchForm from '~/components/pages/cars/CarsSearchForm';

export default {
  components: {
    CarsSearchForm
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

    await Promise.all([
      store.dispatch('getBrands'),
      store.dispatch('getBodyOptions'),
      store.dispatch('getOptions'),
      store.dispatch('getAllOtherOptions', '2'),
      store.dispatch('getColors'),
      store.dispatch('getAnnouncementSearch', { post: { announce_type: 1 }, get_items: false}),
      store.dispatch('getGridSearch', { post, page }),
    ]);

    if($auth.loggedIn) {
      await store.dispatch('fetchSavedSearch', { 
        search_url: `/cars?car_filter=${encodeURI(route.query.car_filter)}` 
      });
    }
  },
  methods: {
    ...mapActions(['getGridSearch']),

    searchCars() {
      let post = JSON.parse(this.$route.query.car_filter || '{}');
      let page = this.$route.query.page || 1;
      this.getGridSearch({ post, page });
    }
  }
}
</script>