<template>
  <div class="pages-favorites">
    <div class="container"> 
      <breadcrumbs :crumbs="crumbs" />
      <grid 
        v-if="favoriteAnnouncements.data.length"
        :announcements="favoriteAnnouncements.data" 
        :paginate="$paginate(favoriteAnnouncements)"
        :pending="pending"
        :watch-route="true"
        @change-page="changePage"
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
  name: 'pages-profile-favorites',
  middleware: 'auth_general',
  components: {
    Grid,
    NoResults
  },
  nuxtI18n: {
    paths: {
      az: '/profil/secilmisler'
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('favorites')
    });
  },
  async asyncData({ store, route }) {
    let page = route.query.page || 1;

    await Promise.all([
      store.dispatch('getFavoriteAnnouncements', { page }),
    ]);

    return { 
      pending: false
    }
  },
  methods: {
    ...mapActions(['getFavoriteAnnouncements']),

    async changePage(page = 1) {
      page = this.$route.query.page || 1;
      this.pending = true;
      await this.getFavoriteAnnouncements({ page });
      this.pending = false;
      this.scrollTo('.announcements-grid.paginated', [-15, -20]);
    }
  },
  computed: {
    ...mapGetters(['favoriteAnnouncements']),
    
    crumbs() {
      return [
        { name: this.$t('favorites') }
      ]
    }
  },
  mounted() {
    this.$nuxt.$on('favorites-updated', this.getFavoriteAnnouncements);
  },
  beforeDestroy() {
    this.$nuxt.$off('favorites-updated', this.getFavoriteAnnouncements);
  }
}
</script>