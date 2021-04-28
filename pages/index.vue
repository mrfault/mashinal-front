<template>
  <div class="pages-index">
    <div class="container">
      <div class="card pt-0 pt-lg-3">
        <cars-search-form 
          :total-count="mainAnnouncements.paginate.total"
        />
      </div>
      <grid 
        v-if="mainAnnouncements.vip.length"
        :announcements="mainAnnouncements.vip" 
        :title="$t('vip_announcements')"
        :show-all="$localePath('/vip')"
        :icon-name="'vip'"
      />
      <grid 
        :announcements="mainAnnouncements.standard" 
        :paginate="mainAnnouncements.paginate"
        :title="$t('recent_uploads')"
        :show-all="$localePath('/cars')"
      />
      <grid 
        v-if="mainAnnouncements.random_moto.length"
        :announcements="mainAnnouncements.random_moto" 
        :title="$t('type_motos')"
        :show-all="$localePath('/motorcycles')"
      />
      <grid 
        v-if="mainAnnouncements.premium.length"
        :announcements="mainAnnouncements.premium" 
        :title="$t('premium_announcements')"
        :show-all="$localePath('/premium')"
        :icon-name="'premium'"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import CarsSearchForm from '~/components/cars/CarsSearchForm';
import Grid from '~/components/announcements/Grid';

export default {
  components: {
    CarsSearchForm,
    Grid
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
      store.dispatch('getBodyOptions'),
      store.dispatch('getOptions'),
      store.dispatch('getAllOtherOptions', '2'),
      store.dispatch('getColors'),
      store.dispatch('getMainSearch', { url: '/home_page_cars' }),
      store.dispatch('clearSavedSearch')
    ]);
  },
  computed: {
    ...mapGetters(['mainAnnouncements'])
  }
}
</script>