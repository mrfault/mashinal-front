<template>
  <div class="pages-index">
    <div class="container">
      <car-search-form 
        :total-count="$paginate(mainAnnouncements).total"
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
      <template v-if="mainAnnouncements.random_moto">
        <grid 
          v-if="mainAnnouncements.random_moto.length"
          :announcements="mainAnnouncements.random_moto" 
          :title="$t('moto')"
          :show-all="$localePath('/motorcycles')"
          :pending="pending"
        />
      </template>
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

import CarSearchForm from '~/components/cars/CarSearchForm';
import Grid from '~/components/announcements/Grid';

export default {
  name: 'pages-index',
  layout: 'search',
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
  },
  created() {
    console.log('test commit');
  }
}
</script>