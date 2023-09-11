<template>
   <div :key="refresh" class="pages-annoucements pt-2 pt-lg-6">
      <portal to="breadcrumbs">
         <breadcrumbs :crumbs="crumbs"/>
      </portal>
      <div :class="{'ma-announcements-autosalon-container': user.autosalon}" class="container">
         <div class="ma-announcements">
            <h2 class="ma-title--md">{{ $t('my_announces') }}</h2>
            <!--            statistics-->
            <div v-if="user.autosalon" class="ma-announcements__top-cards">
               <div v-for="(item,index) in topCards" :key="index + 8923764" class="ma-announcements__top-card">
                  <div class="ma-announcements__top-card--image">
                     <inline-svg :src="`/new-icons/announcements/${item.image}.svg`"/>
                  </div>
                  <div class="ma-announcements__top-card__content">
                     <div class="ma-announcements__top-card--title">{{ $t(item.name) }}</div>
                     <div class="ma-announcements__top-card--count">{{ $t(item.value) || 0 }}</div>
                  </div>

               </div>
            </div>

            <div :class="{'ma-announcements__head-autosalon-container': user.autosalon}">
               <!--            sort switch-->
               <h2 v-if="isMobileBreakpoint && user.autosalon" class="ma-announcements-autosalon-title">
                  {{ $t('most_viewed_announcements') }}</h2>
               <div v-if="isMobileBreakpoint && user.autosalon" :class="{'pl-0': isMobileBreakpoint}"
                    class="ma-announcements-sort-switch pt-0 pb-2">
                  <p>{{ $t('sorting_view') }}</p>
                  <custom-switch :value="sortSwitch" @input="sortAnnounces"/>
                  <p>{{ $t('sorting_call') }}</p>
               </div>

               <div
                  :class="{'ma-announcements__head-autosalon': user.autosalon}"
                  class="ma-announcements__head">
                  <button
                     v-for="(item,index) in announceItems"
                     :class="{'ma-announcements__head--item--active': item.id == activeTab}"
                     class="ma-announcements__head--item"
                     @click="changeTab(item)"
                  >
                     {{ $t(item.title) }}
                  </button>
               </div>
               <div v-if="user.autosalon && !isMobileBreakpoint" class="ma-announcements-sort-switch">
                  <p>{{ $t('sorting_view') }}</p>
                  <custom-switch :value="sortSwitch" @input="sortAnnounces"/>
                  <p>{{ $t('sorting_call') }}</p>
               </div>
            </div>


         </div>
         <div :class="{'ma-announcements__body-autosalon': user.autosalon}" class="ma-announcements__body">
            <h4 v-if="!loading && !user.autosalon" class="ma-subtitle--lg">{{ $t('my_vehicle_announcements') }}</h4>

            <div id="announcementsContainer" :class="{'overflow-x-hidden': !myAnnouncements.length}"
                 class="ma-announcements__body--row" @mousedown.prevent="startDragging" @mouseup.prevent="mouseUp">
               <!--                                loading-->
               <div v-if="loading">
                  <loader class="profile-announcements-loader"/>
               </div>
               <div v-else-if="!loading && myAnnouncements && myAnnouncements.length"
                    class="ma-announcements__body--row__inner">
                  <template v-if="true">
                     <template v-for="(announcement,index) in myAnnouncements">
                        <div class="ma-announcements__body--row__inner--item-plate">
                           <grid-item
                              :key="announcement.id_unique +  '_' + index"
                              :activeTab="activeTab"
                              :announcement="announcement"
                              :clickable="!isDragging"
                              :isLastChild="index === myAnnouncements.length - 1"
                              isProfilePage
                              show-monetization-actions
                              show-overlay
                              show-phone-count
                              show-status
                              track-views
                           />
                        </div>
                     </template>
                  </template>

                  <!--                  <template v-if="user.autosalon">-->
                  <!--                     <template v-for="(announcement,index) in myAnnouncementStats.most_viewed_announces">-->
                  <!--                        <div class="ma-announcements__body&#45;&#45;row__inner&#45;&#45;item-plate">-->
                  <!--                           <grid-item-->
                  <!--                              :key="announcement.id_unique +  '_' + index + 654"-->
                  <!--                              :activeTab="activeTab"-->
                  <!--                              :announcement="announcement"-->
                  <!--                              :clickable="!isDragging"-->
                  <!--                              :isLastChild="index === myAnnouncements.length - 1"-->
                  <!--                              isProfilePage-->
                  <!--                              show-monetization-actions-->
                  <!--                              show-overlay-->
                  <!--                              show-phone-count-->
                  <!--                              show-status-->
                  <!--                              track-views-->
                  <!--                           />-->
                  <!--                        </div>-->
                  <!--                     </template>-->
                  <!--                  </template>-->

               </div>
               <template v-else>
                  <no-results
                     v-if="myAnnouncements.length === 0 || (activeTab !== null && !myAnnouncements.some(item => activeTab === item.status))"
                     :type="$route.query.type == 2 ? 'part' : 'car'"
                     :url="'/new-icons/no-car.svg'"
                     darker
                  >
                  </no-results>
               </template>
            </div>

            <!--            number plates-->
            <h4 v-if="!loading && !user.autosalon" class="ma-subtitle--lg">{{ $t('my_car_number_announcements') }}</h4>
            <div v-if="!user.autosalon"
                 id="platesContainer"
                 :class="{'overflow-x-hidden': !allMyPlates.length}"
                 class="ma-announcements__body--row"
                 @mousedown.prevent="startDragging"
                 @mouseup.prevent="mouseUp"
            >
               <div v-if="loading" style="height: 420px !important;width:100%; display: flex;justify-content: center;">
                  <loader class="profile-announcements-loader"/>
               </div>
               <div v-else-if="allMyPlates.length" class="ma-announcements__body--row__inner">
                  <template v-for="(item,index) in allMyPlates">
                     <div
                        class="ma-announcements__body--row__inner--item-plate"

                     >
                        <plates-grid-item
                           :key="index"
                           :activeTab="activeTab"
                           :clickable="!isDragging"
                           :isLastChild="index === allMyPlates.length - 1"
                           :item="item"
                           is-profile-page
                           moreInfo
                        />
                     </div>
                  </template>

               </div>
               <div v-else>
                  <no-results
                     v-if="
                     allMyPlates.length === 0 ||
                     (activeTab !== null && !allMyPlates.some(item => activeTab === item.status))"
                     :template="'new-img'"
                     :text="$t('empty_plates')"
                     :url="'/img/empty_plates.png'"
                     :urlDarkMode="'/img/empty_plates_dark-mode.png'"
                     darker
                  ></no-results>
               </div>
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
import GridItem from "~/components/announcements/GridItem";
import AnnouncementCard from "~/components/cards/AnnouncementCard";
import PlatesGridItem from "~/components/announcements/PlatesGridItem";
import CustomSwitch from "~/components/elements/CustomSwitch";
// import tr from "vue2-datepicker/locale/es/tr";

