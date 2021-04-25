<template>
  <div class="pages-index">
    <div class="container">
      <div class="card">
        <cars-search-form />
      </div>
    </div>
  </div>
</template>

<script>
import CarsSearchForm from '~/components/pages/cars/CarsSearchForm';

export default {
  components: {
    CarsSearchForm
  },
  head() {
    return this.$headMeta({
      title: this.$t('meta-title_main-page'),
      descr: this.$t('meta-descr_main-page')
    });
  },
  async asyncData({ store }) {
    await Promise.all([
      store.dispatch('getBrands'),
      store.dispatch('getAnnouncementMain', { url: '/home_page_cars' }),
      store.dispatch('getBodyOptions'),
      store.dispatch('getOptions'),
      store.dispatch('getAllOtherOptions', '2'),
      store.dispatch('getColors'),
      store.dispatch('getAnnouncementSearch', { post: { announce_type: 1 }, get_items: false}),
      store.dispatch('clearSavedSearch')
    ]);
  }
}
</script>