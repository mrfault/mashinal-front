<template>
  <div class="pages-moto">
    <div class="container"> 
      <breadcrumbs :crumbs="crumbs" />
      <moto-search-form 
        :total-count="motoAnnouncements.paginate.total"
        :pending="pending"
        :category="category"
        @pending="pending = true"
        @submit="searchMoto"
      />
      <grid 
        v-if="motoAnnouncements.standard.length"
        :announcements="motoAnnouncements.standard" 
        :paginate="motoAnnouncements.paginate"
        :title="$t('recent_uploads')"
        :pending="pending"
        @change-page="searchMoto"
      />
      <no-results v-else />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import MotoSearchForm from '~/components/moto/MotoSearchForm';
import Grid from '~/components/announcements/Grid';
import NoResults from '~/components/elements/NoResults';

export default {
  name: 'pages-moto-slug',
  components: {
    MotoSearchForm,
    Grid,
    NoResults
  },
  nuxtI18n: {
    paths: {
      az: '/moto/:moto'
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('meta-title_moto', { type: this.$t('meta-words_moto-types')[this.category.id - 1] }),
      descr: this.$t('meta-descr_moto', { type: this.$t('meta-words_moto-types')[this.category.id - 1] })
    });
  },
  async asyncData({ store, route, app, error }) {
    const slug = ({
      'motorcycles': 'motorcycles',
      'motosikletler': 'motorcycles',
      'scooters': 'scooters',
      'skuterler': 'scooters',
      'atvs': 'atvs',
      'atvler': 'atvs'
    })[route.params.moto];
    
    if(!slug) return error({ statusCode: 404 });

    const category = ({
      'motorcycles': { id: 1, type: 'motorcycles', url: '/grid/moto', modelsAction: 'getMotorcycleModels' },
      'scooters': { id: 2, type: 'scooters', url: '/grid/scooter', modelsAction: 'getScooterModels' },
      'atvs': { id: 3, type: 'atvs', url: '/grid/atv', modelsAction: 'getAtvModels' }
    })[slug];

    await store.dispatch('i18n/setRouteParams', { 
      az: { moto: app.i18n.t('slug_'+slug, 'az') }, 
      ru: { moto: app.i18n.t('slug_'+slug, 'ru') } 
    });

    let post = JSON.parse(route.query.filter || '{}');
    let page = route.query.page || 1;
    let searchParams = { url: category.url, prefix: 'moto' }

    await Promise.all([
      store.dispatch('getOptions'),
      store.dispatch('getColors'),
      store.dispatch('getMotoOptions'),
      store.dispatch('getGridSearch', { ...searchParams, post, page }),
      // get model options for brands
      ...Object.keys(post?.additional_brands || {})
        .filter(key => post?.additional_brands?.[key]?.brand)
        .map((key) => {
          let row = post.additional_brands[key];
          return store.dispatch(category.modelsAction, { id: row.brand, index: key })
        }),
    ]);

    return { 
      category,
      searchParams,
      pending: false
    }
  },
  methods: {
    ...mapActions(['getGridSearch']),

    async searchMoto(page = 1) {
      page = this.$route.query.page || 1;
      let post = JSON.parse(this.$route.query.filter || '{}');
      this.pending = true;
      await this.getGridSearch({ ...this.searchParams, post, page });
      this.pending = false;
      if(page === 1) {
        this.scrollTo('.announcements-sorting');
      } else {
        this.scrollTo('.announcements-grid.paginated', [-15, -20]);
      }
    }
  },
  computed: {
    ...mapGetters(['motoAnnouncements']),
    
    crumbs() {
      return [
        { name: this.$t('moto'), route: '/moto' },
        { name: this.$t(this.category.type) }
      ]
    }
  }
}
</script>