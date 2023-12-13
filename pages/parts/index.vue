<template>
   <div class="pages-parts-index">
      <Banner
         class="mt-0 d-sm-none"
         :bg="'/img/part_bg.png'"
         :title="$t('parts')"
      >
<!--         <template #content>-->
<!--            <breadcrumbs :crumbs="crumbs" />-->
<!--         </template>-->
      </Banner>

      <part-search-form
         class="mt-0 d-sm-none"
         :pending="pending"
         :sorting="sorting"
         @pending="pending = true"
         @submit="searchParts"
      />

      <div class="container">
         <Banner
            class="d-none d-sm-block"
            :bg="'/img/part_bg.png'"
            :title="$t('parts')"
         >
<!--            <template #content>-->
<!--               <breadcrumbs :crumbs="crumbs" />-->
<!--            </template>-->
         </Banner>

         <part-search-form
            class="d-none d-sm-block"
            :pending="pending"
            :sorting="sorting"
            @pending="pending = true"
            @submit="searchParts"
         />

         <grid
            v-if="partsMonetized?.length"
            :announcements="partsMonetized"
            :pending="pending"
            :has-container="false"
         >
            <template #cap>
               <Cap :className="'mb24'">
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
            @change-page="searchParts"
            :has-container="false"
            escape-duplicates
         >
            <template #cap>
               <Cap :className="'mb40'">
                  <template #left>
                     <h3>{{ $t('announcements') }}</h3>
                  </template>

                  <template #right>
                     <form-select
                        :label="$t('sorting_2')"
                        :options="sortItems"
                        :clearPlaceholder="true"
                        :clear-option="false"
                        :allowClear="false"
                        :objectInValue="true"
                        v-model="sorting"
                     />
                  </template>
               </Cap>
            </template>
         </grid>

         <no-results
            :type="'car'"
            v-else
         />

<!--         <HandleIds :items="handleIdsOptions" />-->
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
            // refreshInfinity: 0,
            sorting: { key: 'created_at', value: 'desc', name: this.$t('show_by_date') },
            sortItems: [
               { key: 'created_at', value: 'desc', name: this.$t('show_by_date') },
               { key: 'price_asc', value: 'asc', name: this.$t('show_cheap_first') },
               { key: 'price_desc', value: 'desc', name: this.$t('show_expensive_first') }
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

      async asyncData({ store, route }) {
         const data = JSON.parse(route.query.parts_filter || '{}');
         let page = route.query.page || 1;

         await Promise.all([
            store.dispatch('getInfiniteMainPartsPageSearch', { body: data, page: page }),
            store.dispatch('fetchPartMonetized', { body: data })
            // store.dispatch('fetchPartsAnnouncements'),
            // store.dispatch('fetchPartMonetized')
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

         if (this.$route.query?.parts_filter) {
            let filters = JSON.parse(this.$route.query?.parts_filter)

            if (filters.sort_by === 'price') {
               this.sorting.key = `${filters.sort_by}_${filters.sort_order}`;
               this.sorting.value = filters.sort_order;
            } else {
               this.sorting.key = filters.sort_by;
               this.sorting.value = filters.sort_order;
            }
         }
      },

      methods: {
         // ...mapActions(['fetchAllAnnouncementsHome']),

         async searchParts(page = 1) {
            // this.refreshInfinity++;
            // this.mutate({ property: 'temporaryLazyData', value: {} });
            page = this.$route.query.page || 1;
            this.pending = true
            const data = JSON.parse(this.$route.query.parts_filter || '{}')
            await this.$store.dispatch('getInfiniteMainPartsPageSearch', { body: data, page: page })
            await this.$store.dispatch('fetchPartMonetized', { body: data });
            this.pending = false
            // await this.$store.dispatch('parts/setSearchActive', true)
            this.scrollTo('.cap', [-80, -200]);
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

         handleIdsOptions() {
            let ids = [];

            ids.push({
               type: 'parts',
               ids: [
                  ...this.parts?.data?.map(item => item.id),
                  ...this.partsMonetized?.map(item => item.id),
               ]
            });

            return ids;
         }
      },

      beforeDestroy() {
         // this.mutate({property: 'temporaryLazyData', value: {}});

         //window.removeEventListener('scroll', this.getNextAnnouncements)
      }
   }
</script>

<style lang="scss">
   .pages-parts-index {
      .announcements-grid {
         margin: 24px 0;
      }
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
            .card {
               border-radius: 0;
            }
         }
      }
   }
</style>
