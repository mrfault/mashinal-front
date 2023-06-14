<template>
   <div class="termsOfUse">
      <div class="container">
         <breadcrumbs :crumbs="crumbs"/>

         <Cap>
            <template #left>
               <h3>{{ $t('user_agreement') }}</h3>
            </template>
         </Cap>

         <div class="termsOfUse__content" v-html="this.rules[1]?.text[locale]?.replace(/&nbsp;/g, ' ')" />
      </div>
   </div>
</template>

<script>
   import Cap from "~/components/elements/Cap.vue";
   export default {
      components: { Cap },

      data() {
         return {
            rules: ''
         }
      },

      computed: {
         crumbs() {
            return [
               { name: this.$t('policy'), route: '/policy' },
               { name: this.$t('user_agreement') },
            ]
         }
      },

      mounted() {
         this.rules = JSON.parse(localStorage.getItem('static_pages'));

         this.$nextTick(() => {
            const p = document.querySelectorAll('.termsOfUse__content p');

            p.forEach(item => {
               item.style.cssText = 'padding: 0; font-size: 16px; font-weight: 400; line-height: 32px;'
            });
         })
      }
   }
</script>

<style lang="scss" scoped>
   .termsOfUse {
      &__content {
         padding: 32px;
         border-radius: 12px;
         background-color: #FFFFFF;

         p {
            font-weight: 500;
            font-size: 16px;
            line-height: 32px;
            color: #121926;
         }
      }

      .cap {
         margin-bottom: 32px;
      }
   }

   .dark-mode {
      .termsOfUse {
         &__content {
            background-color: #1B2434;
         }
      }
   }
</style>
