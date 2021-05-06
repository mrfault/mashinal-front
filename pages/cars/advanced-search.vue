<template>
  <div class="pages-cars-advanced-search">
    <slot name="search-nav" />
    <div class="container"> 
      <breadcrumbs :crumbs="crumbs" />
      <car-search-form 
        :advanced="true"
        :pending="pending"
        @pending="pending = true"
      />
    </div>
  </div>
</template>

<script>
import CarSearchForm from '~/components/cars/CarSearchForm';

export default {
  name: 'pages-cars-advanced-search',
  components: {
    CarSearchForm
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
  async asyncData({ store, route, $auth }) {
    let post = JSON.parse(route.query.car_filter || '{}');

    await Promise.all([
      store.dispatch('getBrands'),
      store.dispatch('getBodyOptions'),
      store.dispatch('getOptions'),
      store.dispatch('getAllOtherOptions', '2'),
      store.dispatch('getColors'),
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
      pending: false
    }
  },
  computed: {
    crumbs() {
      return [
        { name: this.$t('cars'), route: '/cars' },
        { name: this.$t('advanced_search') }
      ]
    }
  }
}
</script>