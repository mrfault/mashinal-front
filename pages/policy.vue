<template>
   <div class="pages-policy pt-1 pb-3 pt-lg-5">
      <div class="container">
         <breadcrumbs :crumbs="crumbs"/>

         <Cap>
            <template #left>
               <h3>{{$t('terms_and_rule')}}</h3>
            </template>
         </Cap>

         <div class="pages-policy__content">
            <nuxt-link
               class="pages-policy__content-link"
               v-for="(page, i) in staticPages"
               :key="i"
               :to="`${page.id === 1 ? '/rules' : '/terms-of-use'}`"
            >
               <inline-svg :src="`/icons/${page.id === 1 ? 'rules' : 'agreement'}.svg`"/>

               <div class="pages-policy__content-text">
                  <h3>{{ page.title[locale] }}</h3>
                  <p>{{ page.description ? page.description[locale] : ''}}</p>
               </div>
            </nuxt-link>
         </div>

         <!--         <div-->
         <!--            :class="['card with-margins has-collapse', {'mb-2 mb-lg-3': index !== staticPages.length - 1}]"-->
         <!--            v-for="(page, index) in staticPages"-->
         <!--            :key="page.id"-->
         <!--         >-->
         <!--            <collapse-content-->
         <!--               :title="page.title[locale]"-->
         <!--               :first-collapsed="true"-->
         <!--               :title-with-hr="true"-->
         <!--               :animate="false"-->
         <!--            >-->
         <!--               <div v-html="page?.text[locale]?.replace(/&nbsp;/g, ' ')" />-->
         <!--            </collapse-content>-->
         <!--         </div>-->
      </div>
   </div>
</template>

<script>
import {mapGetters} from 'vuex';
import Cap from "~/components/elements/Cap.vue";
import CollapseContent from '~/components/elements/CollapseContent';

export default {
   name: 'pages-policy',

   components: {
      CollapseContent,
      Cap
   },

   nuxtI18n: {
      paths: {
         az: '/qaydalar'
      }
   },

   head() {
      return this.$headMeta({
         title: this.$t('policy')
      });
   },

   async asyncData({ store }) {
      await store.dispatch('fetchStaticPages');
   },

   computed: {
      ...mapGetters(['staticPages']),

      crumbs() {
         return [
            {name: this.$t('policy')}
         ]
      }
   }
}
</script>

<style lang="scss">
.pages-policy {
   .cap {
      margin-bottom: 32px;
   }

   &__content {
      display: grid;
      gap: 20px;
      grid-template-columns: repeat(2, 1fr);

      &-link {
         display: flex;
         align-items: center;
         width: 100%;
         padding: 28px 24px;
         border-radius: 12px;
         background-color: #FFFFFF;
         transition: .2s all;
         border: 1px solid transparent;

         svg {
            min-width: 80px;
         }

         h3 {
            font-weight: 600;
            font-size: 17px;
            line-height: 20px;
            color: #121926;
         }

         p {
            margin-top: 8px;
            font-weight: 400;
            font-size: 15px;
            line-height: 20px;
            color: #4B5565;

            display: -webkit-box;
            line-clamp: 3;
            -webkit-line-clamp: 3;
            overflow: hidden;
            -webkit-box-orient: vertical;
         }

         &:hover {
            filter: drop-shadow(4px 8px 15px rgba(34, 61, 91, 0.25));
         }
      }

      &-text {
         margin-left: 24px;
      }
   }
}

.dark-mode {
   .pages-policy {
      &__content {
         &-link {
            background-color: #1B2434;

            svg {
               path {
                  fill: #FFFFFF;
               }

               rect {
                  fill: #364152;
               }
            }

            h3 {
               color: #EEF2F6
            }

            p {
               color: #CDD5DF;
            }

            &:hover {
               border-color: #155EEF;
            }
         }
      }
   }
}

@media (max-width: 992px) {
   .pages-policy {
      &__content {
         grid-template-columns: repeat(1, 1fr);
      }
   }
}

@media (max-width: 600px) {
   .pages-policy {
      &__content {
         &-link {
            padding: 20px 16px;
         }
      }
   }
}
</style>
