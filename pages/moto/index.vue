<template>
   <div class="pages-moto-index">
      <div class="container">
         <breadcrumbs :crumbs="crumbs"/>

         <moto-search-form
            :total-count="$paginate(motoAnnouncements).total"
            :pending="pending"
            :category="{}"
            @pending="pending = true"
            @submit="searchMoto"
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

         <HandleIds :type="'motorcycles'" :items="motoAnnouncements.data" />
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
   name: 'pages-moto-index',
   layout: 'search',
   components: {
      MotoSearchForm,
      Grid,
      NoResults,
      HandleIds
   },
   nuxtI18n: {
      paths: {
         az: '/moto'
      }
   },
   head() {
      return this.$headMeta({
         title: this.$t('meta-title_moto', {type: this.$t('meta-words_moto-types')[0]}),
         description: this.$t('meta-descr_moto', {type: this.$t('meta-words_moto-types')[0]})
      });
   },
   async asyncData({store, route}) {
      let post = {...JSON.parse(route.query.filter || '{}')};
      let page = route.query.page || 1;
      let searchParams = {url: '/moto_home_page', prefix: 'moto'}

      await Promise.all([
         store.dispatch('getOptions'),
         store.dispatch('getMotoOptions'),
         store.dispatch('getColors'),
         store.dispatch('getGridSearch', {...searchParams, post, page}),
         // get model options for brands
         ...Object.keys(post?.additional_brands || {})
            .filter(key => post?.additional_brands?.[key]?.brand)
            .map((key) => {
               let row = post.additional_brands[key];
               return store.dispatch('getMotoModels', {category: row.category, id: row.brand, index: key})
            })
      ]);

      return {
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
         await this.getGridSearch({...this.searchParams, post, page});
         this.pending = false;
         this.scrollTo('.announcements-grid.paginated', [-15, -20]);
      }
   },
   computed: {
      ...mapGetters(['motoAnnouncements']),

      crumbs() {
         return [
            {name: this.$t('moto')}
         ]
      }
   },

   beforeRouteLeave(to, from, next) {
      this.$nuxt.$emit('prevent-popstate');
      next();
   }
}
</script>
