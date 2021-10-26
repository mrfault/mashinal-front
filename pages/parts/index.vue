<template>
  <div class="pages-parts-index">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <categories class="d-none d-lg-flex" />
      <part-search-form
        :pending="pending"
        @pending="pending = true"
        @submit="searchParts" 
      />
      <banners v-if="!searchActive" reverse />
      <div class="announcements-content">
        <grid
          v-if="announcements.length && !showNotFound"
          :announcements="announcements"
          :pending="pending"
          escape-duplicates
        />

        <no-results v-if="showNotFound" type="part"/>

        <grid
          v-if="showNotFound"
          :title="$t('other_announcements')"
          :announcements="otherAnnouncements"
          :pending="pending"
          escape-duplicates
        />
      </div>
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
    await store.dispatch('parts/getAnnouncements')

    return {
      pending: false
    }
  },
  mounted() {
    if (this.$route.query.parts_filter) {
      this.searchParts()
    }
    window.addEventListener('scroll', this.getNextAnnouncements)
  },
  methods: {
    async getNextAnnouncements() {
      if ((window.scrollY + 800 > document.body.scrollHeight) && !this.pending) {
        this.pending = true;

        if (!this.showNotFound) {
          const { current_page, last_page } = this.pagination
          if (current_page < last_page) {
            await this.$store.dispatch('parts/getAnnouncements', {
              body: JSON.parse(this.$route.query.parts_filter || '{}'),
              params: {
                page: (current_page || 0) + 1
              }
            })
          }
        } else {
          const { current_page, last_page } = this.otherAnnouncementsPagination
          if (current_page ? current_page < last_page : true) {
            await this.$store.dispatch('parts/getOtherAnnouncements', {
              body: {},
              params: {
                page: (current_page || 0) + 1
              }
            })
          }
        }
        this.pending = false;
      }
    },
    async searchParts() {
      const data = JSON.parse(this.$route.query.parts_filter || '{}');
      this.pending = true;
      await this.$store.dispatch('parts/getAnnouncements', { body: data });
      this.pending = false;
      await this.$store.dispatch('parts/setSearchActive', true)
      this.scrollTo('.announcements-content', [0, -30]);
    }
  },
  computed: {
    ...mapGetters({
      announcements: 'parts/announcements',
      otherAnnouncements: 'parts/otherAnnouncements',
      pagination: 'parts/pagination',
      otherAnnouncementsPagination: 'parts/otherAnnouncementsPagination',
      searchActive: 'parts/searchActive',
      showNotFound: 'parts/showNotFound',
    }),
    crumbs() {
      return [
        { name: this.$t('all_parts') }
      ]
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.getNextAnnouncements)
  }
}
</script>