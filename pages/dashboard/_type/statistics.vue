<template>
   <div class="pages-dashboard-statistics pt-2 pt-lg-5">
      <div class="container">
         <ComeBack :text="$t('statistics')" v-if="isMobileBreakpoint" />

         <breadcrumbs :crumbs="crumbs" />

         <!--         <div class="card mb-2 mb-lg-3" v-if="isMobileBreakpoint">-->
         <!--            <h2 class="title-with-line mb-n1 mt-n1">-->
         <!--               <span>{{ $t('statistics') }}</span>-->
         <!--            </h2>-->
         <!--         </div>-->

         <div class="pages-dashboard-statistics__inner">
            <div class="divider">
               <div class="pages-dashboard-statistics__content">
                  <CustomRadio
                     :type="'template-2'"
                     :title="$t('ad_sorting')"
                     :options="radioOptions"
                     v-model="sorting"
                  />
               </div>

               <div class="pages-dashboard-statistics__content">
                  <inline-svg :src="'/icons/phone-3.svg'"/>

                  <h4 class="pages-dashboard-statistics__content-text">{{ $t('total_calls') }}</h4>

                  <h4 class="pages-dashboard-statistics__content-subtext">{{ mostViewedCount }}</h4>
               </div>
            </div>

            <div class="card full-height mb-2 mb-lg-0">
               <div class="statistics-announcements full-height py-5">
                  <div class="circle-bar" v-for="(stat, i) in countStats" :key="i">
                     <div class="circle-bar_filled" :style="{borderColor: stat.color, color: stat.color}">
                        <strong>{{ stat.value }}</strong>
                     </div>

                     <div class="circle-bar_info">
                        <span>{{ $t(stat.label) }}</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <grid
            v-if="mostViewed.length"
            :announcements="mostViewed"
            :title="$t('most_viewed_announcements')"
            :show-phone-count="true"
            :track-views="false"
         />
      </div>
   </div>
</template>

<script>
   import {mapGetters, mapActions} from 'vuex';
   import {StatsMixin} from '~/mixins/statistics';
   import Grid from '~/components/announcements/Grid';
   import CustomRadio from "~/components/elements/CustomRadio.vue";
   import ComeBack from "~/components/elements/ComeBack.vue";

   export default {
      name: 'pages-dashboard-statistics',
      middleware: 'auth_salon',
      mixins: [StatsMixin],
      components: {
         Grid,
         CustomRadio,
         ComeBack
      },

      nuxtI18n: {
         paths: {
            az: '/idareetme-paneli/:type/statistika'
         }
      },

      head() {
         return this.$headMeta({
            title: this.$t('statistics')
         });
      },

      data() {
         return {
            sorting: 1,
            radioOptions: [
               {key: 1, name: this.$t('sorting_view')},
               {key: 2, name: this.$t('sorting_call')}
            ]
         }
      },

      async asyncData({store, route, app}) {
         await store.dispatch('getAnnouncementStats', {id: app.$getDashboardId(route.params.type)});
      },

      computed: {
         ...mapGetters([]),

         crumbs() {
            return [
               {name: this.$t('dashboard'), route: '/dashboard/' + this.$route.params.type},
               {name: this.$t('statistics')}
            ]
         },

         mostViewedCount() {
            let count = 0;
            this.mostViewed.forEach(item => {
               count += item.show_phone_number_count;
            })

            return count;
         }
      },

      methods: {
         ...mapActions([]),
      },

      watch: {
         sorting() {
            this.$store.dispatch('getAnnouncementStats', {
               id: this.$getDashboardId(this.$route.params.type),
               params: `?sorting=${this.sorting}`
            });
         }
      }
   }
</script>

<style lang="scss" scoped>
   .pages-dashboard-statistics {
      &__inner {
         display: flex;
         justify-content: space-between;
         gap: 20px;

         .divider {
            width: 100%;
            max-width: 260px;
         }
      }

      &__content {
         padding: 18px;
         border-radius: 4px;
         text-align: center;
         background-color: #FFFFFF;

         &:not(:first-child) {
            margin-top: 20px;

            .pages-dashboard-statistics__content {
               &-text {
                  margin: 10px 0 20px 0;
               }
            }
         }

         &-text {
            font-weight: 500;
            font-size: 14px;
            line-height: 18px;
            color: #081A3E;
            margin: 0;
         }

         &-subtext {
            font-weight: 500;
            font-size: 18.9555px;
            line-height: 23px;
            color: #F81734;
            margin: 0;
         }
      }

      .card {
         width: 100%;
         max-width: 920px;
         padding: 25px 0;
      }
   }

   .dark-mode {
      .pages-dashboard-statistics {
         &__content {
            background-color: #242426;

            &-text {
               color: #FFFFFF;
            }
         }
      }
   }

   @media (max-width: 1250px) {
      .pages-dashboard-statistics {
         &__inner {
            .statistics-announcements {
               padding-bottom: 0 !important;
            }

            .circle-bar {
               margin-bottom: 40px;
            }
         }
      }
   }

   @media (max-width: 1025px) {
      .pages-dashboard-statistics {
         &__inner {
            flex-direction: column;

            .card {
               margin: 0;
            }
         }

         .divider {
            max-width: unset;
         }

         &__content {
            padding: 18px 100px;
         }
      }
   }

   @media (max-width: 500px) {
      .pages-dashboard-statistics {
         &__content {
            padding: 18px 50px;
         }
      }
   }

   @media (max-width: 425px) {
      .pages-dashboard-statistics {
         &__content {
            padding: 20px;
         }
      }
   }
</style>
