<template>
   <div class="pages-parts-index">
      <div class="container">
         <Banner
            class="mb-5"
            :bg="'/img/part_bg.png'"
            :title="$t('parts')"
         >
            <template #content>
               <breadcrumbs :crumbs="crumbs"/>
            </template>
         </Banner>

         <part-search-form
            :pending="pending"
            @pending="pending = true"
            @submit="searchParts"
         />

         <grid
            v-if="partsMonetized?.length"
            :announcements="partsMonetized"
            :pending="pending"
            :has-container="false"
            @change-page="changePage"
         >
            <template #cap>
               <Cap :className="'mb40'">
                  <template #left>
                     <h3>{{ $t('featured_ads') }}</h3>
                  </template>

                  <!--            <template #right>-->
                  <!--               <form-select-->
                  <!--                  :label="$t('sorting_2')"-->
                  <!--                  :options="sortItems"-->
                  <!--                  :clearPlaceholder="true"-->
                  <!--                  :clear-option="false"-->
                  <!--                  :allowClear="false"-->
                  <!--                  v-model="sorting"-->
                  <!--               />-->
                  <!--            </template>-->
               </Cap>
            </template>
         </grid>

         <grid
            v-if="parts?.data?.length"
            :announcements="parts?.data"
            :pending="pending"
            :paginate="parts?.meta"
            :has-container="false"
            @change-page="changePage"
         >
            <template #cap>
               <Cap :className="'mb40'">
                  <template #left>
                     <h3>{{ $t('announcements') }}</h3>
                  </template>

                  <!--            <template #right>-->
                  <!--               <form-select-->
                  <!--                  :label="$t('sorting_2')"-->
                  <!--                  :options="sortItems"-->
                  <!--                  :clearPlaceholder="true"-->
                  <!--                  :clear-option="false"-->
                  <!--                  :allowClear="false"-->
                  <!--                  v-model="sorting"-->
                  <!--               />-->
                  <!--            </template>-->
               </Cap>
            </template>
         </grid>

         <!-- <div class="infinityLoader">
           Loading...
         </div> -->

<!--         <infinite-loading-->
<!--            :key="refreshInfinity"-->
<!--            :action-data="JSON.parse(this.$route.query.parts_filter || '{}')"-->
<!--            action="getInfiniteMainPartsPageSearchWithoutMutate"-->
<!--            getter="partAnnouncements"-->
<!--            :per-page="40"-->
<!--         />-->

<!--         <HandleIds :type="'parts'" :items="partAnnouncements.data" />-->
      </div>
   </div>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   import Grid from '~/components/announcements/Grid'
   import Categories from '~/components/parts/Categories'
   import Banners from '~/components/parts/Banners'
   import PartSearchForm from '~/components/parts/PartSearchForm'
   import NoResults from '~/components/elements/NoResults'
   import SiteBanner from "~/components/banners/SiteBanner";
   import HandleIds from "~/components/announcements/HandleIds.vue";
   import Banner from "~/components/elements/Banner.vue";
   import Cap from "~/components/elements/Cap.vue";

   export default {
      name: 'pages-parts-index',

      // layout: 'search',

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
            sorting: 'created_at_desc',
            sortItems: [
               { id: 'created_at_desc', name: this.$t('show_by_date') },
               { id: 'price_asc', name: this.$t('show_cheap_first') },
               { id: 'price_desc', name: this.$t('show_expensive_first') }
            ]
         }
      },

      components: {
         SiteBanner,
         Grid,
         Categories,
         Banners,
         PartSearchForm,
         NoResults,
         HandleIds,
         Banner,
         Cap
      },

      async asyncData({store}) {
         await Promise.all([
            store.dispatch('fetchPartsAnnouncements'),
            store.dispatch('fetchPartMonetized')
         ])

         return {
            pending: false,
         }
      },

      mounted() {
         // if (this.$route.query.parts_filter) {
         //    this.searchParts();
         //    this.$store.dispatch('fetchPartsAnnouncements', { type: 'parts' });
         // }
         //window.addEventListener('scroll', this.getNextAnnouncements)
      },

      methods: {
         // ...mapActions(['fetchAllAnnouncementsHome']),

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

         async changePage(page = 1) {
            page = this.$route.query.page || 1;

            this.pending = true;
            await this.$store.dispatch('fetchPartsAnnouncements', page);
            this.pending = false;

            this.scrollTo('.announcements-content', [-125, -125]);
         }
      },

      computed: {
         ...mapGetters({
            // partAnnouncements: 'partAnnouncements',
            // otherAnnouncements: 'parts/otherAnnouncements',
            // pagination: 'parts/pagination',
            // otherAnnouncementsPagination: 'parts/otherAnnouncementsPagination',
            // searchActive: 'parts/searchActive',
            // showNotFound: 'parts/showNotFound',
            // mainPartsAnnouncements: 'mainPartsAnnouncements',
            // getMainMonetized: 'getMainMonetized',
            partsMonetized: 'partsV2Monetized',
            parts: 'partsV2',
         }),

         crumbs() {
            return [{ name: this.$t('all_parts') }]
         },
      },

      // watch: {
      //    sorting(val) {
      //       if (val === '') {
      //          this.$store.dispatch('getInfiniteMainPartsPageSearch', { params: { sorting: 'created_at_desc' }});
      //       } else {
      //          this.$store.dispatch('getInfiniteMainPartsPageSearch', { params: {sorting: this.sorting} });
      //       }
      //    }
      // },

      beforeDestroy() {
         // this.mutate({property: 'temporaryLazyData', value: {}});

         //window.removeEventListener('scroll', this.getNextAnnouncements)
      }
   }
</script>

<style lang="scss">
   .pages-parts-index {
      padding-bottom: 120px;

      //.announcements-grid {
      //   margin: 32px -15px 0 -15px;
      //}
   }

   .dark-mode {
      .pages-parts-index {
         .form-buttons {
            .btn {
               &:not(.active) {
                  color: #EEF2F6;
                  border-color: transparent;
                  background-color: transparent;
                  &:hover {
                     background-color: #155EEF;
                  }
               }
            }
         }
      }
   }

   @media (max-width: 1150px) {
      .pages-parts-index {
         .banner {
            background-position-x: right !important;
         }
      }
   }

   @media (max-width: 600px) {
      .pages-parts-index {
         .part-search-form {
            margin: -30px -20px 0 -20px;

            //.cart {
               //padding: 24px 16px !important;
               //border-radius: unset;
            //}
         }
      }
   }
</style>
