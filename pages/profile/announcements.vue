<template>
  <div class="pages-favorites">
    <div class="container"> 
      <breadcrumbs :crumbs="crumbs" />
      <grid 
        v-if="myAnnouncements.data.length"
        :announcements="myAnnouncements.data" 
        :paginate="$paginate(myAnnouncements)"
        :pending="pending"
        :watch-route="true"
        :title="$t('my_announces')"
        :show-title="isMobileBreakpoint"
        @change-page="changePage"
      />
      <no-results :text="$t('add_an_ad_and_thousands_of_potential_buyers_will_see_it')" v-else>
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
  name: 'pages-profile-announcements',
  middleware: 'auth_general',
  components: {
    Grid,
    NoResults
  },
  nuxtI18n: {
    paths: {
      az: '/profil/elanlarim'
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('my_announces')
    });
  },
  async asyncData({ store, route }) {
    let page = route.query.page || 1;

    await Promise.all([
      store.dispatch('getMyAllAnnouncements', { page }),
    ]);

    return { 
      pending: false
    }
  },
  methods: {
    ...mapActions(['getMyAllAnnouncements']),

    async changePage(page = 1) {
      page = this.$route.query.page || 1;
      this.pending = true;
      await this.getMyAllAnnouncements({ page });
      this.pending = false;
      this.scrollTo('.announcements-grid.paginated', [-15, -20]);
    }
  },
  computed: {
    ...mapGetters(['myAnnouncements']),
    
    crumbs() {
      return [
        { name: this.$t('my_announces') }
      ]
    }
  }
}
</script>