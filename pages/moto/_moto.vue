<template>
   <div class="pages-moto">
      <div class="container">
         <breadcrumbs :crumbs="crumbs"/>

         <moto-search-form
            :total-count="$paginate(motoAnnouncements).total"
            :pending="pending"
            :category="category"
            @pending="pending = true"
            @submit="searchMoto"
         />

         <grid
            v-if="getMainMonetized.length"
            :announcements="getMainMonetized"
            :title="$t('featured_ads')"
            :show-title="true"
            escape-duplicates
         />

         <grid
            v-if="motoAnnouncements.data.length"
            :announcements="motoAnnouncements.data"
            :paginate="$paginate(motoAnnouncements)"
            :title="$t('announcements')"
            :pending="pending"
            @change-page="searchMoto"
            escape-duplicates
         />

         <no-results v-else/>

         <HandleIds :type="category?.type" :items="motoAnnouncements.data" />
      </div>
   </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

import MotoSearchForm from '~/components/moto/MotoSearchForm';
import Grid from '~/components/announcements/Grid';
import NoResults from '~/components/elements/NoResults';
import HandleIds from "~/components/announcements/HandleIds.vue";

export default {
   name: 'pages-moto-slug',
   layout: 'search',
   components: {
      MotoSearchForm,
      Grid,
      NoResults,
      HandleIds
   },
   nuxtI18n: {
      paths: {
         az: '/moto/:moto'
      }
   },
   head() {
      return this.$headMeta({
         title: this.$t('meta-title_moto', {type: this.$t('meta-words_moto-types')[this.category.id - 1]}),
         description: this.$t('meta-descr_moto', {type: this.$t('meta-words_moto-types')[this.category.id - 1]})
      });
   },
   async asyncData({store, route, app, error}) {
      const slug = ({
         'motorcycles': 'motorcycles',
         'motosikletler': 'motorcycles',
         'scooters': 'scooters',
         'skuterler': 'scooters',
         'atvs': 'atvs',
         'atvler': 'atvs'
      })[route.params.moto];

      if (!slug) return error({statusCode: 404});

      const category = ({
         'motorcycles': {id: 1, type: 'motorcycles', url: '/grid/moto'},
         'scooters': {id: 2, type: 'scooters', url: '/grid/scooter'},
         'atvs': {id: 3, type: 'atvs', url: '/grid/atv'}
      })[slug];

      await store.dispatch('i18n/setRouteParams', {
         az: {moto: app.i18n.t('slug_' + slug, 'az')},
         ru: {moto: app.i18n.t('slug_' + slug, 'ru')}
      });

      let post = JSON.parse(route.query.filter || '{}');
      let page = route.query.page || 1;
      let searchParams = {url: category.url, prefix: 'moto'}

      await Promise.all([
         store.dispatch('getOptions'),
         store.dispatch('getMotoOptions'),
         store.dispatch('getColors'),
         store.dispatch('getGridSearch', {...searchParams, post, page, type: category.type}),
         // get model options for brands
         ...Object.keys(post?.additional_brands || {})
            .filter(key => post?.additional_brands?.[key]?.brand)
            .map((key) => {
               let row = post.additional_brands[key];
               return store.dispatch('getMotoModels', {category: category.id, id: row.brand, index: key})
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
         await this.getGridSearch({...this.searchParams, post, page, type: this.category.type});
         await this.$store.dispatch('fetchInfiniteMainMonetized', { type: 'moto', data: post });
         this.pending = false;
         if (page === 1) {
            this.scrollTo('.announcements-sorting');
         } else {
            this.scrollTo('.announcements-grid.paginated', [-15, -20]);
         }
      }
   },
   computed: {
      ...mapGetters(['motoAnnouncements', 'getMainMonetized']),

      crumbs() {
         return [
            {name: this.$t('moto'), route: '/moto'},
            {name: this.$t(this.category.type)}
         ]
      }
   },
   mounted() {
      this.$store.dispatch('fetchInfiniteMainMonetized', { type: 'moto' });
   },
   beforeRouteLeave(to, from, next) {
      this.$nuxt.$emit('prevent-popstate');
      next();
   }
}
</script>
