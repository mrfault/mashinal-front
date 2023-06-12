<template>
   <div class="registrationMarksGridItem" @click="goToRegistrationMark(item?.id_unique)">
      <div class="registrationMarksGridItem__head">
         <div class="divider">
            <inline-svg src="/icons/registrationMarks_icons.svg" />
         </div>

         <div class="divider">
            <h3>{{ item?.car_number }}</h3>
         </div>
      </div>

      <div class="registrationMarksGridItem__main">
         <div class="divider">
            <p>{{ item?.price }}</p>

            <add-favorite :announcement="item" v-if="showFavoriteBtn" />

            <form-checkbox
               v-if="checkbox"
               :value="check"
               :input-name="`selected_${item.id_unique}`"
               :stop-propagation="true"
               transparent
               @input="handleChange(item)"
            />
         </div>

         <div class="divider" v-if="!moreInfo">
            <p>{{ item?.user?.full_name }}</p>
         </div>

         <div class="divider info">
            <p v-if="!moreInfo" class="d-flex align-items-center justify-content-between w-100">
               <span class="d-flex align-items-center">
                  <inline-svg :src="'/icons/calendar-3.svg'" />
                  <span v-if="shortDate">{{ item?.humanize_short_created_at }}</span>
                  <span v-else>{{ item?.humanize_created_at }}</span>
               </span>

               <span class="d-flex align-items-center">
                  <inline-svg :src="'/icons/location.svg'" />

                  <span>{{ item?.region?.name[locale] }}</span>
               </span>
            </p>

            <p v-else class="d-flex align-items-center justify-content-between w-100">
               <span class="d-flex align-items-center">
                  <inline-svg :src="'/icons/calendar-2.svg'" :width="'20px'" :height="'20px'"/>

                  <span>{{ modifiedDate(item?.humanize_created_at) }}</span>
               </span>

               <span class="d-flex align-items-center">
                  <inline-svg :src="'/icons/eye-2.svg'" :width="'20px'" :height="'20px'"/>

                  <span>{{ item?.view_count }}</span>
               </span>

               <span class="d-flex align-items-center">
                  <inline-svg :src="'/icons/phone-2.svg'" :width="'20px'" :height="'20px'"/>

                  <span>{{ item?.show_phone_number_count }}</span>
               </span>
            </p>
         </div>

         <div class="divider" v-if="moreInfo">
            <div class="registrationMarksGridItem__status">
               <span v-if="item.status === 0">{{ $t('rejected_2') }}</span>
               <span v-else-if="item.status === 1">{{ $t('active_2') }}</span>
               <span v-else-if="item.status === 2">{{ $t('under_consideration') }}</span>
               <span v-else-if="item.status === 3">{{ $t('sold') }}</span>
               <span v-else-if="item.status === 7">{{ $t('need_pay') }}</span>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
   import AddFavorite from '~/components/announcements/AddFavorite'

   export default {
      components: {
         AddFavorite
      },

      data() {
        return {
           check: false
        }
      },

      props: {
         item: {
            type: Object,
            default() { return {} }
         },

         moreInfo: {
            type: Boolean,
            default: false
         },

         shortDate: {
            type: Boolean,
            default: false
         },

         showFavoriteBtn: {
            type: Boolean,
            default: false
         },

         checkbox: {
            type: Boolean,
            default: false
         }
      },

      methods: {
         goToRegistrationMark(id) {
            this.$router.push(this.localePath(`/registration-marks/${id}`));
         },

         modifiedDate(date) {
            return `${date.split(' ')[0]} ${date.split(' ')[1].slice(0, 3)}`;
         },

         handleChange(item) {
            this.$nuxt.$emit('select-mark', item.id_unique);
            // this.$nuxt.$emit('select-announcement', this.item.id_unique, value, true);
         }
      }
   }
</script>

