<template>
  <div class="pages-moto-category">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <Categories class="d-none d-lg-flex" />
      <PartSearchForm
        :filters="filters"
        :category="category"
        :pending="pending"
        @pending="pending = true"
        @submit="searchParts" 
      />
      <Grid
        v-if="announcements"
        :announcements="announcements"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { RoutesMixin } from '~/mixins/routes'

import Grid from '~/components/announcements/Grid.vue'
import Categories from '~/components/parts/Categories.vue'
import Banners from '~/components/parts/Banners.vue'
import PartSearchForm from '~/components/parts/PartSearchForm.vue'

export default {
  name: 'pages-parts-categories',
  layout: 'search',
  mixins: [RoutesMixin],
  nuxtI18n: {
    paths: {
      az: '/ehtiyat-hisseleri/:category'
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('meta-title_parts_category', {
        category: this.$t('meta-words_part-categories')[0]
      }),
      description: ''
    })
  },
  components: {
    Grid,
    Categories,
    Banners,
    PartSearchForm
  },
  async asyncData({ $axios, store, app, route }) {
    const categories = await $axios.$get('/part/categories');
    console.log(categories, route.params.category)
    const category = categories.find(item => item.slug[app.i18n.locale] === route.params.category && item.id !== 18);
    const filters = await $axios.$get(`/part/category/${category.id}/filters`)

    await store.dispatch('parts/getCategoryAnnouncements', {
      category_id: category.id,
      sub_category_id: route.query.id || 0
    });

    return {
      category,
      filters
    }
  },
  data() {
    return {
      pending: false
    }
  },
  methods: {
    searchParts() {
      const data = JSON.parse(this.$route.query.parts_filter || '{}');
      data.category_id = this.category.id
      this.$store.dispatch('parts/search', data)
    }
  },
  computed: {
    ...mapGetters({
      announcements: 'parts/announcements',
    }),
    crumbs() {
      return [
        { name: this.$t('parts'), route: '/parts' },
        { name: this.partsRoutes.find(route => route.slug === this.$route.params.category).localeTitle }
      ]
    }
  }
}
</script>