<template>
   <div :key="refresh" class="pages-annoucements pt-2 pt-lg-6">
      <portal to="breadcrumbs">
         <breadcrumbs :crumbs="crumbs"/>
      </portal>
      <div class="container">
         <div class="ma-announcements">
            <h2 class="ma-title--md">{{ $t('my_announces') }}</h2>
            <div v-if="user.autosalon" class="ma-announcements__top-cards">
               <div v-for="(item,index) in topCards" :key="index + 8923764" class="ma-announcements__top-card">
                  <div class="ma-announcements__top-card--image">
                     <inline-svg :src="`/new-icons/announcements/${item.image}.svg`"/>
                  </div>
                  <div class="ma-announcements__top-card--title">{{ $t(item.name) }}</div>
                  <div class="ma-announcements__top-card--count">{{ $t(item.value) || 0 }}</div>
               </div>
            </div>
            <div class="ma-announcements__head">
               <button
                  v-for="(item,index) in announceItems"
                  :class="{'ma-announcements__head--item--active': item.id == activeTab}"
                  class="ma-announcements__head--item"
                  @click="changeTab(item)"
               >
                  {{ $t(item.title) }}
               </button>
            </div>
         </div>
         <div class="ma-announcements__body">
            <h4 v-if="!loading" class="ma-subtitle--lg">{{ $t('my_vehicle_announcements') }}</h4>
            <div id="announcementsContainer" :class="{'overflow-x-hidden': !myAnnouncements.length}"
                 class="ma-announcements__body--row" @mousedown.prevent="startDragging">
               <!--                                loading-->
               <div v-if="loading">
                  <loader/>
               </div>
               <div v-else-if="!loading && myAnnouncements && myAnnouncements.length"
                    class="ma-announcements__body--row__inner">
                  <template v-for="(announcement,index) in myAnnouncements">
                     <div
                        class="ma-announcements__body--row__inner--item-plate"
                     >
                        <grid-item
                           :key="announcement.id_unique +  '_' + index"
                           :announcement="announcement"
                           :isLastChild="index === myAnnouncements.length - 1"
                           clickable
                           isProfilePage
                           show-monetization-actions
                           show-overlay
                           show-phone-count
                           show-status
                           track-views
                           :activeTab="activeTab"
                        />
                     </div>
                  </template>
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
            <h4 v-if="!loading" class="ma-subtitle--lg">{{ $t('my_car_number_announcements') }}</h4>
            <div id="platesContainer" :class="{'overflow-x-hidden': !allMyPlates.length}"
                 class="ma-announcements__body--row" @mousedown.prevent="startDragging">
               <div v-if="loading" style="height: 420px !important;width:100%; display: flex;justify-content: center;">
                  <loader/>
               </div>
               <div v-else-if="allMyPlates.length" class="ma-announcements__body--row__inner">
                  <template v-for="(item,index) in allMyPlates">
                     <div
                        class="ma-announcements__body--row__inner--item-plate"

                     >
                        <plates-grid-item
                           :key="index"
                           :isLastChild="index === allMyPlates.length - 1"
                           :item="item"
                           is-profile-page
                           moreInfo
                           :activeTab="activeTab"

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
// import tr from "vue2-datepicker/locale/es/tr";

export default {
   name: 'pages-profile-announcements',
   middleware: 'auth_general',
   layout: 'garageLayout',
   data() {
      return {
         activeTab: null,
         loading: false,
         announceItems: [
            {
               id: null,
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
      if (this.user?.autosalon?.id)
      this.getStatistics();
      this.$nuxt.$on('refresh-my-announcements', () => this.refresh++);
      const announcementsContainer = document.getElementById('announcementsContainer');
      announcementsContainer.addEventListener('mousedown', this.startDragging);

      const platesContainer = document.getElementById('platesContainer');
      platesContainer.addEventListener('mousedown', this.startDragging);



   },
   async asyncData({store, route}) {
      let status = ['0', '1', '2', '3'].includes(route.query.status) ? parseInt(route.query.status) : '';
      let shop = ['1', '2'].includes(route.query.type) ? (route.query.type == 2 ? 'part' : 'salon') : false;

      await Promise.all([
         store.dispatch('getMyAllAnnouncementsV2', {status, shop}),
         store.dispatch('fetchPlatesV2', {status}),
      ]);

      return {
         pending: false,
         statusReady: status,
         form: {status},
         refresh: 0,
      }
   },
   methods: {
      ...mapActions({
         getMyAllAnnouncements: 'getMyAllAnnouncementsV2',
         getMyPlates: 'fetchPlatesV2',
      }),

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
         this.statusReady = this.form.status;
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

      getStatistics() {
         this.$store.dispatch('getAutosalonStatistics',this.user.autosalon.id)
         console.log("this.user.autosalon",this.user.autosalon)
      }

   },
   computed: {
      ...mapGetters({
         myAnnouncements: 'myAnnouncementsV2',
         allMyPlates: 'myPlatesV2',
         autosalonStatistics: 'autosalonStatistics',

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
      }
   }
}
</script>


<style lang="scss">
.ma-announcements__top-cards {
   display: flex;
   justify-content: space-between;
   margin-bottom: 40px;

   .ma-announcements__top-card {
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
}

@media (max-width: 991px) {
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
}

@media(max-width: 600px) {
   .ma-announcements {
      &__top-card {
         width: calc(50% - 20px) !important;
         margin: 10px !important;

         &:nth-of-type(odd) {
            margin-left: 0 !important;
         }

         &:nth-of-type(even) {
            margin-right: 0 !important;
         }
      }
   }
}

.dark-mode {
   .ma-announcements {
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


   }

}


.ma-announcements__body--row__inner, .ma-announcements__body--row__inner--item-plate {
   .stratch-child-block {
      height: 100% !important;
      min-height: auto !important;
   }
}
</style>

