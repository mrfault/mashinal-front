<template>
   <div class="pages-favorites">
      <div class="container">
         <breadcrumbs :crumbs="crumbs"/>

         <h4 class="pages-favorites__title">Nəqliyyat vasitəsi elanlarım</h4>

<!--         :title="$t('favorites')"-->
<!--         :show-title="isMobileBreakpoint"-->
         <grid
            v-if="favoriteAnnouncements.data.length"
            :announcements="favoriteAnnouncements.data"
            :paginate="$paginate(favoriteAnnouncements)"
            :pending="pending"
            :watch-route="true"
            @change-page="changePage"
         />

         <no-results :text="$t('no_favorites')" v-else>
            <nuxt-link class="active btn btn--pale-green-outline d-flex full-width mt-2"
                       style="max-width: 200px;"
                       :to="$localePath('/')">
               <i aria-hidden="true" class="icon-plus-circle"></i> {{ $t('my_favorites_add') }}
            </nuxt-link>
         </no-results>

         <RegistrationMarksGrid
            :items="favoriteAnnouncements.data"
            :is-filtered="true"
            :short-date="true"
         >
            <template #head>
               <h4 class="registrationMarksGrid__title">Qeydiyyat nişanı elanlarım</h4>
            </template>
         </RegistrationMarksGrid>

<!--         <pagination-->
<!--            v-if="$paginate(favoriteAnnouncements) && $paginate(favoriteAnnouncements).last_page > 1"-->
<!--            :page-count="$paginate(favoriteAnnouncements).last_page"-->
<!--            :value="$paginate(favoriteAnnouncements).current_page"-->
<!--            @change-page="changePage"-->
<!--         />-->
      </div>
   </div>
</template>

<script>
   import {mapGetters, mapActions} from 'vuex';

   import Grid from '~/components/announcements/Grid';
   import NoResults from '~/components/elements/NoResults';
   import RegistrationMarksGrid from "~/components/announcements/RegistrationMarksGrid.vue";

   export default {
      name: 'pages-profile-favorites',
      middleware: 'auth_general',

      components: {
         Grid,
         NoResults,
         RegistrationMarksGrid
      },

      nuxtI18n: {
         paths: {
            az: '/profil/secilmisler'
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
         ]);

         return {
            pending: false
         }
      },

      methods: {
         ...mapActions(['getFavoriteAnnouncements', 'markViewedFavorites']),

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
         //    //    console.log('1111')
         //    //
         //    // } else {
         //    //    console.log('222')
         //    //    if (!this.pushIntoRouter) {
         //    //       this.$emit('change-page', page)
         //    //       console.log('333')
         //    //    } else {
         //    //       this.$router.push({ query: { ...this.$route.query, page } }, () => {
         //    //          this.$emit('change-page', page)
         //    //       })
         //    //       console.log('444')
         //    //    }
         //    // }
         // },
      },

      computed: {
         ...mapGetters(['favoriteAnnouncements']),

         crumbs() {
            return [
               {name: this.$t('favorites')}
            ]
         }
      },

      mounted() {
         // console.log(this.pushIntoRouter, 'this.pushIntoRouter')
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

<style lang="scss" scoped>
   .pages-favorites {
      &__title {
         margin-top: 48px;
         font-weight: 700;
         font-size: 28px;
         line-height: 32px;
         color: #1B2434;
      }

      .registrationMarksGrid {
         margin-top: 48px;
      }
   }

   @media (max-width: 1025px) {
      .pages-favorites {
         &__title {
            margin-left: -10px;
         }
      }
   }

   @media (max-width: 500px) {
      .pages-favorites {
         &__title {
            font-size: 25px;
         }
      }
   }

   @media (max-width: 425px) {
      .pages-favorites {
         &__title {
            font-size: 20px;
         }
      }
   }
</style>
