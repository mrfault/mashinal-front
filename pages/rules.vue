<template>
   <div class="rules mb-3">
      <div class="container">
         <breadcrumbs :crumbs="crumbs"/>

         <Cap>
            <template #left>
               <h3>{{ $t('general_rules') }}</h3>
            </template>
         </Cap>

         <div class="rules__content" v-html="staticPages[0]?.text[locale]?.replace(/&nbsp;/g, ' ')" />
      </div>
   </div>
</template>

<script>
   import Cap from "~/components/elements/Cap.vue";
   import {mapGetters} from "vuex";
   export default {
      components: { Cap },

      // data() {
      //    return {
      //       rules: ''
      //    }
      // },

      computed: {
         ...mapGetters({
            staticPages: 'staticPages'
         }),

         crumbs() {
            return [
               { name: this.$t('policy'), route: '/policy' },
               { name: this.$t('general_rules') },
            ]
         }
      },

      async asyncData({ store }) {
         await store.dispatch('fetchStaticPages');
      },

      mounted() {
         // this.rules = JSON.parse(localStorage.getItem('static_pages'));

         this.$nextTick(() => {
            const p = document.querySelectorAll('.rules__content p');

            p.forEach(item => {
               item.style.cssText = 'padding: 0; font-size: 16px; font-weight: 400; line-height: 32px;'
            });
         })
      }
   }
</script>

<style lang="scss" scoped>
   .rules {
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
      .rules {
         &__content {
            background-color: #1B2434;
         }
      }
   }
</style>
