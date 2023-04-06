<template>
   <div class="pages-annoucements pt-2 pt-lg-6" :key="refresh">
      <div class="container">
         <breadcrumbs :crumbs="crumbs" />

         <div class="card" v-if="isMobileBreakpoint">
            <h2 class="title-with-line mb-0">
               <span>{{ $t('my_announces') }}</span>
            </h2>
         </div>

         <controls-panel :show-toolbar="!!myAnnouncements.data.length"/>
         <!-- <div class="row flex-row-reverse" v-if="!(statusReady === '' && !myAnnouncements.data.length)">
           <div class="col-lg-auto col-lg-1-5 mb-lg-n1">
             <form-select :label="$t('status')" :options="getStatusOptions" v-model="form.status"
               @change="changePage(1)" :clear-option="false" :allow-clear="false" has-no-bg />
           </div>
         </div> -->
         <h4 class="pages-annoucements__title">Nəqliyyat vasitəsi elanlarım</h4>

         <grid
            v-if="myAnnouncements.data.length"
            :announcements="myAnnouncements.data"
            :paginate="$paginate(myAnnouncements)"
            :pending="pending"
            :push-into-router="false"
            :title="$t('my_announces')"
            :show-title="false"

            :show-checkbox="true"
            :show-status="true"
            @change-page="changePage"
            isProfilePage
         />

         <no-results v-else
                     :type="$route.query.type == 2 ? 'part' : 'car'"
                     :text="statusReady !== '' ? '' : $t('add_an_ad_and_thousands_of_potential_buyers_will_see_it')"
         >
            <nuxt-link v-if="statusReady === ''" :to="$localePath('/sell')" class="btn btn--green mt-2 mt-lg-3"
                       v-html="$t('to_sell')"/>
         </no-results>

         <RegistrationMarksGrid
            :items="myAnnouncements.data"
            :is-filtered="true"
            :moreInfo="true"
            :short-date="true"
         >
            <template #head>
               <h4 class="registrationMarksGrid__title">Qeydiyyat nişanı elanlarım</h4>
            </template>
         </RegistrationMarksGrid>
      </div>
   </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

import Grid from '~/components/announcements/Grid';
import NoResults from '~/components/elements/NoResults';
import ControlsPanel from '~/components/announcements/ControlsPanel';
import RegistrationMarksGrid from "~/components/announcements/RegistrationMarksGrid.vue";
import tr from "vue2-datepicker/locale/es/tr";

export default {
   name: 'pages-profile-announcements',
   middleware: 'auth_general',
   components: {
      Grid,
      NoResults,
      ControlsPanel,
      RegistrationMarksGrid
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
      tr() {
         return tr
      },
      ...mapGetters(['myAnnouncements']),

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
      }
   }
}
</script>

<style lang="scss">
   .pages-annoucements {
      &__title {
         margin-top: 48px;
         font-weight: 700;
         font-size: 28px;
         line-height: 32px;
         color: #1B2434;
      }

      .registrationMarksGrid {
         margin-top: 40px;
      }
   }

   @media (max-width: 1025px) {
      .pages-annoucements {
         &__title {
            margin-left: -10px;
         }
      }
   }

   @media (max-width: 500px) {
      .pages-annoucements {
         &__title {
            font-size: 25px;
         }
      }
   }

   @media (max-width: 425px) {
      .pages-annoucements {
         &__title {
            font-size: 20px;
         }
      }
   }
</style>
