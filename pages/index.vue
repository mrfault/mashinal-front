<template>
  <div class="pages-index">
    <div class="container">
      <car-search-form 
        :total-count="$paginate(mainAnnouncements).total"
        :pending="pending"
        @pending="pending = true"
      />
    </div>
    <div class="overflow-hidden">
      <grid 
        :escape-duplicates="true"
        :announcements="mainAnnouncements.data" 
        :pending="pending"
        :banner="true"
        :banner-place="24"
        :banner-for="'Part'"
        :has-container="true"
      />
    </div>
    <infinite-loading 
      action="getInfiniteMainSearch" 
      getter="mainAnnouncements" 
      action-b="getInfiniteMainPartsSearch" 
      getter-b="mainPartsAnnouncements" 
    />
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
      store.dispatch('getBodyOptions'),
      store.dispatch('getInfiniteMainSearch'),
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