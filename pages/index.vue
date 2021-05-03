<template>
  <div class="pages-index">
    <div class="container">
      <cars-search-form 
        :total-count="mainAnnouncements.paginate.total"
        :pending="pending"
        @pending="pending = true"
      />
      <grid 
        v-if="mainAnnouncements.vip.length"
        :announcements="mainAnnouncements.vip" 
        :title="$t('vip_announcements')"
        :show-all="$localePath('/cars/vip')"
        :icon-name="'vip'"
        :pending="pending"
      />
      <grid 
        :announcements="mainAnnouncements.standard" 
        :paginate="$paginate(mainAnnouncements)"
        :title="$t('recent_uploads')"
        :show-all="$localePath('/cars')"
        :pending="pending"
        @pending="pending = true"
      />
      <grid 
        v-if="mainAnnouncements.random_moto.length"
        :announcements="mainAnnouncements.random_moto" 
        :title="$t('type_motos')"
        :show-all="$localePath('/motorcycles')"
        :pending="pending"
      />
      <grid 
        v-if="mainAnnouncements.premium.length"
        :announcements="mainAnnouncements.premium" 
        :title="$t('premium_announcements')"
        :show-all="$localePath('/cars/premium')"
        :icon-name="'premium'"
        :pending="pending"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import CarsSearchForm from '~/components/cars/CarsSearchForm';
import Grid from '~/components/announcements/Grid';

export default {
  name: 'pages-index',
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
      store.dispatch('getOptions'),
      store.dispatch('getMainSearch', { url: '/home_page_cars' }),
      store.dispatch('clearSavedSearch')
    ]);

    return {
      pending: false
    }
  },
  computed: {
    ...mapGetters(['mainAnnouncements'])
  }
}
</script>