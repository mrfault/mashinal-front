<template>
   <div class="plate-id">
      <div class="bg-white">
         <div class="container">
            <div class="announcements-inner">
               <breadcrumbs :crumbs="crumbs" />

               <div class="row flex-column flex-lg-row">
                  <div class="col-auto">
                     <div class="wrapp">
                        <client-only>
                           <div
                              class="plate-id__registrationMark"
                              :style="{ background: `url(/images/registration-marks/car_${count}.png) center center / contain no-repeat`}"
                           >
                              <div class="registrationMarks__number">
                                 <div class="divider">
                                    <img src="/icons/registrationMarks_icons.svg" alt="icons">
                                 </div>

                                 <div class="divider">
                                    <p>{{ registrationMark.car_number }}</p>
                                 </div>

                                 <span class="registrationMarks__number-description">MASHIN.AL</span>
                              </div>

                              <!-- <add-favorite :announcement="registrationMark"  :type="'registrationMark'"/>-->
                           </div>
                        </client-only>
                     </div>

                     <comment :comment="registrationMark.comment" v-if="registrationMark.comment && !isMobileBreakpoint"></comment>
                  </div>

                  <div class="col-auto">
<!--                     <quick-info type="plates" />-->
                  </div>

                  <div class="col-auto" v-if="isMobileBreakpoint">
                     <comment :comment="registrationMark.comment" v-if="registrationMark.comment"></comment>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div class="container">
         <PlatesGrid
            :items="registrationMarks?.data"
            :showFavoriteBtn="true"
            v-if="registrationMarks?.data.length"
         >
            <template #head>
               <Cap :className="'mb40'">
                  <template #left>
                     <h3>{{ $t('relative_announcements') }}</h3>
                  </template>
               </Cap>
            </template>
         </PlatesGrid>

<!--         <div v-if="isMobileBreakpoint && registrationMark.status != 3" class="mt-3 mt-lg-0">-->
<!--            <floating-cta :announcement="registrationMark"/>-->
<!--         </div>-->

         <HandleIds :single="true" :items="{ type: 'plate', id: registrationMark.id }" />
      </div>
   </div>
</template>

<script>
   import { mapGetters } from 'vuex';
   import QuickInfo from '~/components/announcements/inner/QuickInfo.vue';
   import Comment from '~/components/announcements/inner/Comment.vue';
   import AddFavorite from "~/components/announcements/AddFavorite.vue";
   import PlatesGrid from "~/components/announcements/PlatesGrid.vue";
   import FloatingCta from "~/components/announcements/inner/FloatingCta.vue";
   import HandleIds from "~/components/announcements/HandleIds.vue";
   import Cap from "~/components/elements/Cap.vue";

   export default {
      name: 'pages-marks-id',

      head() {
         return this.$headMeta({
            title: this.$t('registration_marks'),
         });
      },

      // middleware: ['auth_general'],

      components: {
         QuickInfo,
         Comment,
         AddFavorite,
         PlatesGrid,
         FloatingCta,
         HandleIds,
         Cap
      },

      nuxtI18n: {
         paths: {
            az: '/nomreler/elan/:id'
         }
      },

      data() {
         return {
            count: 1
         }
      },

      methods: {
         changeCarImg() {
            let local = localStorage.getItem('registrationCount');
            if (local && Number(local) <= 9) {
               let currentCount = Number(local);

               localStorage.setItem('registrationCount', currentCount + 1);
               this.count = Number(localStorage.getItem('registrationCount'));
            } else {
               localStorage.setItem('registrationCount', 1);
            }
         }
      },

      mounted() {
         this.changeCarImg();
      },

      async asyncData({ store, route }) {
         await Promise.all([
            store.dispatch('fetchRegistrationMark', route.params?.id?.slice(0, route?.params?.id?.length - 1)),
            store.dispatch('fetchRegistrationMarks')
         ]);
      },

      computed: {
         ...mapGetters({
            registrationMark: 'announcement',
            registrationMarks: 'getRegistrationMarks',
         }),

         crumbs() {
            return [
               { name: this.$t('registration_marks'), route: '/plates' },
               { name: this.registrationMark.car_number }
            ]
         }
      }
   }
