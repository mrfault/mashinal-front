<template>
  <div class="pages-annoucements pt-2 pt-lg-5">
    <div class="container"> 
      <breadcrumbs :crumbs="crumbs" />
      <controls-panel 
        :status="form.status"
        :show-toolbar="!!myAnnouncements.data.length"
      />
      <div class="row flex-row-reverse" v-if="!(statusReady === '' && !myAnnouncements.data.length)">
        <div class="col-lg-auto col-lg-1-5 mb-lg-n1">
          <form-select :label="$t('status')" :options="getStatusOptions" v-model="form.status"
            @change="changePage(1)" :clear-option="false" has-no-bg />
        </div>
      </div>
      <grid 
        v-if="myAnnouncements.data.length"
        :announcements="myAnnouncements.data" 
        :paginate="$paginate(myAnnouncements)"
        :pending="pending"
        :push-into-router="false"
        :title="$t('my_announces')"
        :show-title="false"
        :show-checkbox="true"
        @change-page="changePage"
      />
      <no-results :text="statusReady !== '' ? '' : $t('add_an_ad_and_thousands_of_potential_buyers_will_see_it')" v-else>
        <nuxt-link v-if="statusReady === ''" :to="$localePath('/sell')" class="btn btn--green mt-2 mt-lg-3" v-html="$t('to_sell')" />
      </no-results>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import Grid from '~/components/announcements/Grid';
import NoResults from '~/components/elements/NoResults';
import ControlsPanel from '~/components/announcements/ControlsPanel';

export default {
  name: 'pages-profile-announcements',
  middleware: 'auth_general',
  components: {
    Grid,
    NoResults,
    ControlsPanel
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
  async asyncData({ store }) {
    await Promise.all([
      store.dispatch('getMyAllAnnouncements'),
    ]);

    return { 
      pending: false,
      statusReady: '',
      form: {
        status: ''
      }
    }
  },
  methods: {
    ...mapActions(['getMyAllAnnouncements']),

    async changePage(page = 1) {
      this.pending = true;
      await this.getMyAllAnnouncements({ page, ...this.form });
      this.statusReady = this.form.status;
      this.pending = false;
      this.scrollTo('.announcements-grid.paginated', [-15, -20]);
    },
    isValid(status) {
      return [0,1,2,3].includes(status);
    }
  },
  computed: {
    ...mapGetters(['myAnnouncements']),
    
    crumbs() {
      return [
        { name: this.$t('my_announces') }
      ]
    },

    getStatusOptions() {
      return [
        { key: 1, name: this.$t('active') },
        { key: 2, name: this.$t('under_consideration') },
        { key: 0, name: this.$t('rejected_many') },
        { key: 3, name: this.$t('inactive') }
      ]
    }
  }
}
</script>