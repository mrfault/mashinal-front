<template>
   <div class="pages-commercial">
      <div class="container">
         <breadcrumbs :crumbs="crumbs"/>

         <commercial-search-form
            :total-count="$paginate(commercialAnnouncements).total"
            :pending="pending"
            :category="category"
            @pending="pending = true"
            @submit="searchCommercial"
         />

         <grid
            v-if="getMainMonetized.length"
            :announcements="getMainMonetized"

            :show-title="true"
            escape-duplicates
         />
<!--         :title="$t('featured_ads')"-->

         <grid
            v-if="commercialAnnouncements.data.length"
            :announcements="commercialAnnouncements.data"
            :paginate="$paginate(commercialAnnouncements)"

            :pending="pending"
            @change-page="searchCommercial"
            escape-duplicates
         />
<!--         :title="$t('announcements')"-->

         <no-results v-else/>
      </div>
   </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

import CommercialSearchForm from '~/components/commercial/CommercialSearchForm';
import Grid from '~/components/announcements/Grid';
import NoResults from '~/components/elements/NoResults';

export default {
   name: 'pages-commercial-slug',
   layout: 'search',
   components: {
      CommercialSearchForm,
      Grid,
      NoResults
   },
   nuxtI18n: {
      paths: {
         az: '/ticari-avtomobiller/:commercial'
      }
   },
   head() {
      return this.$headMeta({
         title: this.$t('meta-title_commercial', {type: this.$t('meta-words_commercial-types')[0]}),
         description: this.$t('meta-descr_commercial', {type: this.$t('meta-words_commercial-types')[0]})
      });
   },
   async asyncData({store, route, app, error}) {
      const slug = ({
         'trucks': 'trucks',
         'buses': 'buses',
         'trailers': 'trailers',
         'special': 'special',
         'yuk': 'trucks',
         'avtobuslar': 'buses',
         'qosqulu': 'trailers',
         'xususi': 'special'
      })[route.params.commercial];

      const category = {
         id: store.getters.commercialTypes.find(type => type.param === slug)?.id,
         type: slug
      };

      if (!category.type) return error({statusCode: 404});

      await store.dispatch('i18n/setRouteParams', {
         az: {commercial: app.i18n.t('slug_' + slug, 'az')},
         ru: {commercial: app.i18n.t('slug_' + slug, 'ru')}
      });

      let post = {...JSON.parse(route.query.filter || '{}'), com_type: category.id};
      let page = route.query.page || 1;
      let searchParams = {url: '/grid/commercial', prefix: 'commercial'}

      await Promise.all([
         store.dispatch('getOptions'),
         store.dispatch('getColors'),
         store.dispatch('getCommercialSearchFilters', category.id),
         store.dispatch('getCommercialBrands', {category: category.id}),
         store.dispatch('getGridSearch', {...searchParams, post, page}),
         // get model options for brands
         ...Object.keys(post?.additional_brands || {})
            .filter(key => post?.additional_brands?.[key]?.brand)
            .map((key) => {
               let row = post.additional_brands[key];
               return store.dispatch('getCommercialModels', {category: category.id, id: row.brand, index: key})
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

      async searchCommercial(page = 1) {
         page = this.$route.query.page || 1;
         let post = {...JSON.parse(this.$route.query.filter || '{}'), com_type: this.category.id};
         this.pending = true;
         await this.getGridSearch({...this.searchParams, post, page});
         await this.$store.dispatch('fetchInfiniteMainMonetized', { type: 'commercial', data: post });
         this.pending = false;
         if (page === 1) {
            this.scrollTo('.announcements-sorting');
         } else {
            this.scrollTo('.announcements-grid.paginated', [-15, -20]);
         }
      }
   },
   computed: {
      ...mapGetters(['commercialAnnouncements', 'getMainMonetized']),

      crumbs() {
         return [
            {name: this.$t('commercial'), route: '/commercial'},
            {name: this.$t('commercial_' + this.category.type)}
         ]
      }
   },

   mounted() {
      this.$store.dispatch('fetchInfiniteMainMonetized', { type: 'commercial' });
   },

   beforeRouteLeave(to, from, next) {
      this.$nuxt.$emit('prevent-popstate');
      next();
   }
}
</script>
