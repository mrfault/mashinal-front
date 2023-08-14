<template>
   <div class="quickInfoPriceWrapper">
      <div :class="['quickInfoPrice', {'plates' : type === 'plates'}]">
         <template v-if="type !== 'plates'">
            <div class="quickInfoPrice__head">
               <span>{{ announcement.price }}</span>

               <inline-svg
                  src="/icons/chevron-down.svg"
                  width="18px"
                  height="18px"
               />
            </div>

            <div class="quickInfoPrice__main">
               <p>~ {{ announcement?.price_converted }}</p>
               <p>~ {{ announcement?.price_converted }}</p>
            </div>
         </template>

         <template v-else>
            <p>{{ announcement.price }}</p>

            <inline-svg src="/icons/exchange_2.svg" />

            <p>{{ announcement.price_converted }}</p>
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

         &:hover {
            height: max-content;
            z-index: 1000;
            box-shadow: 0 5px 16px -8px rgba(0,0,0,1);

            .quickInfoPrice__head {
               svg {
                  transform: rotate(180deg);
               }
            }

            .quickInfoPrice__main {
               z-index: 1000;

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

            p {
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

         &.plates {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0;
            padding: 0 0 18px 0;
            cursor: initial;

            p {
               font-size: 24px;
               font-weight: 600;
               line-height: 28px;
               color: #1B2434;
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

               p {
                  color: #EEF2F6;
               }
            }

            &:hover {
               background-color: #1B2434 !important;

               .quickInfoPrice__main {
                  background-color: #1B2434 !important;

                  p {
                     color: #CDD5DF !important;
                  }
               }
            }
         }
      }
   }
</style>
