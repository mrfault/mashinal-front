<template>
   <div class="pages-comparison-index">
      <div class="container">
         <div class="pages-comparison-index__inner">
            <h2 class="pages-comparison-index__title">{{ $t('comparisons') }}</h2>

            <comparison-filter />

            <comparison-main-section />

            <comparison-add-model />
         </div>
      </div>
   </div>
</template>

<script>
   import Breadcrumbs from '~/components/elements/Breadcrumbs'
   import ComparisonFilter from '~/components/comparison/ComparisonFilter'
   import ComparisonMainSection from '~/components/comparison/ComparisonMainSection'
   import ComparisonAddModel from '~/components/comparison/ComparisonAddModel'

   export default {
      name: 'comparison-index',

      components: {
         Breadcrumbs,
         ComparisonFilter,
         ComparisonMainSection,
         ComparisonAddModel
      },

      nuxtI18n: {
         paths: {
            az: '/muqayise'
         }
      },

      head() {
         return this.$headMeta({
            title: this.$t('meta-title_comparison'),
            description: this.$t('meta-descr_comparison')
         });
      },

      async asyncData({ app, store }) {
         // await store.dispatch('comparison/getInitialAnnouncements');
         const models = app.$cookies.get('comparisonModels');

         if (models?.length) {
            await Promise.all(
               models.map(id => store.dispatch('comparison/addModel', id))
            );
         }
      },

      computed: {
         crumbs() {
            return [{ name: this.$t('comparisons'), route: '/comparison' }]
         }
      }
   }
</script>

<style lang="scss">
   .pages-comparison-index {
      margin-top: 24px;
      padding-bottom: 120px;

      &__inner {
         padding: 20px;
         border-radius: 12px;
         background-color: #FFFFFF;
         overflow: hidden;
      }

      &__title {
         color: #121926;
         font-size: 24px;
         font-weight: 700;
         line-height: 32px;
         margin-bottom: 20px;
      }

      //.comparison-filter {
      //   margin-bottom: 30px;
      //}
   }

   .dark-mode {
      .pages-comparison-index {
         &__inner {
            background-color: #1B2434;

            .comparison-filter {
               &__types {
                  .btn {
                     span {
                        color: #CDD5DF;
                     }

                     &.active {
                        span {
                           color: #EEF2F6 !important;
                        }
                     }
                  }
               }

               &__checkboxes {
                  .form-group {
                     .checkbox-input {
                        label {
                           background-color: transparent !important;
                           //border: none;
                        }
                     }
                  }
               }
            }

            .comparison {
               &__specifications {
                  .collapse-content {
                     &__column {
                        border-color: #4B5565;

                        h2 {
                           color: #EEF2F6;
                        }

                        h3 {
                           color: #CDD5DF;
                        }

                        p {
                           color: #EEF2F6;
                        }
                     }

                     & > div {
                        & > div {
                           .collapse-content__element {
                              &:not(:last-child) {
                                 .collapse-content__column {
                                    border-color: #4B5565;
                                 }
                              }
                           }
                        }
                     }
                  }
               }
            }
         }

         &__title {
            color: #EEF2F6;
         }

         .no-results {
            background-color: transparent;
         }
      }
   }
</style>
