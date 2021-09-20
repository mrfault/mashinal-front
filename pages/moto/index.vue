<template>
  <div class="pages-moto-index">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <grid 
        :announcements="mainAnnouncements.latest" 
        :paginate="$paginate(mainAnnouncements)"
        :title="$t('announcements')"
        :pending="pending"
        @pending="pending = true"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import Grid from '~/components/announcements/Grid';

export default {
  name: 'pages-moto-index',
  layout: 'search',
  components: {
    Grid
  },
  nuxtI18n: {
    paths: {
      az: '/moto'
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('meta-title_moto', { type: this.$t('meta-words_moto-types')[0] }),
      description: this.$t('meta-descr_moto', { type: this.$t('meta-words_moto-types')[0] })
    });
  },
  async asyncData({ store }) {
    await Promise.all([
      store.dispatch('getMotoOptions'),
      store.dispatch('getMainSearch', { url: '/moto_home_page' })
    ]);

    return {
      pending: false
    }
  },
  computed: {
    ...mapGetters(['mainAnnouncements']),

    crumbs() {
      return [
        { name: this.$t('moto') }
      ]
    }
  }
}
</script>