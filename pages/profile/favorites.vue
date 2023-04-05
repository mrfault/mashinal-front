<template>
   <div class="pages-favorites">
      <div class="container">
         <breadcrumbs :crumbs="crumbs"/>
<!--         <pre>{{ favoriteAnnouncements }}</pre>-->
         <grid
            v-if="favoriteAnnouncements.data.length"
            :announcements="favoriteAnnouncements.data"
            :paginate="$paginate(favoriteAnnouncements)"
            :pending="pending"
            :watch-route="true"
            :title="$t('favorites')"
            :show-title="isMobileBreakpoint"
            @change-page="changePage"
         />

         <no-results :text="$t('no_favorites')" v-else>
            <nuxt-link class="active btn btn--pale-green-outline d-flex full-width mt-2"
                       style="max-width: 200px;"
                       :to="$localePath('/')">
               <i aria-hidden="true" class="icon-plus-circle"></i> {{ $t('my_favorites_add') }}
            </nuxt-link>
         </no-results>

         <pagination
            v-if="$paginate(favoriteAnnouncements) && $paginate(favoriteAnnouncements).last_page > 1"
            :page-count="$paginate(favoriteAnnouncements).last_page"
            :value="$paginate(favoriteAnnouncements).current_page"
            @change-page="changePage"
         />
      </div>
   </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

import Grid from '~/components/announcements/Grid';
import NoResults from '~/components/elements/NoResults';

export default {
   name: 'pages-profile-favorites',
   middleware: 'auth_general',
   components: {
      Grid,
      NoResults
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
      //    if (this.showAll) {
      //       this.$emit('pending')
      //       this.$router.push({ path: this.showAll, query: { page } }, () => {
      //          this.scrollTo('.announcements-grid', [-15, -20])
      //       })
      //    } else {
      //       if (!this.pushIntoRouter) {
      //          this.$emit('change-page', page)
      //       } else {
      //          this.$router.push({ query: { ...this.$route.query, page } }, () => {
      //             this.$emit('change-page', page)
      //          })
      //       }
      //    }
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
   created() {
      this.markViewedFavorites();
      this.$nuxt.$on('favorites-updated', this.getFavoriteAnnouncements);
   },
   beforeDestroy() {
      this.$nuxt.$off('favorites-updated', this.getFavoriteAnnouncements);
   }
}
</script>