<style lang="scss">
   .registrationMarksGridItem {
      display: inline-block;
      width: 256px;
      border-radius: 8px;
      border: 1px solid #CDD5DF;
      background-color: #FFFFFF;
      height: max-content;
      margin: 0 0 24px 20px;
      cursor: pointer;

      &__head {
         display: flex;
         align-items: center;
         margin: -1px 0 0 -1px;
         width: 101%;
         height: 50px;
         padding: 0 8px;
         border-radius: 5px;
         border: 5px solid #000000;

         .divider {
            &:first-child {
               margin-right: 7px;
            }

            &:last-child {
               margin: 0 auto;
            }
         }

         h3 {
            //font-family: 'Din', sans-serif;
            //font-family: 'DinMittelschrift', sans-serif;
            font-family: 'DinMittelschriftgepraegt', sans-serif;
            font-weight: 400;
            font-size: 38px;
            line-height: 44px;
            letter-spacing: -1px;
            color: #1B2434;
            margin: 0;
         }
      }

      &__main {
         padding: 18px;

         .divider {
            display: flex;
            align-items: center;
            justify-content: space-between;

            &:not(:first-child) {
               margin-top: 8px;
            }

            &:first-child {
               p {
                  font-weight: 600;
                  font-size: 20px;
                  line-height: 24px;
                  color: #00359E;
               }
            }

            &:nth-child(2) {
               p {
                  text-overflow: ellipsis;
                  overflow: hidden;
                  white-space: nowrap;

                  font-weight: 500;
                  font-size: 20px;
                  line-height: 24px;
                  color: #364152;
               }
            }

            &:last-child {
               p {
                  font-weight: 500;
                  font-size: 14px;
                  line-height: 17px;
                  color: #697586;
               }
            }

            &.info {
               p {
                  font-weight: 500;
                  font-size: 14px;
                  line-height: 17px;
                  color: #697586;

                  span {
                     font-weight: 400;
                     text-overflow: ellipsis;
                     overflow: hidden;
                     white-space: nowrap;

                     &:not(:first-child) {
                        margin-left: 8px;
                     }

                     span {
                        margin: 2px 0 0 5px !important;
                     }
                  }
               }
            }
         }

         p {
            margin: 0;
         }

         .form-group {
            width: unset;

            .cursor-pointer {
               padding: 0;

               .checkbox {
                  margin: 0;
               }
            }
         }
      }

      &__status {
         display: flex;
         align-items: center;
         justify-content: center;
         margin-top: 5px;
         width: 100%;
         padding: 8px;
         border-radius: 6px;
         background-color: #E3E8EF;

         span {
            font-weight: 600;
            font-size: 15px;
            line-height: 18px;
            color: #121926;
         }
      }
   }

   @media (max-width: 1150px) {
      .registrationMarksGridItem {
         width: 220px;

         &__head {
            h3 {
               font-size: 33px;
            }
         }
      }
   }

   @media (max-width: 992px) {
      .registrationMarksGridItem {
         justify-content: unset;
         margin: 0 0 25px 0;
         width: 48%;
      }
   }

   @media (max-width: 540px) {
      .registrationMarksGridItem {
         &__head {
            border-width: 4px;
         }
      }
   }

   @media (max-width: 500px) {
      .registrationMarksGridItem {
         &__head {
            h3 {
               font-size: 32px;
            }
         }

         &__main {
            .divider {
               &.info {
                  svg {
                     display: none;
                  }

                  p {
                     span {
                        &:not(:first-child) {
                           margin-left: unset !important;
                        }
                     }
                  }
               }
            }
         }
      }
   }

   @media (max-width: 470px) {
      .registrationMarksGridItem {
         &__head {
            h3 {
               font-size: 30px;
            }
         }

         &__main {
            .divider {
               &:first-child {
                  p {
                     font-weight: 700;
                     font-size: 18px;
                     line-height: 22px;
                  }
               }

               &:nth-child(2) {
                  p {
                     font-weight: 600;
                     font-size: 15px;
                     line-height: 18px;

                  }
               }
            }

            .white-background {
               width: 18px;
               height: 18px;
            }
         }
      }
   }

   @media (max-width: 450px) {
      .registrationMarksGridItem {
         &__head {
            border-width: 3px;

            h3 {
               font-size: 28px;
            }
         }
      }
   }

   @media (max-width: 425px) {
      .registrationMarksGridItem {
         margin: 0 0 15px 0;

         &__head {
            height: 40px;

            svg {
               width: 18px;
            }

            h3 {
               font-size: 25px;
            }
         }

         &__main {
            padding: 18px 12px 12px 12px;
         }
      }
   }

   @media (max-width: 385px) {
      .registrationMarksGridItem {
         width: 47%;

         &__head {
            h3 {
               font-size: 20px;
            }
         }
      }
   }
</style>