export default {
   name: 'pages-profile-announcements',
   middleware: 'auth_general',
   layout: 'garageLayout',
   data() {
      return {
         activeTab: "null",
         loading: false,
         announceItems: [
            {
               id: "null",
               title: "all2",
               link: "/",
            },
            {
               id: 1,
               title: 'active',
               link: "/",
            },
            {
               id: 2,
               title: 'under_consideration_2',
               link: "/",
            },
            {
               id: 3,
               title: 'sold',
               link: "/",
            },
            {
               id: 4,
               title: 'timed_out',
               link: "/",
            },
            {
               id: 0,
               title: 'rejected_many',
               link: "/",
            },
         ],
         escapeDuplicates: false,
         isDragging: false,
         sortSwitch: false,
         sortedAnnouncements: {},
         refresh: 0,
      }
   },
   components: {
      GridItem,
      Grid,
      NoResults,
      ControlsPanel,
      PlatesGrid,
      AnnouncementCard,
      PlatesGridItem,
      CustomSwitch,
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
      if (this.user?.autosalon?.id) {
         this.getStatistics();
      }

      this.getAllData();
      this.$nuxt.$on('refresh-my-announcements', () => this.refresh++);
   },
   async asyncData({store, route}) {
      await store.dispatch('getSettingsV2')
   },
   // async asyncData({store, route}) {
   //    let status = ['0', '1', '2', '3'].includes(route.query.status) ? parseInt(route.query.status) : '';
   //    let shop = ['1', '2'].includes(route.query.type) ? (route.query.type == 2 ? 'part' : 'salon') : false;
   //
   // await Promise.all([
   //    store.dispatch('getMyAllAnnouncementsV2', {status, shop}),
   //    store.dispatch('fetchPlatesV2', {status}),
   // ]);
   //
   // return {
   //    pending: false,
   //    statusReady: status,
   //    form: {status},
   //    refresh: 0,
   // }
   // },
   methods: {
      ...mapActions({
         getMyAllAnnouncements: 'getMyAllAnnouncementsV2',
         getMyPlates: 'fetchPlatesV2',
         getSettingsV2: 'getSettingsV2'
      }),

      async getAllData() {
         this.loading = true;
         this.pending = true;
         let store = this.$store;
         let route = this.$route;

         let status = ['0', '1', '2', '3'].includes(route.query.status) ? parseInt(route.query.status) : '';
         let shop = ['1', '2'].includes(route.query.type) ? (route.query.type == 2 ? 'part' : 'salon') : false;

         if (!this.user.autosalon) {
            await Promise.all([
               store.dispatch('getMyAllAnnouncementsV2', {status, shop}),
               store.dispatch('fetchPlatesV2', {status}),
            ]);
         } else {
            await this.getMyAllAnnouncements({
               status: this.activeTab,
               sorting: 1
            });
         }


         // return {
         this.pending = false;
         this.loading = false;
         // this.statusReady = this.form.status;
         // form: {status},
         // refresh: 0,
         // }
      },

      changePageMarks(page) {
         this.$store.dispatch('fetchPlatesV2', `?page=${page}`);
         this.scrollTo('.pages-annoucements', [-15, -20]);
      },

      async changeTab(item) {
         this.$store.commit('closeDropdown');
         this.loading = true;
         this.activeTab = item.id;
         await this.getMyAllAnnouncements({status: item.id});
         await this.getMyPlates({status: item.id});
         this.loading = false;
      },

      async changePage(page = 1) {
         this.$store.commit('closeDropdown');
         this.loading = true;
         this.pending = true;
         await this.getMyAllAnnouncements({status: this.activeTab});
         // this.statusReady = this.form.status;
         this.pending = false;
         this.scrollTo('.announcements-grid.paginated', [-15, -20]);
         this.loading = false;

      },

      isValid(status) {
         return [0, 1, 2, 3].includes(status);
      },

      startDragging(event) {
         event.preventDefault(); // Disable content selection while dragging
         event.stopPropagation();
         const container = event.currentTarget;
         let startX = event.clientX;
         let scrollLeft = container.scrollLeft;


         const scrollByDragging = (event) => {
            this.isDragging = true;
            const distance = event.clientX - startX;
            container.scrollLeft = scrollLeft - distance;
         };

         const stopDragging = () => {
            document.removeEventListener('mousemove', scrollByDragging);
            document.removeEventListener('mouseup', stopDragging);
            container.style.userSelect = ''; // Restore default content selection behavior
         };

         document.addEventListener('mousemove', scrollByDragging);
         document.addEventListener('mouseup', stopDragging);
         container.style.userSelect = 'none'; // Disable content selection during dragging
      },

      mouseUp() {
         this.isDragging = false;
      },
      getStatistics() {
         this.$store.dispatch('getAutosalonStatistics', this.user.autosalon.id)
      },

      async sortAnnounces() {
         this.sortSwitch = !this.sortSwitch;
         this.loading = true;
         this.pending = true;
         if (this.sortSwitch == true) {
            await this.getMyAllAnnouncements({
               status: this.activeTab,
               sorting: 2
            });
         } else {
            await this.getMyAllAnnouncements({
               status: this.activeTab,
               sorting: 1
            });
         }
         this.loading = false;
         this.pending = false;
      },

   },
   computed: {
      ...mapGetters({
         myAnnouncements: 'myAnnouncementsV2',
         allMyPlates: 'myPlatesV2',
         autosalonStatistics: 'autosalonStatistics',
         myAnnouncementStats: 'myAnnouncementStats'
      }),

      crumbs() {
         return [
            {name: this.$t('my_announces')}
         ]
      },

      topCards() {
         return [
            {
               name: 'announcements',
               value: this.autosalonStatistics.announce_count || 0,
               image: 'doc'
            },
            {
               name: 'views_count',
               value: this.autosalonStatistics.announce_view_count || 0,
               image: 'eye'
            },
            {
               name: 'favorites',
               value: this.autosalonStatistics.total_favorites || 0,
               image: 'favorite'
            },
            {
               name: 'messages',
               value: this.autosalonStatistics.message_count || 0,
               image: 'message-text'
            },
            {
               name: 'total_calls',
               value: this.autosalonStatistics.call_count || 0,
               image: 'call'
            },

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
            {id: 1, name: this.$t('my_vehicles')},
            {id: 2, name: this.$t('registration_badges')}
         ]
      },

      showTopCards() {
         return !this.isMobileBreakpoint && (this.$route.query.type == 1)
      },

      showHeadCategories() {
         if (this.user.autosalon && this.isMobileBreakpoint) {
            return true
         } else
            return true
      }
   },

}
</script>


