<template>
  <div class="pages-index">
    <div class="container">
      <car-search-form 
        :total-count="$paginate(mainAnnouncements).total"
        :pending="pending"
        @pending="pending = true"
      />
      <grid 
        v-if="mainAnnouncements.data.length"
        :announcements="mainAnnouncements.data" 
        :paginate="$paginate(mainAnnouncements)"
        :title="$t('announcements')"
        :pending="pending"
        @pending="pending = true"
        escape-duplicates
      />
      <no-results v-else />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import CarSearchForm from '~/components/cars/CarSearchForm';
import Grid from '~/components/announcements/Grid';
import NoResults from '~/components/elements/NoResults';

export default {
  name: 'pages-index',
  layout: 'search',
  middleware: 'payment_redirect',
  components: {
    CarSearchForm,
    Grid,
    NoResults
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
      store.dispatch('getBodyOptions'),
      store.dispatch('getMainSearch', { url: '/home_page_all' }),
      store.dispatch('clearSavedSearch')
    ]);

    return {
      pending: false
    }
  },
  computed: {
    ...mapGetters(['mainAnnouncements'])
  },
  methods: {
    scrollUp() {
      this.$scrollTo('body');
    }
  },
  mounted() {
    this.$nuxt.$on('logo-click', this.scrollUp);
  },
  beforeDestroy() {
    this.$nuxt.$off('logo-click', this.scrollUp);
  },
  beforeRouteLeave(to, from, next) {
    this.$nuxt.$emit('prevent-popstate');
    next();
  }
}
</script>