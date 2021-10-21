<template>
  <div class="pages-user-announcements">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <grid
        v-if="userAnnouncements.length"
        :title="$t('all_announcements_of_user', { name: userFullName })"
        :announcements="userAnnouncements"
        escape-duplicates
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Grid from '~/components/announcements/Grid';

export default {
  name: 'pages-user-id-announcements',
  nuxtI18n: {
    paths: {
      az: '/istifadeci/:id/elanlar'
    }
  },
  components: {
    Grid
  },
  async asyncData({ store, route }) {
    await store.dispatch('getUserAnnouncements', { id: route.params.id });
  },
  computed: {
    ...mapGetters(['userAnnouncements']),

    userFullName() {
      return this.userAnnouncements[0]?.user.full_name;
    },

    crumbs() {
      return [
        { name: this.$t('all_announcements_of_user', { name: this.userFullName }) },
      ]
    }
  }
}
</script>