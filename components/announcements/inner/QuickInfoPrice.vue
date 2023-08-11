<template>
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
            <p>~ {{ announcement.price_converted }}</p>
            <p>~ {{ announcement.price_converted }}</p>
         </div>
      </template>

      <template v-else>
         <p>{{ announcement.price }}</p>

         <inline-svg src="/icons/exchange_2.svg" />

         <p>{{ announcement.price_converted }}</p>
      </template>
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
   .quickInfoPrice {
      position: relative;
      padding: 8px 20px 10px 20px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      margin-left: -20px;
      cursor: pointer;
      z-index: 10;

      &:hover {
         box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.08);

         .quickInfoPrice__head {
            svg {
               transform: rotate(180deg);
            }
         }

         .quickInfoPrice__main {
            display: block;
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
         }

         svg {
            transition: all .3s;
         }
      }

      &__main {
         position: absolute;
         left: 0;
         bottom: -80px;
         display: none;
         padding: 16px 20px;
         width: 100%;
         border-bottom-left-radius: 8px;
         border-bottom-right-radius: 8px;
         background-color: #FFFFFF;

         p {
            font-size: 20px;
            font-weight: 600;
            line-height: 24px;
            color: #1B2434;

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

   .dark-mode {
      .quickInfoPrice {
         &__head {
            span {
               color: #EEF2F6;
            }

            svg {
               color: #364152;
            }
         }

         &__main {
            background-color: #364152;

            p {
               color: #EEF2F6;
            }
         }
      }
   }
</style>