<style lang="scss">
.ma-announcements {

   &__top-cards {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
   }

   &__top-card {
      min-height: 100%;
      width: calc((100% - 80px) / 5);
      border-radius: 12px;
      border: 1px solid #D8DCE0;
      padding: 16px;

      &--image {
         width: 40px;
         height: 40px;
         border-radius: 50%;
         background: #EFF4FF;
         margin-bottom: 16px;
         display: flex;
         align-items: center;
         justify-content: center;
      }

      &--title {
         color: #3c4f65;
         font: 500 16px/20px 'TTHoves';
         margin-bottom: 4px;
      }

      &--count {
         font: 600 18px/22px 'TTHoves';
         color: #10243C;
      }
   }

   &__body--row__inner, .ma-announcements__body--row__inner--item-plate {
      //width: 100%;
      border-radius: 0 0 8px 8px;

      .stratch-child-block {
         height: 100% !important;
         min-height: auto !important;

         .item-details {
            height: 178px;
            border-radius: 0 0 8px 8px;
         }
      }
   }


   &__head {

      overflow-y: hidden !important;

      &-autosalon {
         border-radius: 8px 8px 0 0;
         margin-bottom: 0;
         padding-left: 32px;
         flex-wrap: nowrap;
         padding-right: 0;
         width: auto;

         &-container {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            background: #EEF2F6;

            border-radius: 8px 8px 0 0;


         }


         .ma-announcements__head--item {
            white-space: nowrap;
            padding: 24px 12px 20px 12px;
         }
      }
   }

   &-autosalon-title {
      font: 600 20px/24px 'TTHoves';
      margin-bottom: 16px;
   }

   &__body {
      &-autosalon {
         background: #EEF2F6;
         border-radius: 0 0 8px 8px;
         //border-radius: 8px;

         .ma-announcements__body--row__inner {
            width: 100%;
         }

         .ma-announcements__body--row__inner {
            padding: 32px 12px 0px 32px;
            flex-wrap: wrap;
            cursor: initial;
            box-sizing: border-box;
            overflow: hidden;

            &--item-plate {
               margin-bottom: 32px;
               width: 254px;
            }
         }
      }
   }

   .ma-announcements-sort-switch {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      //margin-left: auto;
      padding-top: 8px;
      white-space: nowrap;
      padding-left: 38px;
      padding-right: 35px;

      p {
         font: 400 16px/24px 'TTHoves';
         color: #1b2434;
         margin-bottom: 6px;
      }

      .toggle-wrapper {
         margin: 0 12px;
      }
   }


}

