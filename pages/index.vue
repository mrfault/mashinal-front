<template>
  <div class="pages-index">
    <div class="container">
      <car-search-form 
        :total-count="$paginate(mainAnnouncements).total"
        :pending="pending"
        @pending="pending = true"
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
        v-if="mainAnnouncements.random_part && mainAnnouncements.random_part.length"
        :announcements="mainAnnouncements.random_part" 
        :title="$t('parts')"
        :show-all="$localePath('/parts')"
        :pending="pending"
      />
      <grid 
        v-if="mainAnnouncements.random_moto && mainAnnouncements.random_moto.length"
        :announcements="mainAnnouncements.random_moto" 
        :title="$t('moto')"
        :show-all="$localePath('/moto')"
        :pending="pending"
      />
      <grid 
        v-if="mainAnnouncements.random_commercial && mainAnnouncements.random_commercial.length"
        :announcements="mainAnnouncements.random_commercial" 
        :title="$t('commercial')"
        :show-all="$localePath('/commercial')"
        :pending="pending"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import CarSearchForm from '~/components/cars/CarSearchForm';
import Grid from '~/components/announcements/Grid';

export default {
  name: 'pages-index',
  layout: 'search',
  middleware: 'payment_redirect',
  components: {
    CarSearchForm,
    Grid
  },
  head() {
    return this.$headMeta({
      title: this.$t('meta-title_main-page'),
      description: this.$t('meta-descr_main-page')
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
  },
  beforeRouteLeave(to, from, next) {
    this.$nuxt.$emit('prevent-popstate');
    next();
  }
}
</script>