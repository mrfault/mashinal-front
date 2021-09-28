<template>
  <div class="pages-parts-user-announcements">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <grid
        :title="$t('all_announcements_of_user')"
        :announcements="announcements"
        escape-duplicates
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Grid from '~/components/announcements/Grid';

export default {
  name: 'pages-parts-user-id-announcements',
  nuxtI18n: {
    paths: {
      az: '/ehtiyat-hisseleri/istifadeci/:id/elanlar'
    }
  },
  components: {
    Grid
  },
  async asyncData({ store, route }) {
    await store.dispatch('parts/getAnnouncementsByNumber', route.params.id)
    return {}
  },
  computed: {
    ...mapGetters({
      announcements: 'parts/announcements'
    }),
    crumbs() {
      return [
        { name: this.$t('parts'), route: `/parts` },
        { name: `${this.$t('all_announcements_of_user')} #${this.$route.params.id}` },
      ]
    }
  }
}
</script>