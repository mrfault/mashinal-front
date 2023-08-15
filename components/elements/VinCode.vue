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
      padding: 24px 20px;
      border-radius: 12px;
      border: 1px solid #12B76A;
      background-color: #FFFFFF;

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
   }

   .dark-mode {
      .vinCode {
         border-color: #05603A;
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
