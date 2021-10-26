<template>
  <div class="pages-dashboard-calls pt-lg-5">
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
      <no-results v-else
        :type="$route.params.type == 2 ? 'part' : 'car'" 
        :text="$t('add_an_ad_and_thousands_of_potential_buyers_will_see_it')" 
      >
        <nuxt-link :to="$localePath('/sell')" class="btn btn--green mt-2 mt-lg-3" v-html="$t('to_sell')" />
      </no-results>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  import Grid from '~/components/announcements/Grid';
  import NoResults from '~/components/elements/NoResults';

  export default {
    name: 'pages-dashboard-calls',
    middleware: ['auth_general','auth_salon'],
    components: {
      Grid,
      NoResults
    },
    nuxtI18n: {
      paths: {
        az: '/idareetme-paneli/:type/zeng-sayi'
      }
    },
    head() {
      return this.$headMeta({
        title: this.$t('phone_call_count')
      });
    },
    async asyncData({store, route, app}) {
      await store.dispatch('getAnnouncementCalls', { id: app.$getDashboardId(route.params.type)});

      return {
        pending: false
      }
    },
    computed: {
      ...mapGetters(['myAnnouncementCalls']),

      crumbs() {
        return [
          { name: this.$t('dashboard'), route: '/dashboard/' + this.$route.params.type },
          { name: this.$t('phone_call_count') }
        ]
      }
    },
    methods: {
      ...mapActions(['getAnnouncementCalls']),

      async changePage(page = 1) {
        page = this.$route.query.page || 1;
        this.pending = true;
        await this.getAnnouncementCalls({ id: this.$getDashboardId(this.$route.params.type), page });
        this.pending = false;
        this.scrollTo('.announcements-grid.paginated', [-15, -20]);
      }
    }
  }
</script>