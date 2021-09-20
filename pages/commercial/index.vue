<template>
  <div class="pages-commercial-index">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <grid 
        v-if="commercialAnnouncements.data.length"
        :announcements="commercialAnnouncements.data" 
        :paginate="$paginate(commercialAnnouncements)"
        :title="$t('announcements')"
        :pending="pending"
        @change-page="searchCommercial"
      />
      <no-results v-else />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import Grid from '~/components/announcements/Grid';
import NoResults from '~/components/elements/NoResults';

export default {
  name: 'pages-commercial-index',
  layout: 'search',
  components: {
    Grid,
    NoResults
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
      let post = JSON.parse(this.$route.query.filter || '{}');
      this.pending = true;
      await this.getGridSearch({ ...this.searchParams, post, page });
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