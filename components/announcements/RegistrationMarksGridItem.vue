<template>
   <div class="registrationMarksGridItem" @click="goToRegistrationMark(item.id)">
      <div class="registrationMarksGridItem__head">
         <div class="divider">
<!--            <inline-svg src="/icons/registrationMarks_icons.svg" />-->
            <img src="/icons/registrationMarks_icons.svg" alt="icons">
         </div>
         <div class="divider">
            <h3>{{ item.car_number }}</h3>
         </div>
      </div>

      <div class="registrationMarksGridItem__main">
         <div class="divider">
            <p>{{ item.price }}</p>

            <add-favorite :announcement="item" v-if="!moreInfo" />
         </div>

         <div class="divider" v-if="!moreInfo">
            <p>{{ item.user.full_name }}</p>
         </div>

         <div class="divider info">
            <p v-if="!moreInfo" class="d-flex align-items-center justify-content-between w-100">
               <span>{{ item.created_at }}</span>

               <span>{{ item.region }}</span>
            </p>

            <p v-else class="d-flex align-items-center justify-content-between w-100">
               <span class="d-flex align-items-center">
                  <inline-svg :src="'/icons/calendar-2.svg'" :width="'20px'" :height="'20px'"/>

                  <span>{{ modifiedDate(item.humanize_created_at) }}</span>
               </span>

               <span class="d-flex align-items-center">
                  <inline-svg :src="'/icons/eye-2.svg'" :width="'20px'" :height="'20px'"/>

                  <span>{{ item.view_count }}</span>
               </span>

               <span class="d-flex align-items-center">
                  <inline-svg :src="'/icons/phone-2.svg'" :width="'20px'" :height="'20px'"/>

                  <span>{{ item.show_phone_number_count }}</span>
               </span>
            </p>
         </div>

         <div class="divider" v-if="moreInfo">
            <div class="registrationMarksGridItem__status">
               <span v-if="item.status === 0">Imtina</span>
               <span v-else-if="item.status === 1">Activ</span>
               <span v-else-if="item.status === 2">Baxilir</span>
               <span v-else>Satilib</span>
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

      props: {
         items: {
            type: Array,
            default() { return [] }
         },

         item: {
            type: Object,
            default() { return {} }
         },

         moreInfo: {
            type: Boolean,
            default: false
         }
      },

      methods: {
         goToRegistrationMark(id) {
            // this.$router.push(this.localePath(`/registration-marks/${id}`));
            window.open(this.localePath(`/registration-marks/${id}`), '_blank');
         },

         modifiedDate(date) {
            return `${date.split(' ')[0]} ${date.split(' ')[1].slice(0, 3)}`;
         }
      }
   }
</script>

<style lang="scss" scoped>
   .registrationMarksGridItem {
      display: inline-block;
      width: 224px;
      border-radius: 12px;
      border: 1px solid #CDD5DF;
      background-color: #FFFFFF;
      height: max-content;
      margin: 0 0 45px 20px;
      cursor: pointer;

      &__head {
         display: flex;
         align-items: center;
         margin: -1px 0 0 -1px;
         width: 101%;
         height: 44px;
         padding: 0 8px;
         border-radius: 5px;
         border: 3px solid #000000;

         .divider {
            &:first-child {
               margin-right: 7px;
            }
         }

         h3 {
            font-family: 'Din', sans-serif;
            font-weight: 400;
            font-size: 37px;
            line-height: 44px;
            letter-spacing: -1px;
            color: #1B2434;
            margin: 0;
         }
      }

      &__main {
         padding: 18px 16px 12.5px 16px;

         .divider {
            display: flex;
            align-items: center;
            justify-content: space-between;

            &:not(:first-child) {
               margin-top: 8px;
            }

            &:first-child {
               p {
                  font-weight: 700;
                  font-size: 18px;
                  line-height: 22px;
                  color: #246EB2;
               }
            }

            &:nth-child(2) {
               p {
                  font-weight: 600;
                  font-size: 15px;
                  line-height: 18px;
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

                     &:not(:first-child) {
                        margin-left: 8px;
                     }

                     span {
                        margin-left: 5px !important;
                     }
                  }
               }
            }
         }

         p {
            margin: 0;
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

   @media (max-width: 1250px) {
      .registrationMarksGridItem {
         width: 212px;

         &__head {
            h3 {
               font-size: 36px;
            }
         }
      }
   }

   @media (max-width: 1025px) {
      .registrationMarksGridItem {
         width: 235px;

         &__head {
            h3 {
               font-size: 38px;
            }
         }
      }
   }

   @media (max-width: 520px) {
      .registrationMarksGridItem {
         margin: 0 0 25px 0;
         width: 240px;

         &__head {
            h3 {
               font-size: 40px;
            }
         }
      }
   }
</style>
