<template>
   <div :key="refresh" class="pages-annoucements pt-2 pt-lg-6">
      <portal to="breadcrumbs">
         <breadcrumbs :crumbs="crumbs"/>
      </portal>
      <div class="container">
         <div class="ma-announcements">
            <h2 class="ma-title--md">{{ $t('my_announces') }}</h2>
            <div v-if="showTopCards" class="ma-announcements__top-cards">
               <div v-for="(item,index) in topCards" :key="index + 8923764" class="ma-announcements__top-card">
                  <div class="ma-announcements__top-card--image">
                     <inline-svg :src="`/new-icons/announcements/${item.image}.svg`"/>
                  </div>
                  <div class="ma-announcements__top-card--title">{{ $t(item.name) }}</div>
                  <div class="ma-announcements__top-card--count">{{ $t(item.value) }}</div>
               </div>
            </div>
            <div class="ma-announcements__head">
               <button
                  v-for="(item,index) in announceItems"
                  :class="{'ma-announcements__head--item--active': item.id == activeTab}"
                  class="ma-announcements__head--item"
                  @click="activeTab = item.id"
               >
                  {{ $t(item.title) }}
               </button>
            </div>
         </div>
         <div class="ma-announcements__body">
            <h4 class="ma-subtitle--lg">{{ $t('my_vehicle_announcements') }}</h4>
            <div id="announcementsContainer" class="ma-announcements__body--row" @mousedown="startDragging">
               <div v-if="myAnnouncements.data.length" class="ma-announcements__body--row__inner">
                  <template v-for="(announcement,index) in myAnnouncements.data">
                     <div
                        v-if="activeTab == null || activeTab == announcement.status"
                        class="ma-announcements__body--row__inner--item-plate"
                     >
                        <grid-item
                           :key="announcement.id_unique +  '_' + index"
                           :announcement="announcement"
                           clickable
                           isProfilePage
                           show-monetization-actions
                           show-overlay
                           show-phone-count
                           show-status
                           track-views

                        />
                     </div>
                  </template>
               </div>

               <no-results
                  v-if="myAnnouncements.data.length === 0 || (activeTab !== null && !myAnnouncements.data.some(item => activeTab === item.status))"
                  :text="statusReady !== '' ? '' : $t('add_an_ad_and_thousands_of_potential_buyers_will_see_it')"
                  :type="$route.query.type == 2 ? 'part' : 'car'"
                  darker
               >
                  <nuxt-link v-if="statusReady === ''" :to="$localePath('/sell')" class="btn btn--green mt-2 mt-lg-3"
                             v-html="$t('to_sell')"/>
               </no-results>
            </div>
            <h4 class="ma-subtitle--lg">{{ $t('my_car_number_announcements') }}</h4>
            <div id="platesContainer" class="ma-announcements__body--row" @mousedown="startDragging">
               <div v-if="getMyPlates.data.length" class="ma-announcements__body--row__inner">
                  <template v-for="(item,index) in getMyPlates.data">
                     <div
                        v-if="activeTab == null || activeTab == item.status"
                        class="ma-announcements__body--row__inner--item-plate"
                     >
                        <plates-grid-item
                           :key="index"
                           :item="item"
                           moreInfo
                        />
                     </div>
                  </template>

               </div>
               <no-results
                  v-if="
                     getMyPlates.data.length === 0 ||
                     (activeTab !== null && !getMyPlates.data.some(item => activeTab === item.status))"
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
               title: 'inactive',
               link: "/",
            },
            {
               id: 0,
               title: 'timed_out',
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
      },
      startDragging(event) {
         event.preventDefault(); // Disable content selection while dragging

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

      topCards() {
         return [
            {
               name: 'announcements',
               value: 14,
               image: 'doc'
            },
            {
               name: 'views_count',
               value: 14,
               image: 'eye'
            },
            {
               name: 'favorites',
               value: 14,
               image: 'favorite'
            },
            {
               name: 'messages',
               value: 14,
               image: 'message-text'
            },
            {
               name: 'total_calls',
               value: 14,
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
      &__body{
         h4{
            font: 600 19px/22px 'TTHoves';
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


   }
}

.dark-mode {
   .ma-announcements__top-cards {
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
</style>

