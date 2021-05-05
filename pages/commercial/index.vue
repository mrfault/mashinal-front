<template>
  <div class="pages-commercial-index">
    <search-nav v-if="isMobileBreakpoint" />
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <grid 
        v-if="commercialAnnouncements.standard.length"
        :announcements="commercialAnnouncements.standard" 
        :paginate="commercialAnnouncements.paginate"
        :title="$t('recent_uploads')"
        :pending="pending"
        @change-page="searchCommercial"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import SearchNav from '~/components/layout/SearchNav';
import Grid from '~/components/announcements/Grid';

export default {
  name: 'pages-commercial-index',
  components: {
    SearchNav,
    Grid
  },
  nuxtI18n: {
    paths: {
      az: '/ticari-avtomobiller'
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('meta-title_commercial', { type: this.$t('meta-words_commercial-types')[0] }),
      description: this.$t('meta-descr_commercial', { type: this.$t('meta-words_commercial-types')[0] })
    });
  },
  async asyncData({ store, route }) {
    let page = route.query.page || 1;
    let searchParams = { url: '/grid/commercial', prefix: 'commercial' }

    await Promise.all([
      store.dispatch('getGridSearch', { ...searchParams, page }),
    ]);

    return {
      searchParams,
      pending: false
    }
  },
  methods: {
    ...mapActions(['getGridSearch']),

    async searchCommercial(page = 1) {
      page = this.$route.query.page || 1;
      this.pending = true;
      await this.getGridSearch({ ...this.searchParams, page });
      this.pending = false;
      this.scrollTo('.announcements-grid.paginated', [-15, -20]);
    }
  },
  computed: {
    ...mapGetters(['commercialAnnouncements']),

    crumbs() {
      return [
        { name: this.$t('commercial') }
      ]
    }
  }
}
</script>