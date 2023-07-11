<template>
   <div class="pages-user-announcements">
      <div class="container">
<!--         <h4 class="pages-user-announcements__title">{{ $t('all_announcements_of_user', { name: userFullName }) }}</h4>-->

         <breadcrumbs :crumbs="crumbs" />

         <ul class="tabs">
            <li
               :class="['tabs__item', {'active' : tab.id === activeTab }]"
               v-for="tab in tabs"
               :key="tab.id"
               @click="activeTab = tab.id"
            >{{ tab.name }}</li>
         </ul>

         <div class="tabContent">
            <div class="tabContent__item" v-if="activeTab === 1">
               <grid
                  v-if="userAnnouncements.length"
                  :announcements="userAnnouncements"
                  escape-duplicates
               />

               <no-results
                  v-if="!userAnnouncements.length"
                  :text="$t('no_announcements')"
               ></no-results>
            </div>

            <div class="tabContent__item" v-if="activeTab === 2">
               <PlatesGrid
                  :items="getUserRegistrationMarks.data"
                  :showFavoriteBtn="true"
               >
               </PlatesGrid>

               <pagination
                  v-if="getUserRegistrationMarks?.meta?.last_page > 1"
                  :page-count="getUserRegistrationMarks?.meta?.last_page"
                  @change-page="changePageMarks"
               />

               <no-results
                  v-if="!getUserRegistrationMarks.data.length"
                  :text="$t('no_favorites')"
                  :template="'new'"
                  :url="'/images/empty_result_favorites.svg'"
               >
               </no-results>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
   import { mapGetters } from 'vuex';
   import Grid from '~/components/announcements/Grid';
   import PlatesGrid from "~/components/announcements/PlatesGrid.vue";
   import NoResults from "~/components/elements/NoResults.vue";

   export default {
      name: 'pages-user-id-announcements',

      head() {
         return this.$headMeta({
            title: this.$t('all_announcements_of_user', { name: this.userFullName })
         });
      },

      nuxtI18n: {
         paths: {
            az: '/istifadeci/:id/elanlar'
         }
      },

      components: {
         Grid,
         PlatesGrid,
         NoResults
      },

      data() {
        return {
           activeTab: 1
        }
      },

      methods: {
         changePageMarks(page) {
            this.$store.dispatch('fetchUserRegistrationMarks', `?page=${page}`);
            this.scrollTo('.tabs', [-15, -20]);
         },
      },

      async asyncData({ store, route }) {
         await store.dispatch('getUserAnnouncements', { id: route.params.id });
         await store.dispatch('fetchUserRegistrationMarks', `${route.params.id}`);
      },

      computed: {
         ...mapGetters(['userAnnouncements', 'getUserRegistrationMarks']),

         tabs() {
            return [
               { id: 1, name: this.$t('vehicles') },
               { id: 2, name: this.$t('registration_badges_2') }
            ]
         },

         userFullName() {
            return this.userAnnouncements[0]?.user.full_name;
         },

         crumbs() {
            return [
               { name: this.$t('all_announcements_of_user', { name: this.userFullName }) },
            ]
         }
      }
   }
</script>

<style lang="scss" scoped>
   .pages-user-announcements {
      &__title {
         font-weight: 700;
         font-size: 28px;
         line-height: 32px;
         color: #1B2434;
         margin: 0;
      }
   }
</style>
