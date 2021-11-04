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
        :banner="'/img/parts-{count}-{locale}.jpg'"
        :banner-place="24"
        :banner-count="4"
        :banner-for="'Part'"
        :banner-link="'/parts'"
        :has-container="true"
      />
    </div>
    <infinite-loading 
      action="getInfiniteMainSearch" 
      getter="mainAnnouncements" 
      action-b="getInfiniteMainPartsSearch" 
      getter-b="mainPartsAnnouncements" 
      :per-page="20"
      :per-page-b="4"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

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
    ...mapActions(['getInfiniteMainSearch', 'clearSavedSearch']),

    async handleLogoClick() {
      this.$scrollTo('body');
      this.$nuxt.$emit('reset-search-form');
      this.pending = true;
      await Promise.all([
        this.getInfiniteMainSearch(),
        this.clearSavedSearch()
      ]);
      this.pending = false;
    }
  },
  mounted() {
    this.$nuxt.$on('logo-click', this.handleLogoClick);
  },
  beforeDestroy() {
    this.$nuxt.$off('logo-click', this.handleLogoCkick);
  },
  beforeRouteLeave(to, from, next) {
    this.$nuxt.$emit('prevent-popstate');
    next();
  }
}
</script>