<template>
  <div class="pages-catalog">
    <div class="container">
      <breadcrumbs :crumbs="crumbs">
        <share-it type="publish" v-if="$route.params.body" />
      </breadcrumbs>
      <template v-if="!$route.params.body">
        <catalog-search-form
          :total-count="catalogTotal"
          :pending="pending"
          @pending="pending = true"
          @submit="searchCatalog"
        />

        <catalog-grid
          v-if="catalogTotal"
          :items="catalogItems"
          :paginate="catalogItems.data && $paginate(catalogItems)"
          :title="$t('autocatalog')"
          :pending="pending"
          @change-page="searchCatalog"
        />
        <no-results v-else />
      </template>
      <template v-else>
        <catalog-inner
          :selected-brand="selectedBrand"
          :selected-model="selectedModel"
          :selected-car="selectedGenerationType"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import CatalogSearchForm from '~/components/catalog/CatalogSearchForm';
import CatalogGrid from '~/components/catalog/CatalogGrid';
import CatalogInner from '~/components/catalog/CatalogInner';
import NoResults from '~/components/elements/NoResults';

export default {
  name: 'pages-catalog',
  scrollToTop: true,
  components: {
    CatalogSearchForm,
    CatalogGrid,
    CatalogInner,
    NoResults
  },
  nuxtI18n: {
    paths: {
      az: '/kataloq'
    }
  },
  head() {
    let params = {...this.$route.params};
    let paramsLength = Object.keys(params).length;
    let titleParts = '', descrParts = '';
    ['Brand', 'Model', 'Generation', 'Body'].map((part, index) => {
      let titleText = this[`selected${part}Text`];
      if (titleText) {
        let delim = ['Generation', 'Body'].includes(part) ? ', ' : ' ';
        if (index === 0) delim = '';
        titleParts += delim + titleText;
        if (index < 2) descrParts += delim + titleText;
      }
    });

    let title = this.$t(`meta-title_catalog${paramsLength ? '-car' : ''}`, { car: titleParts, word: this.$t('meta-words_catalog-car')[paramsLength - 1] });
    let description = this.$t(`meta-descr_catalog${paramsLength ? '-car' : ''}`, { car: descrParts });
    let image;
    if (params.body && this.firstGeneration) {
      image = this.firstGeneration.generation.car_type_generation
        .find(item => this.firstGeneration.car_type_id === item.car_type_id).transformed_media?.main?.[0];
    } else if (params.model && this.catalogItems?.[0]) {
      let item = this.catalogItems?.[0];
      image = (item?.car_type_generation?.find(type => type.car_type_id === item.fav_car_type_id) || item?.car_type_generation[0])?.transformed_media?.main?.[0];
    } else if (params.brand) {
      image = this.catalogItems?.data?.[0]?.transformed_media;
    }
    return this.$headMeta({ title, description, image });
  },
  async asyncData({ store, route }) {
    if (process.client) {
      let { page, filter } = route.query;
      let post = JSON.parse(filter || '{}');
      console.log('test');
      await Promise.all([
        store.dispatch('getBrands'),
        store.dispatch('getBodyOptions'),
        route.params.brand && store.dispatch('getModels', route.params.brand),
        route.params.model && store.dispatch('getGenerations', route.params),
        // route.params.generation && store.dispatch('getGenerationTypes', route.params),
        route.params.body && store.dispatch('getBodyModification', route.params),
        route.params.body && store.dispatch('getModificationsList', route.params),
      /*  store.dispatch('getCatalogSearch', { post, page, params: Object.keys(post).length ? { temp: 1, ...route.params} : {...route.params}, totalCount: !!route.params.brand }),
        !route.params.brand ? store.dispatch('getCatalogSearch', { post, page, params: { temp: 1, ...route.params}, totalCount: true }) : []*/
      ]);
    }
    return {
      pending: false
    }
  },
  methods: {
    ...mapActions(['getCatalogSearch']),

    async searchCatalog(page = 1, scroll = true) {
      page = this.$route.query.page || 1;
      let post = JSON.parse(this.$route.query.filter || '{}');
      let showDefaultItems = false; /* !Object.keys(post).length && !this.$route.params.brand; */
      this.pending = true;
      await this.getCatalogSearch({ params: showDefaultItems ? {...this.$route.params} : { temp: 1, ...this.$route.params}, post, page });
      this.pending = false;
      if (scroll) this.scrollTo('.catalog-grid', [-15, -20]);
    }
  },
  mounted() {
    this.$store.commit('mutate',{
      property:'announcement',
      value: {}
    });
  },
  computed: {
    ...mapGetters(['catalogItems', 'catalogTotal', 'firstGeneration', 'modelDescription', 'brands', 'models']),

    crumbs() {
      let params = Object.keys(this.$route.params).map(key => this.$route.params[key]);
      return [
        { name: this.$t('autocatalog'), route: params.length ? '/catalog' : '' }
      ].concat(
        ['Brand', 'Model', 'Generation', 'Body']
          .filter(part => this[`selected${part}Text`])
          .map((part, i) => ({
            name: this[`selected${part}Text`],
            route: (i === params.length - 1 || part === 'Body') ? '' : `/catalog/${params.slice(0, i + 1).join('/')}`
          }))
      );
    },

    selectedBrand() {
      let brand = this.brands.find(brand => brand.slug === this.$route.params.brand);
      return brand;
    },
    selectedBrandText() {
      if (!this.$route.params.brand) return false;
      return this.selectedBrand?.name;
    },
    selectedModel() {
      let model = this.models.find(model => model.slug === this.$route.params.model);
      return { ...model, description: this.modelDescription };
    },
    selectedModelText() {
      if (!this.$route.params.model) return false;
      return this.$translateHard(this.selectedModel?.name);
    },
    selectedGenerationType() {
      if (!this.$route.params.generation) return false;
      let generation = this.firstGeneration?.generation;
      return generation?.car_type_generation?.find(g => g.car_type_id == this.firstGeneration?.car_type_id);
    },
    selectedGenerationText() {
      if (!this.$route.params.generation) return false;
      let generation = this.firstGeneration?.generation;
      return this.$translateHard(generation?.short_name) + ' ' + generation?.start_year+ ' – '+ (generation?.end_year || this.currentYear);
    },
    selectedBodyText() {
      if (!this.$route.params.body) return false;
      let name = this.firstGeneration?.car_type?.name?.[this.locale];
      if (!name) return false;
      if (this.selectedModificationText) name += ` (${this.selectedModificationText})`;
      return name;
    },
    selectedModificationText() {
      if (!this.$route.params.body) return false;
      let complectation = this.firstGeneration?.complect_type;
      let modification = this.firstGeneration?.main[' ']['obem'] + ' ' + this.$t(this.$t('box_mode_values')[this.firstGeneration?.main[' ']['box']]);
      return (complectation && complectation !== '–') ? (complectation + ' ' + modification) : (modification);
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$nuxt.$emit('prevent-popstate');
    next();
  }
}
</script>
