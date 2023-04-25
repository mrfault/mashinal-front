<template>
   <div class="pages-commercial-index">
      <div class="container">
         <breadcrumbs :crumbs="crumbs" />

         <commercial-search-form
            :total-count="$paginate(commercialAnnouncements).total"
            :pending="pending"
            :category="{}"
            @pending="pending = true"
            @submit="searchCommercial"
         />

         <grid
            v-if="getMainMonetized.length"
            :announcements="getMainMonetized"
            :title="$t('featured_ads')"
            :show-title="true"
            escape-duplicates
         />

         <grid
            v-if="commercialAnnouncements.data.length"
            :announcements="commercialAnnouncements.data"
            :paginate="$paginate(commercialAnnouncements)"
            :title="$t('announcements')"
            :pending="pending"
            @change-page="searchCommercial"
            escape-duplicates
         />

         <no-results v-else/>

         <HandleIds :type="'commercials'" :items="commercialAnnouncements.data" />
      </div>
   </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import CommercialSearchForm from '~/components/commercial/CommercialSearchForm';
import Grid from '~/components/announcements/Grid';
import NoResults from '~/components/elements/NoResults';
import HandleIds from "~/components/announcements/HandleIds.vue";

export default {
   name: 'pages-commercial-index',
   layout: 'search',
   components: {
      CommercialSearchForm,
      Grid,
      NoResults,
      HandleIds
   },
   nuxtI18n: {
      paths: {
         az: '/ticari-avtomobiller'
      }
   },
   head() {
      return this.$headMeta({
         title: this.$t('meta-title_commercial', {type: this.$t('meta-words_commercial-types')[0]}),
         description: this.$t('meta-descr_commercial', {type: this.$t('meta-words_commercial-types')[0]})
      });
   },
   async asyncData({store, route}) {
      let post = {...JSON.parse(route.query.filter || '{}')};
      let page = route.query.page || 1;
      let searchParams = {url: '/grid/commercial', prefix: 'commercial'}

      await Promise.all([
         store.dispatch('getGridSearch', {...searchParams, post, page, type: 'commercials'}),
         // get brand options for category
         ...Object.keys(post?.additional_brands || {})
            .filter(key => post?.additional_brands?.[key]?.category)
            .map((key) => {
               let row = post.additional_brands[key];
               return store.dispatch('getCommercialBrands', {category: row.category, index: key})
            }),
         // get model options for brands
         ...Object.keys(post?.additional_brands || {})
            .filter(key => post?.additional_brands?.[key]?.brand)
            .map((key) => {
               let row = post.additional_brands[key];
               return store.dispatch('getCommercialModels', {category: row.category, id: row.brand, index: key})
            }),
      ]);

      return {
         searchParams,
         pending: false
      }
   },
   methods: {
      ...mapActions(['getGridSearch']),

      async searchCommercial(page = 1) {
         page = this.$route.query.page || 1;
         let post = JSON.parse(this.$route.query.filter || '{}');
         this.pending = true;
         await this.getGridSearch({...this.searchParams, post, page, type: 'commercials'});
         await this.$store.dispatch('fetchInfiniteMainMonetized', { type: 'commercial', data: post });
         this.pending = false;
         this.scrollTo('.announcements-grid.paginated', [-15, -20]);
      }
   },
   computed: {
      ...mapGetters(['commercialAnnouncements', 'getMainMonetized']),

      crumbs() {
         return [
            {name: this.$t('commercial')}
         ]
      }
   },

   mounted() {
      if (!Object.keys(this.$route.query).length) {
         this.$store.dispatch('fetchInfiniteMainMonetized', { type: 'commercial' });
      }
   },

   beforeRouteLeave(to, from, next) {
      this.$nuxt.$emit('prevent-popstate');
      next();
   }
}
</script>
