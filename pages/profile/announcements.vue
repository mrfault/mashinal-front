<template>
   <div class="pages-annoucements pt-2 pt-lg-6" :key="refresh">
      <div class="container">
         <breadcrumbs :crumbs="crumbs" />

         <div class="card" v-if="isMobileBreakpoint">
            <h2 class="title-with-line mb-0">
               <span>{{ $t('my_announces') }}</span>
            </h2>
         </div>

         <controls-panel
            :show-toolbar="!!myAnnouncements.data.length"
            :clearSelected="activeTab"
            :type="activeTab"
         />
         <!-- <div class="row flex-row-reverse" v-if="!(statusReady === '' && !myAnnouncements.data.length)">
           <div class="col-lg-auto col-lg-1-5 mb-lg-n1">
             <form-select :label="$t('status')" :options="getStatusOptions" v-model="form.status"
               @change="changePage(1)" :clear-option="false" :allow-clear="false" has-no-bg />
           </div>
         </div> -->

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
                  v-if="myAnnouncements.data.length"
                  :announcements="myAnnouncements.data"
                  :paginate="$paginate(myAnnouncements)"
                  :pending="pending"
                  :push-into-router="false"

                  :show-title="false"
                  :show-checkbox="true"
                  :show-status="true"
                  @change-page="changePage"
                  isProfilePage
               />
<!--               :title="$t('my_announces')"-->

               <no-results v-else
                           :type="$route.query.type == 2 ? 'part' : 'car'"
                           :text="statusReady !== '' ? '' : $t('add_an_ad_and_thousands_of_potential_buyers_will_see_it')"
               >
                  <nuxt-link v-if="statusReady === ''" :to="$localePath('/sell')" class="btn btn--green mt-2 mt-lg-3"
                             v-html="$t('to_sell')"/>
               </no-results>
            </div>

            <div class="tabContent__item" v-if="activeTab === 2">
               <PlatesGrid
                  :items="getMyPlates.data"
                  :moreInfo="true"
                  :short-date="true"
                  :checkbox="true"
               >
               </PlatesGrid>

               <pagination
                  v-if="getMyPlates?.meta?.last_page > 1"
                  :page-count="getMyPlates?.meta?.last_page"
                  :value="getMyPlates?.meta?.current_page"
                  @change-page="changePageMarks"
               />

               <no-results
                  v-if="!getMyPlates.data.length"
                  :text="$t('empty_plates')"
                  :template="'new-img'"
                  :url="'/img/empty_plates.png'"
                  :urlDarkMode="'/img/empty_plates_dark-mode.png'"
               ></no-results>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

import Grid from '~/components/announcements/Grid';
import NoResults from '~/components/elements/NoResults';
import ControlsPanel from '~/components/announcements/ControlsPanel';
import PlatesGrid from "~/components/announcements/PlatesGrid.vue";
// import tr from "vue2-datepicker/locale/es/tr";

export default {
   name: 'pages-profile-announcements',
   middleware: 'auth_general',
   layout: 'garageLayout',
   data() {
      return {
         activeTab: 1
      }
   },
   components: {
      Grid,
      NoResults,
      ControlsPanel,
      PlatesGrid
   },
   nuxtI18n: {
      paths: {
         az: '/profil/elanlarim'
      }
   },
   head() {
      return this.$headMeta({
         title: this.$t('my_announces')
      });
   },
   mounted() {
      this.$nuxt.$on('refresh-my-announcements', () => this.refresh++);
   },
   async asyncData({store, route}) {
      let status = ['0', '1', '2', '3'].includes(route.query.status) ? parseInt(route.query.status) : '';
      let shop = ['1', '2'].includes(route.query.type) ? (route.query.type == 2 ? 'part' : 'salon') : false;

      await Promise.all([
         store.dispatch('getMyAllAnnouncements', {status, shop}),
         store.dispatch('fetchPlates'),
      ]);

      return {
         pending: false,
         statusReady: status,
         form: {status},
         refresh: 0,
      }
   },
   methods: {
      ...mapActions(['getMyAllAnnouncements']),

      changePageMarks(page) {
         this.$store.dispatch('fetchPlates', `?page=${page}`);
         this.scrollTo('.pages-annoucements', [-15, -20]);
      },

      async changePage(page = 1) {
         this.pending = true;
         await this.getMyAllAnnouncements({page, ...this.form});
         this.statusReady = this.form.status;
         this.pending = false;
         this.scrollTo('.announcements-grid.paginated', [-15, -20]);
      },
      isValid(status) {
         return [0, 1, 2, 3].includes(status);
      }
   },
   computed: {
      // tr() {
      //    return tr
      // },
      ...mapGetters(['myAnnouncements', 'getMyPlates']),

      crumbs() {
         return [
            {name: this.$t('my_announces')}
         ]
      },

      getStatusOptions() {
         return [
            {key: 1, name: this.$t('active')},
            {key: 2, name: this.$t('under_consideration')},
            {key: 0, name: this.$t('rejected_many')},
            {key: 3, name: this.$t('inactive')}
         ]
      },

      tabs() {
         return [
            { id: 1, name: this.$t('my_vehicles') },
            { id: 2, name: this.$t('registration_badges') }
         ]
      }
   }
}
</script>

<style lang="scss">
   @media (max-width: 500px) {
      .pages-annoucements {
         .tabContent {
            &__item {
               .no-results {
                  svg {
                     width: 300px;
                     height: 80px;
                  }
               }
            }
         }
      }
   }

   @media (max-width: 375px) {
      .pages-annoucements {
         .tabContent {
            &__item {
               .no-results {
                  svg {
                     width: 260px;
                     height: 55px;
                  }
               }
            }
         }
      }
   }
</style>
