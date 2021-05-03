<template>
  <div class="pages-premium">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <grid 
        v-if="promotedAnnouncements.data.length"
        :announcements="promotedAnnouncements.data" 
        :title="$t('premium_announcements')"
        :paginate="$paginate(promotedAnnouncements)"
        :icon-name="'premium'"
        :pending="pending"
        @change-page="searchCars"
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
  name: 'pages-cars-premium',
  components: {
    Grid,
    NoResults
  },
  nuxtI18n: {
    paths: {
      az: '/masinlar/premium-elanlar'
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('premium_announcements')
    });
  },
  async asyncData({ store }) {
    await store.dispatch('getPromotedSearch', { type: 'premium', page: 1 });

    return { 
      pending: false
    }
  },
  methods: {
    ...mapActions(['getPromotedSearch']),

    async searchCars(page = 1) {
      page = this.$route.query.page || 1;
      this.pending = true;
      await this.getPromotedSearch({ type: 'premium', page });
      this.pending = false;
      this.scrollTo('.announcements-grid');
    }
  },
  computed: {
    ...mapGetters(['promotedAnnouncements']),
    
    crumbs() {
      return [
        { name: this.$t('cars'), route: '/cars' },
        { name: this.$t('premium_announcements') }
      ]
    }
  }
}
</script>