</script>

<style lang="scss">
   .plate-id {
      padding-bottom: 20px;

      .bg-white {
         padding-bottom: 56px;
      }

      .wrapp {
         background-color: #FFFFFF;
         margin-bottom: 20px;
      }

      &__registrationMark {
         position: relative;
         width: 100%;
         height: 600px;
         border-radius: 12px;
         border: 1px solid #CDD5DF;
         overflow: hidden;

         .white-background {
            position: absolute;
            left: 30px;
            bottom: 30px;
            padding: 15px;
            border: 1px solid silver;
         }
      }

      .registrationMarks__number {
         position: absolute;
         top: 345px;
         left: 271px;
         display: flex;
         align-items: center;
         padding: 0 6px;
         border: 7px solid #121926;
         border-bottom-width: 14px;
         background-color: #FFFFFF;
         border-radius: 4px;

         &-description {
            position: absolute;
            left: 50%;
            bottom: -12px;
            transform: translateX(-50%);
            font-family: 'DinMittelschriftgepraegt', sans-serif;
            font-size: 8px;
            line-height: 9px;
            color: #FFFFFF;
         }

         .divider {
            &:not(:first-child) {
               margin-left: 10px;
            }

            img {
               width: 16px;
            }

            p {
               font-family: 'DinMittelschriftgepraegt', sans-serif;
               font-weight: 400;
               font-size: 30px;
               line-height: 32px;
               letter-spacing: -0.5px;
               color: #1B2434;
               margin: 0;
            }
         }
      }

      .registrationMarksGrid {
         margin-top: 56px;

         &__head {
            a {
               display: flex;
               align-items: center;
               font-weight: 600;
               font-size: 18px;
               line-height: 20px;
               text-decoration-line: underline;
               color: #121926;

               svg {
                  margin-left: 8px;
               }
            }
         }
      }
   }

   .dark-mode {
      .plate-id {
         background-color: #1B2434;

         &__registrationMark {
            border-color: transparent;
         }

         .bg-white {
            background-color: #121926 !important;
         }

         .quick-info {
            .registration-marks__number {
               border-color: #1B2434;
            }
         }

         .quickInfoPrice {
            &.plates {
               p {
                  color: #EEF2F6;
               }
            }
         }

         .announcements-inner {
            .wrapp {
               background-color: transparent;
               overflow: hidden;
               //border-radius: 12px;
            }
         }
      }
   }

   @media (max-width: 1250px) {
      .plate-id {

         &__registrationMark {
            height: 450px;
         }

         .registrationMarks__number {
            top: 270px;
            left: 285px;
            border-width: 5px;
            border-bottom-width: 12px;

            &-description {
               font-size: 7px;
               bottom: -11.5px;
            }

            .divider {

               &:not(:first-child) {
                  margin-left: 7px;
               }

               img {
                  width: 13px;
               }

               p {
                  font-size: 25px;
                  line-height: 27px;
               }
            }
         }
      }
   }

   @media (max-width: 1150px) {
      .plate-id {
         .announcement-comment {
            margin-bottom: 20px;
         }

         .registrationMarks__number {
            top: 275px;
            left: 390px;
         }

         .announcements-inner {
            padding-bottom: 0;
         }

         .quick-info {
            &.registration-marks {
               .registration-marks__number {
                  padding: 0 15px;
                  margin: 0;

                  .divider {
                     img {
                        width: 40px;
                     }

                     p {
                        font-size: 90px;
                        line-height: 85px;
                     }
                  }
               }

               .price {
                  margin-top: 110px;
               }
            }
         }
      }
   }

   @media (max-width: 992px) {
      .plate-id {
         &__registrationMark {
            height: 400px;
         }

         .registrationMarks__number {
            top: 240px;
            left: 195px;
         }
      }
   }

   @media (max-width: 600px) {
      .plate-id {
         .quick-info {
            &.registration-marks {
               .registration-marks__number {
                  .divider {
                     p {
                        font-size: 80px;
                        line-height: 85px;
                     }
                  }
               }

               .price {
                  margin-top: 110px;
               }
            }
         }
      }
   }

   @media (max-width: 540px) {
      .plate-id {
         .registrationMarks__number {
            left: 50%;
            transform: translateX(-50%);

            .divider {
               p {
                  font-size: 20px;
                  line-height: 24px;
               }
            }
         }

         .quick-info {
            &.registration-marks {
               .registration-marks__number {
                  .divider {
                     p {
                        font-size: 73px;
                        line-height: 80px;
                     }
                  }
               }
            }
         }
      }
   }

   @media (max-width: 485px) {
      .plate-id {
         &__registrationMark {
            height: 350px;
         }

         .registrationMarks__number {
            top: 205px;
         }

         .quick-info {
            &.registration-marks {
               .registration-marks__number {
                  .divider {
                     p {
                        font-size: 67px;
                        line-height: 70px;
                     }
                  }
               }
            }
         }
      }
   }

   @media (max-width: 450px) {
      .plate-id {
         &__registrationMark {
            height: 330px;
         }

         .registrationMarks__number {
            top: 190px;

            .divider {
               img {
                  width: 10px;
               }

               p {
                  font-size: 17px;
                  line-height: 22px;
               }
            }
         }

         .quick-info {
            &.registration-marks {
               .registration-marks__number {
                  .divider {
                     img {
                        width: 35px;
                     }

                     p {
                        font-size: 63px;
                        line-height: 68px;
                     }
                  }
               }
            }
         }
      }
   }

   @media (max-width: 430px) {
      .plate-id {
         .registrationMarks__number {
            //top: 225px;
         }

         .quick-info {
            &.registration-marks {
               .registration-marks__number {
                  .divider {
                     p {
                        font-size: 60px;
                        line-height: 65px;
                     }
                  }
               }
            }
         }
      }
   }

   @media (max-width: 405px) {
      .plate-id {
         .registrationMarks__number {
            .divider {
               p {
                  font-size: 15px;
                  line-height: 20px;
               }
            }
         }

         .quick-info {
            &.registration-marks {
               .registration-marks__number {
                  .divider {
                     img {
                        width: 32px;
                     }

                     p {
                        font-size: 57px;
                        line-height: 62px;
                     }
                  }
               }

               .price {
                  margin-top: 100px;
               }
            }
         }
      }
   }

   @media (max-width: 385px) {
      .plate-id {
         .quick-info {
            &.registration-marks {
               .registration-marks__number {
                  .divider {
                     img {
                        width: 30px;
                     }

                     p {
                        font-size: 50px;
                        line-height: 57px;
                     }
                  }
               }

               .price {
                  margin-top: 90px;
               }
            }
         }
      }
   }

   @media (max-width: 370px) {
      .plate-id {
         .registrationMarks__number {
            //top: 223px;

            .divider {
               p {
                  font-size: 14px;
                  line-height: 17px;
               }
            }
         }

         .quick-info {
            &.registration-marks {
               .registration-marks__number {
                  .divider {
                     img {
                        width: 25px;
                     }

                     p {
                        font-size: 47px;
                     }
                  }
               }

               .price {
                  margin-top: 80px;
               }
            }
         }
      }
   }

   @media (max-width: 350px) {
      .plate-id {
         .quick-info {
            &.registration-marks {
               .registration-marks__number {
                  .divider {

                     p {
                        font-size: 42px;
                     }
                  }
               }
            }
         }
      }
   }
</style>
