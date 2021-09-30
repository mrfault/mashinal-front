<template>
  <div class="pages-moto-index">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <grid 
        :announcements="mainAnnouncements.data" 
        :title="$t('announcements')"
        :pending="pending"
        escape-duplicates
      />
      <infinite-loading 
        action="getMotoMainSearch" 
        getter="mainAnnouncements" 
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

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
      store.dispatch('getMotoMainSearch')
    ]);

    return {
      pending: false
    }
  },
  methods: {
    ...mapActions(['getMotoMainSearch'])
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