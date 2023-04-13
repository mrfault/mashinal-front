<template>
   <div class="pages-cars-id">
      <div class="container">
         <div class="announcements-inner">
            <breadcrumbs :crumbs="crumbs">
               <share-it type="publish"/>

               <span class="text-data">
                  <icon name="eye" />
                  {{ registrationMark.view_count }}
                  <icon name="cursor" />
                  {{ registrationMark.show_phone_number_count }}
                  <icon name="star" />
                  {{ registrationMark.favorites_count }}
               </span>

               <span class="text-data">
                  <icon name="calendar"/>

                  {{ registrationMark.humanize_created_at }}
               </span>
            </breadcrumbs>

            <div class="row flex-column flex-lg-row">
               <div class="col-auto">
                  <div class="wrapp">
                     <div
                        class="pages-cars-id__registrationMark"
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

                        <add-favorite :announcement="registrationMark" />
                     </div>
                  </div>

                  <comment :comment="registrationMark.comment" v-if="registrationMark.comment && !isMobileBreakpoint"></comment>
               </div>

               <div class="col-auto">
                  <quick-info type="registration-marks" />
               </div>
            </div>

            <RegistrationMarksGrid
               :items="registrationMarks?.data"
               :showFavoriteBtn="true"
               v-if="registrationMarks?.data.length"
            >
               <template #head>
                  <h4 class="registrationMarksGrid__title">{{ $t('registration_marks') }}</h4>

                  <nuxt-link :to="$localePath('/registration-marks')">
                     <span>{{ $t('see_all') }}</span>

                     <inline-svg :src="'/icons/arrow-right.svg'" :width="'15px'" />
                  </nuxt-link>
               </template>
            </RegistrationMarksGrid>
         </div>
      </div>
   </div>
</template>

<script>
   import { mapGetters } from 'vuex';

   import QuickInfo from '~/components/announcements/inner/QuickInfo.vue';
   import Comment from '~/components/announcements/inner/Comment.vue';
   import AddFavorite from "~/components/announcements/AddFavorite.vue";
   import RegistrationMarksGrid from "~/components/announcements/RegistrationMarksGrid.vue";

   export default {
      name: 'pages-marks-id',

      head() {
         return this.$headMeta({
            title: this.$t('meta-registration_marks'),
         });
      },

      components: {
         QuickInfo,
         Comment,
         AddFavorite,
         RegistrationMarksGrid
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
         // aaa () {
         //   if(this.count < 10) {
         //      this.count ++
         //   } else {
         //      this.count = 1;
         //   }
         // },
         changeCarImg() {
            if (window.localStorage.getItem('registrationCount') < 11) {
               this.count = Number(window.localStorage.getItem('registrationCount'));
               window.localStorage.setItem('registrationCount', this.count + 1);
            } else {
               window.localStorage.setItem('registrationCount', '1');
            }
         }
      },

      mounted() {
         this.changeCarImg();
      },

      async asyncData({ store, route }) {
         await Promise.all([
            store.dispatch('fetchRegistrationMark', route.params.id.slice(0, route.params.id.length - 1)),
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
               { name: this.$t('registration_marks'), route: '/registration-marks' },
               { name: this.registrationMark.car_number }
            ]
         }
      }
   }
</script>

<style lang="scss">
   .pages-cars-id {
      .wrapp {
         background-color: #FFFFFF;
         margin-bottom: 20px;
      }

      &__registrationMark {
         position: relative;
         width: 100%;
         height: 483px;

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
         top: 297px;
         left: 326px;
         display: flex;
         align-items: center;
         padding: 0 6px;
         border: 7px solid #121926;
         border-bottom-width: 14px;
         margin-bottom: 24px;
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
               font-size: 32px;
               line-height: 32px;
               letter-spacing: -0.5px;
               color: #1B2434;
               margin: 0;
            }
         }
      }

      .registrationMarksGrid {
         margin-top: 48px;

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

   @media (max-width: 1250px) {
      .pages-cars-id {
         &__registrationMark {
            height: 371px;
         }

         .registrationMarks__number {
            top: 220px;
            left: 205px;
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
                  font-size: 23px;
                  line-height: 27px;
               }
            }
         }
      }
   }

   @media (max-width: 1025px) {
      .pages-cars-id {
         .wrapp {
            margin: 0 -25px;
         }

         .registrationMarks__number {
            left: 200px;

            p {
               font-size: 21px;
               line-height: 24px;
            }
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

   @media (max-width: 540px) {
      .pages-cars-id {
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
                        font-size: 80px;
                        line-height: 80px;
                     }
                  }
               }
            }
         }
      }
   }

   @media (max-width: 480px) {
      .pages-cars-id {
         .registrationMarks__number {
            top: 218px;
         }

         .quick-info {
            &.registration-marks {
               .registration-marks__number {
                  .divider {
                     p {
                        font-size: 75px;
                        line-height: 75px;
                     }
                  }
               }
            }
         }
      }
   }

   @media (max-width: 440px) {
      .pages-cars-id {
         .registrationMarks__number {
            top: 216px;

            .divider {
               img {
                  width: 10px;
               }

               p {
                  font-size: 19px;
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
                        font-size: 70px;
                        line-height: 70px;
                     }
                  }
               }
            }
         }
      }
   }

   @media (max-width: 420px) {
      .pages-cars-id {
         .registrationMarks__number {
            top: 214px;

            .divider {
               p {
                  font-size: 18px;
                  line-height: 20px;
               }
            }
         }
      }
   }

   @media (max-width: 400px) {
      .pages-cars-id {
         .registrationMarks__number {
            top: 212px;
         }

         .quick-info {
            &.registration-marks {
               .registration-marks__number {
                  .divider {
                     img {
                        width: 32px;
                     }

                     p {
                        font-size: 65px;
                        line-height: 65px;
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

   @media (max-width: 375px) {
      .pages-cars-id {
         .registrationMarks__number {
            top: 210px;
         }

         .quick-info {
            &.registration-marks {
               .registration-marks__number {
                  .divider {
                     img {
                        width: 30px;
                     }

                     p {
                        font-size: 60px;
                        line-height: 60px;
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

   @media (max-width: 355px) {
      .pages-cars-id {
         .quick-info {
            &.registration-marks {
               .registration-marks__number {
                  .divider {
                     img {
                        width: 25px;
                     }

                     p {
                        font-size: 55px;
                        line-height: 55px;
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
</style>
