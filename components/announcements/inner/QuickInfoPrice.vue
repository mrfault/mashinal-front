<template>
   <div :class="['quickInfoPriceWrapper', {'plates' : type === 'plates'}]">
      <div :class="['quickInfoPrice', {'pointer-events-none' : type === 'plates' || !+announcement.price.split(' ')[0]}]">
         <template v-if="type !== 'plates'">
            <div class="quickInfoPrice__head">
               <span>{{ announcement.price }}</span>

               <inline-svg
                  v-if="+announcement.price.split(' ')[0]"
                  src="/icons/chevron-down.svg"
                  width="18px"
                  height="18px"
               />
            </div>

            <ul class="quickInfoPrice__main" v-if="+announcement.price.split(' ')[0]">
               <li
                  class="quickInfoPrice__main-item"
                  v-for="(price, i) in announcement?.price_converted"
                  :key="i"
               >~ {{ price }}</li>
            </ul>
         </template>

         <template v-else>
            <template v-if="+announcement.price.split(' ')[0]">
               <p>{{ announcement.price }}</p>

               <inline-svg src="/icons/exchange_2.svg" />

               <p>{{ announcement.price_converted }}</p>
            </template>

            <template v-else>
               <p>{{ $t('is_negotiable') }}</p>
            </template>
         </template>
      </div>
   </div>
</template>

<script>
   export default {
      props: {
         announcement: {
            type: Object
         },

         type: {
            type: String
         }
      }
   }
</script>

<style lang="scss" scoped>
   .quickInfoPriceWrapper {
      position: relative;
      margin-bottom: 35px;

      .quickInfoPrice {
         position: absolute;
         top: 0;
         left: 0;
         height: 45px;
         padding: 8px 20px 10px 20px;
         border-radius: 8px;
         margin-left: -20px;
         cursor: pointer;
         background-color: #FFFFFF;
         z-index: 5;

         &:hover {
            height: max-content;
            box-shadow: 0 5px 16px -8px rgba(0,0,0,1);

            .quickInfoPrice__head {
               svg {
                  transform: rotate(180deg);
               }
            }

            .quickInfoPrice__main {
               opacity: 1;
               visibility: visible;
            }
         }

         &__head {
            display: flex;
            align-items: center;
            justify-content: space-between;

            span {
               font-size: 24px;
               font-weight: 700;
               line-height: 25px;
               color: #1B2434;
               margin-right: 10px;
               white-space: nowrap;
            }

            svg {
               transition: all .3s;
            }
         }

         &__main {
            opacity: 0;
            visibility: hidden;

            padding-top: 16px;
            width: 100%;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
            background-color: #FFFFFF;

            &-item {
               display: flex;
               align-items: center;

               font-size: 20px;
               font-weight: 600;
               line-height: 24px;
               color: #1B2434;
               white-space: nowrap;

               &:not(:first-child) {
                  margin-top: 10px;
               }
            }
         }
      }

      &.plates {
         margin-bottom: 0;

         .quickInfoPrice {
            position: unset;
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0;
            padding: 0 0 18px 0;
            cursor: initial;
            background-color: transparent;

            p {
               font-size: 24px;
               font-weight: 600;
               line-height: 28px;
               color: #1B2434;
               white-space: nowrap;
            }

            &:hover {
               box-shadow: unset;
            }
         }
      }
   }

   .dark-mode {
      .quickInfoPriceWrapper {
         .quickInfoPrice {
            background-color: transparent;

            &__head {
               span {
                  color: #EEF2F6;
               }

               svg {
                  color: #CDD5DF;
               }
            }

            &__main {
               background-color: #364152;

               &-item {
                  color: #EEF2F6;
               }
            }

            &:hover {
               background-color: #1B2434 !important;

               .quickInfoPrice__main {
                  background-color: #1B2434 !important;

                  &-item {
                     color: #CDD5DF !important;
                  }
               }
            }
         }

         &.plates {
            .quickInfoPrice {
               &:hover {
                  background-color: transparent !important;
               }

               p {
                  color: #EEF2F6;
               }
            }
         }
      }
   }

   @media (max-width: 500px) {
      .quickInfoPriceWrapper {
         &.plates {
            display: flex;
            justify-content: center;
            width: 100%;

            .quickInfoPrice {
               padding-bottom: 0;
            }
         }
      }
   }
</style>
