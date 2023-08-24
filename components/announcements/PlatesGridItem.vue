<template>
   <div :class="{'position-relative': isProfilePage}" class="registrationMarksGridItem"
        @click="goToRegistrationMark(item?.id_unique, $event)">
      <div class="registrationMarksGridItem__head">
         <div class="divider">
            <inline-svg src="/icons/registrationMarks_icons.svg"/>
         </div>

         <div class="divider">
            <h3>{{ item?.car_number }}</h3>
         </div>
      </div>

      <!--      <span v-if="isProfilePage" style="position: relative; width: 28px; height: 24px;">-->
      <profile-grid-actions
         v-if="isProfilePage && item.status !==2"
         :announcement="item"
         :class="{'right-aligned-dropdown': isLastChild}"
         :dropdown-id="item.id_unique"
         is-number-plate
      />
      <!--            </span>-->

      <div class="registrationMarksGridItem__main">
         <div class="divider">
            <p>{{ item?.price }}</p>


            <add-favorite v-if="showFavoriteBtn" :announcement="item" :whiteBorder="false"/>

            <form-checkbox
               v-if="checkbox"
               :input-name="`selected_${item.id_unique}`"
               :stop-propagation="true"
               :value="check"
               transparent
               @input="handleChange(item)"
            />
         </div>

         <div v-if="!moreInfo" class="divider">
            <p>{{ item?.user?.full_name }}</p>
         </div>

         <div class="divider info">
            <p v-if="!moreInfo" class="d-flex align-items-center justify-content-between w-100">
               <span class="d-flex align-items-center">
                  <inline-svg :src="'/icons/calendar-3.svg'"/>
                  <span v-if="shortDate">{{ item?.humanize_short_created_at }}</span>
                  <span v-else>{{ item?.humanize_created_at }}</span>
               </span>

               <span class="d-flex align-items-center">
                  <inline-svg :src="'/icons/location.svg'"/>

                  <span>{{ item?.region?.name[locale] }}</span>
               </span>
            </p>

            <p v-if="false" class="d-flex align-items-center justify-content-between w-100">
               <span class="d-flex align-items-center">
                  <inline-svg :height="'20px'" :src="'/icons/calendar-2.svg'" :width="'20px'"/>

                  <span>{{ modifiedDate(item?.humanize_created_at) }}</span>
               </span>

               <span class="d-flex align-items-center" v-if="item.status !== 2">
                  <inline-svg :height="'20px'" :src="'/icons/eye-2.svg'" :width="'20px'"/>

                  <span>{{ item?.view_count }}</span>
               </span>

               <span class="d-flex align-items-center" v-if="item.status !== 2">
                  <inline-svg :height="'20px'" :src="'/icons/phone-2.svg'" :width="'20px'"/>

                  <span>{{ item?.show_phone_number_count }}</span>
               </span>
            </p>

            <div v-if="moreInfo" class="w-100 item-details__item d-flex justify-csb">
               <span class="ma-announcement-card__stats">
                                 <inline-svg src="/new-icons/grid/cards/phone.svg"/>
                  <p>{{ item.show_phone_number_count || 0 }}</p>

               </span>
               <span  class="ma-announcement-card__stats">
                            <inline-svg src="/new-icons/grid/cards/eye.svg"/>
                  <p>{{ item.view_count || 0 }}</p>

               </span>
               <span  class="ma-announcement-card__stats">
                   <inline-svg src="/new-icons/grid/cards/calendar.svg"/>
                  <p> {{ modifiedDate(item?.humanize_created_at) }}</p>

               </span>
            </div>
         </div>

         <div v-if="moreInfo" class="divider">
            <div
               :class="{'green': item.status === 1,'yellow': item.status === 2,'pink': item.status === 3,'pink': item.status === 7}"
               class="registrationMarksGridItem__status">
               <span v-if="item.status === 0">{{ $t('rejected_2') }}</span>
               <span v-else-if="item.status === 1">{{ $t('active_2') }}</span>
               <span v-else-if="item.status === 2">{{ $t('under_consideration_2') }}</span>
               <span v-else-if="item.status === 3">{{ $t('inactive') }}</span>
               <span v-else-if="item.status === 7">{{ $t('need_pay') }}</span>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import AddFavorite from '~/components/announcements/AddFavorite'
import ProfileGridActions from "~/components/profile/ProfileGridActions";

export default {
   components: {
      AddFavorite,
      ProfileGridActions
   },

   data() {
      return {
         check: false
      }
   },

   props: {
      item: {
         type: Object,
         default() {
            return {}
         }
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
      },
      isProfilePage: Boolean,
      isLastChild: Boolean,
   },

   methods: {
      goToRegistrationMark(id, event) {

         event.stopPropagation();
         event.preventDefault();
         this.$router.push(this.localePath(`/plates/${id}`));

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
   border-radius: 8px;
   border: 1px solid #CDD5DF;
   background-color: #FFFFFF;
   cursor: pointer;
   transition: all .3s;

   &:hover {
      box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.12);
   }

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

      &.pink {
         background-color: #FEE4E2 !important;
      }

      &.green {
         background-color: #D1FADF !important;
      }

      &.yellow {
         background-color: #FEF0C7 !important;
      }

      &.gray {
         background-color: #EEF2F6 !important;
      }
   }
}

@media (max-width: 1150px) {
   .registrationMarksGridItem {
      &__head {
         h3 {
            font-size: 33px;
         }
      }
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
      &__head {
         h3 {
            font-size: 20px;
         }
      }
   }
}

.dark-mode {
   .registrationMarksGridItem__status {
      span {
         color: #121926 !important;
      }
   }
}
</style>
