<template>
   <div class="pages-parts-index">
      <div class="container">
         <breadcrumbs :crumbs="crumbs"/>

         <categories class="d-none d-lg-flex"/>

         <part-search-form
            :pending="pending"
            @pending="pending = true"
            @submit="searchParts"
         />
         <!--      <banners v-if="!searchActive" reverse />-->

         <div class="announcements-content">
            <site-banner type="in-part-spare" v-if="isMobileBreakpoint"/>
            <no-results v-if="showNotFound" type="part"/>

            <grid
               v-if="getMainMonetized.length"
               :announcements="getMainMonetized"
               :title="$t('featured_ads')"
               :show-title="true"
               escape-duplicates
            />

            <grid
               v-if="showNotFound ? otherAnnouncements.length : partAnnouncements.total"
               :announcements="showNotFound ? otherAnnouncements : partAnnouncements.data"
               :title="showNotFound ? $t('other_announcements'): $t('announcements')"
               :pending="pending"
               escape-duplicates
            />
         </div>

         <!-- <div class="infinityLoader">
           Loading...
         </div> -->

         <infinite-loading
            :key="refreshInfinity"
            :action-data="JSON.parse(this.$route.query.parts_filter || '{}')"
            action="getInfiniteMainPartsPageSearchWithoutMutate"
            getter="partAnnouncements"
            :per-page="40"
         />

         <HandleIds :type="'parts'" :items="partAnnouncements.data" />
      </div>
   </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import Grid from '~/components/announcements/Grid'
import Categories from '~/components/parts/Categories'
import Banners from '~/components/parts/Banners'
import PartSearchForm from '~/components/parts/PartSearchForm'
import NoResults from '~/components/elements/NoResults'
import SiteBanner from "~/components/banners/SiteBanner";
import HandleIds from "~/components/announcements/HandleIds.vue";

export default {
   name: 'pages-parts-index',
   layout: 'search',
   nuxtI18n: {
      paths: {
         az: '/ehtiyat-hisseleri',
      },
   },
   head() {
      return this.$headMeta({
         title: this.$t('meta-title_parts'),
         description: this.$t('meta-descr_parts'),
      })
   },
   data() {
      return {
         refreshInfinity: 0,
      }
   },
   components: {
      SiteBanner,
      Grid,
      Categories,
      Banners,
      PartSearchForm,
      NoResults,
      HandleIds
   },
   async asyncData({store}) {
      await Promise.all([
         store.dispatch('getInfiniteMainPartsPageSearch'),
      ])

      return {
         pending: false,
      }
   },
   mounted() {
      this.$store.dispatch('fetchInfiniteMainMonetized', { type: 'parts' });
      if (this.$route.query.parts_filter) {
         this.searchParts();
      }
      //window.addEventListener('scroll', this.getNextAnnouncements)
   },

   methods: {
      ...mapActions(['getInfiniteMainSearch']),

      async searchParts() {
         this.refreshInfinity++;
         this.mutate({property: 'temporaryLazyData', value: {}});
         const data = JSON.parse(this.$route.query.parts_filter || '{}')
         this.pending = true
         await this.$store.dispatch('getInfiniteMainPartsPageSearch', {body: data})
         await this.$store.dispatch('fetchInfiniteMainMonetized', { type: 'parts', data: data });
         this.pending = false
         await this.$store.dispatch('parts/setSearchActive', true)
         this.scrollTo('.announcements-content', [0, -30])
      },
   },
   computed: {
      ...mapGetters({
         partAnnouncements: 'partAnnouncements',
         otherAnnouncements: 'parts/otherAnnouncements',
         pagination: 'parts/pagination',
         otherAnnouncementsPagination: 'parts/otherAnnouncementsPagination',
         searchActive: 'parts/searchActive',
         showNotFound: 'parts/showNotFound',
         mainPartsAnnouncements: 'mainPartsAnnouncements',
         getMainMonetized: 'getMainMonetized'
      }),
      crumbs() {
         return [{name: this.$t('all_parts')}]
      },
   },
   beforeDestroy() {
      this.mutate({property: 'temporaryLazyData', value: {}});

      //window.removeEventListener('scroll', this.getNextAnnouncements)
   },
}
</script>