.profile-announcements-loader {
   .loader {
      margin-top: 100px;
      margin-left: 50px;
   }
}

.dark-mode {

   .ma-announcements {
      &__head {
         &-autosalon {
            &-container {
               background: #1b2434;
               //background: transparent;
            }
         }
      }

      &__top-cards {
         .ma-announcements__top-card {
            background: #1B2434;
            border: 1px solid #1b2434;

            &--title {
               color: #fff;
            }

            &--count {
               color: #fff;
            }
         }
      }

      &-sort-switch {
         p {
            color: #EEF2F6 !important;
         }
      }

      &__body {
         &-autosalon {
            background: transparent;

            .ma-announcements__body--row__inner {
               background: #1b2434;

               .announcements-grid__item {
                  .item-details {
                     border: 1px solid rgba(#9AA4B2, .3);
                     border-top: none;
                     border-radius: 0 0 8px 8px;
                  }
               }
            }
         }
      }

      &-autosalon-head {
         background: #1B2434;
      }
   }
}

@media (max-width: 1149px) {
   .ma-announcements-autosalon-container {
      .ma-announcements__body--row__inner--item-plate {
         margin: 0;
         width: 50% !important;
         padding: 9px;

         .announcements-grid__item {
            box-shadow: 0px 0px 16px 0px #0000001A;
         }

      }
   }
}

@media (max-width: 990px) {
   .ma-announcements {
      &__body {
         h4 {
            font: 600 19px/22px 'TTHoves';
         }

         .no-results {
            img {
               width: calc(100% - 100px);
            }
         }
      }

      &__head {
         background: #fff;
         padding-left: 0;
         box-sizing: border-box;
         overflow-y: scroll;
         margin-bottom: 10px;
         padding-bottom: 12px;

         &--item {
            background: #fff;
            border-radius: 50px;
            border: 1px solid #cdd5df;
            color: #697586;
            font: 500 14px/16px 'TTHoves';
            padding: 12px 16px;
            margin-right: 20px;
            white-space: nowrap;

            &:hover {
               background: rgba(#155EEF, 1);
            }

            &--active {
               position: relative;
               background: #155EEF;
               color: #fff;


               &:before {
                  position: relative;
                  bottom: 0;
                  left: 0;
                  width: 0;
                  height: 3px;
                  content: '';
                  background: #155EEF;
                  border-radius: 3px 3px 0 0;

               }
            }
         }

         &-autosalon {
            &-container {
               background: transparent;
            }
         }
      }

      &__top-cards {
         flex-wrap: wrap;
         justify-content: flex-start;
      }

      &__top-card {
         width: calc((100% - 40px) / 3) !important;
         margin: 10px;

         &:nth-of-type(1), &:nth-of-type(4) {
            margin-left: 0;
         }

         &:nth-of-type(3) {
            margin-right: 0;
         }

      }


   }

   .dark-mode {
      .ma-announcements {
         &__head {
            background: #1B2434;
            padding: 4px;
            border-radius: 8px;

            &--item {
               background: transparent;
               color: #697586;
               border: none;
               //margin-bottom: -15px;

               &--active {
                  background: rgba(#718096, .8);
                  border: none;
                  border-radius: 8px;
                  height: 40px;
               }
            }
         }
      }
   }

   .profile-announcements-loader {
      .loader {
         margin-top: 250px;

      }
   }

   .ma-announcements-autosalon-container {
      background: transparent;

      .ma-announcements {
         &__body {
            &-autosalon {
               background: transparent;

               .ma-announcements__body--row__inner {
                  padding: 0;
                  background: transparent;
                  width: 100%;
                  border-radius: 8px;

                  .ma-announcements__body--row__inner--item-plate {
                     margin: 0;
                     width: 50%;
                     padding: 9px;

                     .announcements-grid__item {
                        box-shadow: 0px 0px 16px 0px #0000001A;
                     }

                  }
               }
            }
         }
      }
   }

   .dark-mode{
      .ma-announcements__head-autosalon-container {
         background: #121926 !important;
      }
   }
}

@media(max-width: 600px) {
   .ma-announcements {
      &__top-card {
         width: calc(50% - 20px) !important;
         margin: 10px !important;
         display: flex;

         &__content {
            padding-left: 12px;
         }

         &:nth-of-type(odd) {
            margin-left: 0 !important;
         }

         &:nth-of-type(even) {
            margin-right: 0 !important;
         }

         &:last-of-type {
            width: 100% !important;
         }
      }

      &__head {
         padding-left: 0 !important;

         &--item {
            padding: 11px 12px 11px 12px !important;
            margin-right: 12px;
         }

         &-autosalon {
            .profile-announcements-loader {
               .loader {
                  margin-top: 100px;
                  margin-left: 0px;
               }
            }
         }
      }
   }

   .ma-announcements-autosalon-container {
      padding: 0 !important;

      .ma-announcements__body--row {
         margin: 0 -17px;

         &__inner--item-plate {
            margin: 0;
            width: 50% !important;
            padding: 9px;

            .announcements-grid__item {
               box-shadow: 0px 0px 16px 0px #0000001A;
            }

         }
      }

      .ma-announcements {
         &__top-cards {
            justify-content: space-between;
         }

         &__top-card {
            width: calc(50% - 6px) !important;
            margin: 6px 0 !important;
            height: 74px;
            padding: 16px 12px;

            &:last-of-type {
               width: 100% !important;
            }

            &--title {
               font: 500 15px/20px 'TTHoves';
               white-space: nowrap;
            }

            &--count {
               font: 500 17px/20px 'TTHoves';
            }
         }


      }
   }

}





</style>

