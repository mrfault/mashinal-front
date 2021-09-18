<template>
  <div class="pages-moto-index">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <categories class="d-none d-lg-flex" />
      <part-search-form
        :pending="pending"
        @pending="pending = true"
        @submit="searchParts" 
      />
      <banners />
      <grid
        v-if="announcements.length"
        :announcements="announcements"
      />
      <no-results v-else/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Grid from '~/components/announcements/Grid'
import Categories from '~/components/parts/Categories'
import Banners from '~/components/parts/Banners'
import PartSearchForm from '~/components/parts/PartSearchForm'
import NoResults from '~/components/elements/NoResults'

export default {
  name: 'pages-parts-index',
  layout: 'search',
  nuxtI18n: {
    paths: {
      az: '/ehtiyat-hisseleri'
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('meta-title_parts'),
      description: this.$t('meta-descr_parts')
    });
  },
  components: {
    Grid,
    Categories,
    Banners,
    PartSearchForm,
    NoResults
  },
  async asyncData({ store }) {
    await store.dispatch('parts/getHomePageData');
    
    return {
      pending: false,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.getNextAnnouncements)
  },
  methods: {
    async getNextAnnouncements(e) {
      if ((window.scrollY + 500 > document.body.scrollHeight) && !this.pending) {
        this.pending = true;
        await this.$store.dispatch('parts/getNextAnnounements')
        setTimeout(() => {
          this.pending = false;
        }, 1000)
      }
    },
    async searchParts() {
      const data = JSON.parse(this.$route.query.parts_filter || '{}');
      await this.$store.dispatch('parts/search', data);
      this.scrollTo('.announcements-grid', [0, -30]);
    }
  },
  computed: {
    ...mapGetters({
      announcements: 'parts/announcements'
    }),
    crumbs() {
      return [
        { name: this.$t('all_parts') }
      ]
    }
  }
}
</script>