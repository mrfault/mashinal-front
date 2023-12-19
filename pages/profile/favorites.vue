<template>
   <div class="pages-favorites">
      <div class="container">
         <breadcrumbs :crumbs="crumbs" />

         <h2 class="pages-favorites__title">{{ $t('favorites_ads') }}</h2>

         <div class="tabsWrapper">
            <ul class="tabs">
               <li
                  :class="['tabs__item', {'active' : tab.id === activeTab }]"
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
               >{{ tab.name }} ({{ tab.count || 0 }})</li>
            </ul>
         </div>

         <div class="tabContent">
            <div class="tabContent__item" v-if="activeTab === 1">
               <grid
                  v-if="favoriteAnnouncements.data.length"
                  :announcements="favoriteAnnouncements.data"
                  :paginate="$paginate(favoriteAnnouncements)"
                  :pending="pending"
                  :watch-route="true"
                  :has-container="false"
                  :escapeDuplicates="true"
                  @change-page="changePage"
               />

               <no-results :text="$t('no_favorites')" v-else>
                  <nuxt-link class="active btn btn--pale-green-outline d-flex full-width mt-2"
                             style="max-width: 200px;"
                             :to="$localePath('/')">
                     <i aria-hidden="true" class="icon-plus-circle"></i> {{ $t('my_favorites_add') }}
                  </nuxt-link>
               </no-results>
            </div>

            <div class="tabContent__item" v-if="activeTab === 2">
               <grid
                  v-if="getMySavedParts?.data?.length"
                  :announcements="getMySavedParts?.data"
                  :paginate="getMySavedParts?.meta"
                  :pending="pending"
                  :watch-route="true"
                  :has-container="false"
                  :escapeDuplicates="true"
                  @change-page="changePage"
               />

               <no-results :text="$t('no_favorites')" v-else>
                  <nuxt-link class="active btn btn--pale-green-outline d-flex full-width mt-2"
                             style="max-width: 200px;"
                             :to="$localePath('/')">
                     <i aria-hidden="true" class="icon-plus-circle"></i> {{ $t('my_favorites_add') }}
                  </nuxt-link>
               </no-results>
            </div>

            <div class="tabContent__item" v-if="activeTab === 3">
               <PlatesGrid
                  :items="getMySavedPlates?.data"
                  :showFavoriteBtn="true"
                  :escapeDuplicates="true"
               >
               </PlatesGrid>

               <pagination
                  v-if="getMySavedPlates?.meta?.last_page > 1"
                  :page-count="getMySavedPlates?.meta?.last_page"
                  @change-page="changePageMarks"
               />

               <no-results
                  :text="$t('no_favorites')"
                  :template="'new'"
                  :url="'/images/empty_result_favorites.svg'"
                  v-if="!getMySavedPlates.data.length"
               >
                  <nuxt-link class="active btn btn--pale-green-outline d-flex full-width mt-2"
                             style="max-width: 200px;"
                             :to="$localePath('/plates')"
                  >
                     <i aria-hidden="true" class="icon-plus-circle"></i>
                     {{ $t('my_favorites_add') }}
                  </nuxt-link>
               </no-results>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
   import {mapGetters, mapActions} from 'vuex';

   import Grid from '~/components/announcements/Grid';
   import NoResults from '~/components/elements/NoResults';
   import PlatesGrid from "~/components/announcements/PlatesGrid.vue";

   export default {
      name: 'pages-profile-favorites',
      middleware: 'auth_general',

      components: {
         Grid,
         NoResults,
         PlatesGrid
      },

      nuxtI18n: {
         paths: {
            az: '/profil/secilmisler'
         }
      },

      data() {
         return {
            activeTab: 1
         }
      },

      head() {
         return this.$headMeta({
            title: this.$t('favorites')
         });
      },

      async asyncData({store, route}) {
         let page = route.query.page || 1;

         await Promise.all([
            store.dispatch('getFavoriteAnnouncements', {page}),
            store.dispatch('fetchMySavedPlates'),
            store.dispatch('fetchMySavedParts'),
         ]);

         return {
            pending: false
         }
      },

      methods: {
         ...mapActions(['getFavoriteAnnouncements', 'markViewedFavorites']),

         changePageMarks(page) {
            this.$store.dispatch('fetchMySavedPlates', `?page=${page}`);
            this.scrollTo('.tabs', [-15, -20]);
         },

         async changePage(page = 1) {
            page = this.$route.query.page || 1;
            this.pending = true;
            await this.getFavoriteAnnouncements({page});
            this.pending = false;
            this.scrollTo('.announcements-grid.paginated', [-15, -20]);
         },

         // changePage(page) {
         //    this.$router.push({ path: this.showAll, query: { page } }, () => {
         //       this.getFavoriteAnnouncements({page});
         //       this.scrollTo('.announcements-grid', [-15, -20])
         //    })
         //
         //    // if (this.showAll) {
         //    //    // this.$emit('pending')
         //    //    this.$router.push({ path: this.showAll, query: { page } }, () => {
         //    //       this.scrollTo('.announcements-grid', [-15, -20])
         //    //    })
         //    //
         //    // } else {
         //    //    if (!this.pushIntoRouter) {
         //    //       this.$emit('change-page', page)
         //    //    } else {
         //    //       this.$router.push({ query: { ...this.$route.query, page } }, () => {
         //    //          this.$emit('change-page', page)
         //    //       })
         //    //    }
         //    // }
         // },
      },

      computed: {
         ...mapGetters(['favoriteAnnouncements', 'getMySavedPlates', 'getMySavedParts']),

         crumbs() {
            return [
               {name: this.$t('favorites')}
            ]
         },

         tabs() {
            return [
               { id: 1, name: this.$t('vehicles'), count: this.favoriteAnnouncements?.data?.length },
               { id: 2, name: this.$t('menu_spare_parts'), count: this.getMySavedParts?.data?.length },
               { id: 3, name: this.$t('registration_badges_2'), count: this.getMySavedPlates?.data?.length }
            ]
         }
      },

      created() {
         this.markViewedFavorites();
         this.$nuxt.$on('favorites-updated', this.getFavoriteAnnouncements);
      },

      beforeDestroy() {
         this.$nuxt.$off('favorites-updated', this.getFavoriteAnnouncements);
      }
   }
</script>

<style lang="scss">
   .pages-favorites {
      &__title {
         color: #121926;
         font-size: 28px;
         font-weight: 700;
         line-height: 32px;
         margin-bottom: 32px;
      }

      .registrationMarksGrid {
         margin-top: 0;

         &__items {
            margin-top: 0;
         }
      }
   }
</style>
