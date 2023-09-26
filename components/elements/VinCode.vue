<template>
   <div class="vinCode">
      <h4 class="vinCode__title">
         <span>VIN-kod:</span>
         <span>{{ vin }}</span>
      </h4>

      <p class="vinCode__subtitle">Avtomobil almazdan əvvəl VIN kodunu yoxlamaq tövsiyyə olunur</p>

      <button class="vinCode__btn" @click="checkVin">
         <span>VIN kodu yoxla</span>

         <inline-svg src="/icons/search_new.svg" />
      </button>

      <div class="badge">{{ $t('is_new_2') }}</div>
   </div>
</template>

<script>
   export default {
      methods: {
         checkVin() {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(this.vin)}`, "_blank");
         }
      },

      props: {
         vin: ''
      }
   }
</script>

<style lang="scss" scoped>
   .vinCode {
      position: relative;
      padding: 24px 20px;
      border-radius: 12px;
      border: 1px solid #F81734;
      background-color: #FFFFFF;
      //overflow: hidden;

      &__title {
         font-size: 18px;
         font-weight: 400;
         line-height: 22px;

         span {
            &:last-child {
               font-weight: 500;
            }
         }
      }

      &__subtitle {
         font-size: 14px;
         font-weight: 400;
         line-height: 16px;
         color: #697586;
         margin: 12px 0 16px 0;
      }

      &__btn {
         display: flex;
         align-items: center;
         justify-content: center;
         width: 100%;
         height: 52px;
         border-radius: 8px;
         border: 1px solid #CDD5DF;
         background-color: #FFFFFF;
         transition: all .3s;

         span {
            font-size: 15px;
            font-weight: 500;
            line-height: 18px;
            color: #364152;
            margin-right: 8px;
         }

         &:hover {
            border-color: #84ADFF;
         }
      }

      .badge {
         position: absolute;
         top: -10px;
         left: 20px;
         height: 16px;
         font-size: 12px;
         font-style: normal;
         font-weight: 500;
         line-height: 14px;
         padding: 0 2px;
         color: #FFFFFF;
         border-radius: 2px;
         background-color: #F81734;
      }
   }

   .dark-mode {
      .vinCode {
         //border-color: #05603A;
         background-color: #1B2434;

         &__title {
            color: #EEF2F6;
         }

         &__subtitle {
            color: #EEF2F6;
         }

         &__btn {
            color: #EEF2F6;
            border-color: #121926;
            background-color: #121926;

            span {
               color: #EEF2F6;
            }

            &:hover {
               border-color: #84ADFF;
            }
         }
      }
   }
</style>
