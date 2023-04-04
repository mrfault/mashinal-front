<template>
   <nuxt-link class="registrationMarksGridItem" :to="localePath(`/registration-marks/${item.id}`)" target="_blank">
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

            <add-favorite :announcement="item" />
         </div>

         <div class="divider">
            <p>{{ item.user.full_name }}</p>
         </div>

         <div class="divider">
            <p>{{ item.created_at }}</p>
            <p>{{ item.region }}</p>
         </div>
      </div>

<!--      <pre>{{item}}</pre>-->
   </nuxt-link>
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
               margin-right: 10px;
            }
         }

         h3 {
            font-family: 'Din', sans-serif;
            font-weight: 400;
            font-size: 38px;
            line-height: 44px;
            letter-spacing: -0.602151px;
            color: #1B2434;
            margin: 0;
         }
      }

      &__main {
         padding: 18px 16px 12.5px 16px;

         .divider {
            &:not(:first-child) {
               margin-top: 7px;
            }

            &:first-child {
               display: flex;
               align-items: center;
               justify-content: space-between;

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
               display: flex;
               align-items: center;
               justify-content: space-between;

               p {
                  font-weight: 500;
                  font-size: 14px;
                  line-height: 17px;
                  color: #697586;
               }
            }
         }

         p {
            margin: 0;
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
