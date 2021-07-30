<template>
  <div class="pages-profile-calls pt-lg-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <grid 
        v-if="myAnnouncementCalls.items.length"
        :title="$t('phone_call_count')"
        :announcements="myAnnouncementCalls.items" 
        :paginate="$paginate(myAnnouncementCalls)"
        :show-title="isMobileBreakpoint"
        :watch-route="true"
        :pending="pending"
        :show-phone-count="true"
        :track-views="false"
        @change-page="changePage"
      />
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  import Grid from '~/components/announcements/Grid';

  export default {
    name: 'pages-profile-calls',
    middleware: ['auth_general','auth_autosalon'],
    components: {
      Grid
    },
    nuxtI18n: {
      paths: {
        az: '/profil/zeng-sayi'
      }
    },
    head() {
      return this.$headMeta({
        title: this.$t('phone_call_count')
      });
    },
    async asyncData({store}) {
      await store.dispatch('getAnnouncementCalls');

      return {
        pending: false
      }
    },
    computed: {
      ...mapGetters(['myAnnouncementCalls']),

      crumbs() {
        return [
          { name: this.$t('dashboard'), route: '/profile/dashboard' },
          { name: this.$t('phone_call_count') }
        ]
      }
    },
    methods: {
      ...mapActions(['getAnnouncementCalls']),

      async changePage(page = 1) {
        page = this.$route.query.page || 1;
        this.pending = true;
        await this.getAnnouncementCalls({ page });
        this.pending = false;
        this.scrollTo('.announcements-grid.paginated', [-15, -20]);
      }
    }
  }
</script>