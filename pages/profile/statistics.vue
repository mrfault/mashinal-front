<template>
  <div class="pages-profile-statistics pt-2 pt-lg-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="card mb-2 mb-lg-3" v-if="isMobileBreakpoint">
        <h2 class="title-with-line mb-n1 mt-n1">
          <span>{{ $t('statistics') }}</span>
        </h2>
      </div>
      <div class="row">
        <div class="col-lg-6 mb-2 mb-lg-0">
          <div class="card full-height">
            <div class="statistics-announcements larger full-height">
              <div class="circle-bar" v-for="(stat, i) in circleStats" :key="i">
                <div class="circle-bar_filled" :style="{borderColor: stat.color, color: stat.color}">
                  <strong>{{ stat.value }}</strong>
                </div>
                <div class="circle-bar_info">
                  <span>{{ $t(stat.label) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="card full-height">
            <div class="statistics-packages">
              <div class="packages-progress-bar" v-for="(stat, index) in packageStats" :key="index">
                <div class="packages-progress-bar_placeholder">
                  <div class="packages-progress-bar_filled"
                    :style="{backgroundColor: stat.color, height:(100 * (stat.have / stat.total))+'%'}">
                    <icon :name="stat.icon" />
                  </div>
                  <div class="packages-progress-bar_empty">
                    <icon :name="stat.icon" :style="{color: stat.color}" />
                  </div>
                </div>
                <div class="packages-progress-bar_info">
                  <strong :style="{color: stat.color}">{{ stat.have }}</strong>
                  <span>{{ stat.label }}</span>                
                </div>
              </div>
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
    name: 'pages-profile-statistics',
    middleware: 'auth_salon',
    mixins: [StatsMixin],
    components: {
      Grid
    },
    nuxtI18n: {
      paths: {
        az: '/profil/statistika'
      }
    },
    head() {
      return this.$headMeta({
        title: this.$t('statistics')
      });
    },
    async asyncData({store}) {
      await Promise.all([
        store.dispatch('getAnnouncementStats'),
        store.dispatch('getPackageStats')
      ]); 
    },
    computed: {
      ...mapGetters([]),

      crumbs() {
        return [
          { name: this.$t('dashboard'), route: '/profile/dashboard' },
          { name: this.$t('statistics') }
        ]
      }
    },
    methods: {
      ...mapActions([]),
     
    }
  }
</script>