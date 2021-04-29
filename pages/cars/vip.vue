<template>
  <div class="pages-vip">
    <div class="container">
      <grid 
        v-if="promotedAnnouncements.data.length"
        :announcements="promotedAnnouncements.data" 
        :title="$t('vip_announcements')"
        :paginate="$paginate(promotedAnnouncements)"
        :icon-name="'vip'"
        :pending="pending"
        @changePage="searchCars"
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
  components: {
    Grid,
    NoResults
  },
  nuxtI18n: {
    paths: {
      az: '/masinlar/vip-elanlar'
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('vip_announcements')
    });
  },
  async asyncData({ store }) {
    await store.dispatch('getPromotedSearch', { type: 'vip', page: 1 });

    return { 
      pending: false
    }
  },
  methods: {
    ...mapActions(['getPromotedSearch']),

    async searchCars(page = 1) {
      page = this.$route.query.page || 1;
      this.pending = true;
      await this.getPromotedSearch({ type: 'vip', page });
      this.pending = false;
      this.scrollTo('.announcements-grid');
    }
  },
  computed: {
    ...mapGetters(['promotedAnnouncements'])
  }
}
</script>