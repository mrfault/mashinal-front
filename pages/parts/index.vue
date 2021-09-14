<template>
  <div class="pages-moto-index">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <Categories class="d-none d-lg-flex" />
      <PartSearchForm
        :pending="pending"
        @pending="pending = true"
        @submit="searchParts" 
      />
      <Banners />
      <Grid
        v-if="announcements"
        :announcements="announcements"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Grid from '~/components/announcements/Grid.vue'
import Categories from '~/components/parts/Categories.vue'
import Banners from '~/components/parts/Banners.vue'
import PartSearchForm from '~/components/parts/PartSearchForm.vue'

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
      // TODO fix translates
      title: this.$t('meta-title_parts'),
      description: this.$t('meta-descr_parts')
    });
  },
  components: {
    Grid,
    Categories,
    Banners,
    PartSearchForm
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
    searchParts() {
      const data = JSON.parse(this.$route.query.parts_filter || '{}');
      this.$store.dispatch('parts/search', data)
    }
  },
  computed: {
    ...mapGetters({
      announcements: 'parts/announcements'
    }),
    crumbs() {
      return [
        { name: this.$t('parts') }
      ]
    }
  }
}
</script>