<template>
  <div class="pages-moto-index">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <grid 
        v-if="mainAnnouncements.vip.length"
        :announcements="mainAnnouncements.vip" 
        :title="$t('vip_announcements')"
        :icon-name="'vip'"
        :pending="pending"
      />
      <grid 
        :announcements="mainAnnouncements.latest" 
        :paginate="$paginate(mainAnnouncements)"
        :title="$t('recent_uploads')"
        :pending="pending"
        @pending="pending = true"
      />
      <grid 
        v-if="mainAnnouncements.premium.length"
        :announcements="mainAnnouncements.premium" 
        :title="$t('premium_announcements')"
        :icon-name="'premium'"
        :pending="pending"
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