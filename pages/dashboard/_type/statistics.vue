<template>
  <div class="pages-dashboard-statistics pt-2 pt-lg-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="card mb-2 mb-lg-3" v-if="isMobileBreakpoint">
        <h2 class="title-with-line mb-n1 mt-n1">
          <span>{{ $t('statistics') }}</span>
        </h2>
      </div>
      <div class="card full-height mb-2 mb-lg-0">
        <div class="statistics-announcements larger full-height">
          <div class="circle-bar" v-for="(stat, i) in countStats" :key="i">
            <div class="circle-bar_filled" :style="{borderColor: stat.color, color: stat.color}">
              <strong>{{ stat.value }}</strong>
            </div>
            <div class="circle-bar_info">
              <span>{{ $t(stat.label) }}</span>
            </div>
          </div>
        </div>
      </div>
      <grid 
        v-if="mostViewed.length"
        :announcements="mostViewed" 
        :title="$t('most_viewed_announcements')"
      />
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  import { StatsMixin } from '~/mixins/statistics';

  import Grid from '~/components/announcements/Grid';

  export default {
    name: 'pages-dashboard-statistics',
    middleware: 'auth_salon',
    mixins: [StatsMixin],
    components: {
      Grid
    },
    nuxtI18n: {
      paths: {
        az: '/idareetme-paneli/:id/statistika'
      }
    },
    head() {
      return this.$headMeta({
        title: this.$t('statistics')
      });
    },
    async asyncData({store, route, app}) {
      await Promise.all([
        store.dispatch('getAnnouncementStats', app.$getDashboardId(route.params.type)),
        store.dispatch('getPackageStats', app.$getDashboardId(route.params.type))
      ]); 
    },
    computed: {
      ...mapGetters([]),

      crumbs() {
        return [
          { name: this.$t('dashboard'), route: '/dashboard/' + this.$route.params.type },
          { name: this.$t('statistics') }
        ]
      }
    },
    methods: {
      ...mapActions([]),
     
    }
  }
</script>