<template>
   <div class="pages-user-announcements">
      <div class="container">
         <h2 class="pages-user-announcements__title">{{ $t('all_announcements_of_user', { name: userFullName }) }}</h2>

         <div class="pages-user-announcements__subhead">
            <div class="tabsWrapper">
               <ul class="tabs">
                  <li
                     :class="['tabs__item', {'active' : tab.id === activeTab }]"
                     v-for="tab in tabs"
                     :key="tab.id"
                     @click="activeTab = tab.id"
                  >{{ tab.name }} ({{ tab.length }})</li>
               </ul>
            </div>

<!--            <form-select-->
<!--               class="d-none d-md-block"-->
<!--               :label="$t('sorting_2')"-->
<!--               :options="sortItems"-->
<!--               :clearPlaceholder="true"-->
<!--               :clear-option="false"-->
<!--               :allowClear="false"-->
<!--               :objectInValue="true"-->
<!--               v-model="sorting"-->
<!--            />-->
         </div>

         <div class="tabContent">
            <div class="tabContent__item" v-if="activeTab === 1">
               <grid
                  v-if="userAnnouncements.filter(item => item.type !== 'part').length"
                  :announcements="userAnnouncements.filter(item => item.type !== 'part')"
                  :has-container="false"
                  escape-duplicates
               />

               <no-results
                  v-else
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
                  :text="$t('no_plates')"
                  :template="'new'"
                  :url="'/images/empty_result.svg'"
               >
               </no-results>
            </div>

            <div class="tabContent__item" v-if="activeTab === 3">
               <grid
                  v-if="userAnnouncements.filter(item => item.type === 'part').length"
                  :announcements="userAnnouncements.filter(item => item.type === 'part')"
                  :has-container="false"
                  escape-duplicates
               />

               <no-results
                  v-else
                  :text="$t('no_announcements')"
               ></no-results>
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
           activeTab: 1,
           sorting: { key: 'created_at', value: 'desc', name: this.$t('show_by_date') },
           sortItems: [
              { key: 'created_at', value: 'desc', name: this.$t('show_by_date') },
              { key: 'price_asc', value: 'asc', name: this.$t('show_cheap_first') },
              { key: 'price_desc', value: 'desc', name: this.$t('show_expensive_first') },
              // { key: 'mileage', value: 'asc', name: this.$t('mileage') },
              // { key: 'year', value: 'desc', name: this.$t('years') }
           ]
        }
      },

      methods: {
         changePageMarks(page) {
            // this.$store.dispatch('fetchUserRegistrationMarks', `?page=${page}`);
            // this.scrollTo('.tabs', [-15, -20]);
         },
      },

      async asyncData({ store, route }) {
         await store.dispatch('getUserAnnouncements', route.params.id);
         await store.dispatch('fetchUserRegistrationMarks', `${route.params.id}`);
      },

      computed: {
         ...mapGetters(['userAnnouncements', 'getUserRegistrationMarks']),

         tabs() {
            return [
               { id: 1, name: this.$t('vehicles'), length: this.userAnnouncements?.filter(item => item.type !== 'part')?.length },
               { id: 2, name: this.$t('registration_badges_2'), length: this.getUserRegistrationMarks?.data?.length },
               { id: 3, name: this.$t('menu_spare_parts'), length: this.userAnnouncements?.filter(item => item.type === 'part')?.length },
            ]
         },

         userFullName() {
            return this.userAnnouncements[0]?.user.full_name;
         },

         // crumbs() {
         //    return [
         //       { name: this.$t('all_announcements_of_user', { name: this.userFullName }) },
         //    ]
         // }
      }
   }
</script>

<style lang="scss">
   .pages-user-announcements {
      padding: 40px 0;

      &__title {
         font-weight: 700;
         font-size: 28px;
         line-height: 32px;
         color: #1B2434;
         margin-bottom: 32px;
      }

      &__subhead {
         display: flex;
         align-items: center;
         justify-content: space-between;

         .form-group {
            max-width: 200px;
         }
      }

      .registrationMarksGrid {
         margin-top: 0;

         &__items {
            margin-top: 0;
         }
      }
   }

   @media (max-width: 992px) {
      .pages-user-announcements {
         &__title {
            font-weight: 600;
            font-size: 24px;
         }
      }
   }

   @media (max-width: 992px) {
      .pages-user-announcements {
         &__title {
            font-size: 20px;
            line-height: 24px;
         }
      }
   }
</style>
