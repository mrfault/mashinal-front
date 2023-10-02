<template>
   <div class="pages-catalog">
      <template v-if="!$route.params.body">
         <Banner
            class="mt-0 d-sm-none"
            :bg="'/img/salon-bg.png'"
            :title="$t('autocatalog')"
         >
<!--            <template #content>-->
<!--               <breadcrumbs class="light-color" :crumbs="crumbs"/>-->
<!--            </template>-->
         </Banner>

         <catalog-search-form
            class="d-sm-none"
            :total-count="catalogTotal"
            :pending="pending"
            @pending="pending = true"
            @submit="searchCatalog"
         />
      </template>

      <div class="container">
<!--         <breadcrumbs-->
<!--            :crumbs="crumbs"-->
<!--            v-if="$route.params.body"-->
<!--         />-->

         <Banner
            class="mb-5 d-none d-sm-block"
            :bg="'/img/salon-bg.png'"
            :title="$t('autocatalog')"
            v-if="!$route.params.body"
         >
<!--            <template #content>-->
<!--               <breadcrumbs class="light-color" :crumbs="crumbs"/>-->
<!--            </template>-->
         </Banner>

         <template v-if="!$route.params.body">
            <catalog-search-form
               class="d-none d-sm-block"
               :total-count="catalogTotal"
               :pending="pending"
               @pending="pending = true"
               @submit="searchCatalog"
            />

            <Cap>
               <template #left>
                  <h3>{{ catalogTitle }}</h3>
               </template>

               <template #right>
                  <nuxt-link :to="$localePath('/cars')">
                     <span>{{ $readPlural(catalogTotal, $t('plural_forms_' + (catalogItems.length ? 'carcase' : 'model'))) }}</span>
                  </nuxt-link>
               </template>
            </Cap>

            <catalog-grid
               v-if="catalogTotal"
               :items="catalogItems"
               :paginate="catalogItems.data && $paginate(catalogItems)"
               :title="$t('autocatalog')"
               :pending="pending"
               @change-page="searchCatalog"
            />

            <no-results v-else />
         </template>

         <template v-else>
            <catalog-inner
               :selected-brand="selectedBrand"
               :selected-model="selectedModel"
               :selected-car="selectedGenerationType"
            />
         </template>
      </div>
   </div>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex';
   import CatalogSearchForm from '~/components/catalog/CatalogSearchForm';
   import CatalogGrid from '~/components/catalog/CatalogGrid';
   import CatalogInner from '~/components/catalog/CatalogInner';
   import NoResults from '~/components/elements/NoResults';
   import Banner from "~/components/elements/Banner.vue";
   import Cap from "~/components/elements/Cap.vue";

   export default {
      name: 'pages-catalog',

      scrollToTop: true,

      components: {
         CatalogSearchForm,
         CatalogGrid,
         CatalogInner,
         NoResults,
         Banner,
         Cap
      },

      nuxtI18n: {
         paths: {
            az: '/kataloq'
         }
      },

      head() {
         let params = {...this.$route.params};
         let paramsLength = Object.keys(params).length;
         let titleParts = '', descrParts = '';
         ['Brand', 'Model', 'Generation', 'Body'].map((part, index) => {
            let titleText = this[`selected${part}Text`];
            if (titleText) {
               let delim = ['Generation', 'Body'].includes(part) ? ', ' : ' ';
               if (index === 0) delim = '';
               titleParts += delim + titleText;
               if (index < 2) descrParts += delim + titleText;
            }
         });

         let title = this.$t(`meta-title_catalog${paramsLength ? '-car' : ''}`, {
            car: titleParts,
            word: this.$t('meta-words_catalog-car')[paramsLength - 1]
         });
         let description = this.$t(`meta-descr_catalog${paramsLength ? '-car' : ''}`, {car: descrParts});
         let image;
         if (params.body && this.firstGeneration) {
            image = this.firstGeneration.generation.car_type_generation
               .find(item => this.firstGeneration.car_type_id === item.car_type_id).transformed_media?.main?.[0];
         } else if (params.model && this.catalogItems?.[0]) {
            let item = this.catalogItems?.[0];
            image = (item?.car_type_generation?.find(type => type.car_type_id === item.fav_car_type_id) || item?.car_type_generation[0])?.transformed_media?.main?.[0];
         } else if (params.brand) {
            image = this.catalogItems?.data?.[0]?.transformed_media;
         }
         return this.$headMeta({title, description, image});
      },

      async asyncData({ store, route }) {
         if (process.client) {
            let { page, filter } = route.query;
            let post = JSON.parse(filter || '{}');

            await Promise.all([
               store.dispatch('getBrands'),
               store.dispatch('getBodyOptions'),
               route.params.brand && store.dispatch('getModels', route.params.brand),
               route.params.model && store.dispatch('getGenerations', route.params),
               // route.params.generation && store.dispatch('getGenerationTypes', route.params),
               route.params.body && store.dispatch('getBodyModification', route.params),
               route.params.body && store.dispatch('getModificationsList', route.params),
               /*  store.dispatch('getCatalogSearch', { post, page, params: Object.keys(post).length ? { temp: 1, ...route.params} : {...route.params}, totalCount: !!route.params.brand }),
                 !route.params.brand ? store.dispatch('getCatalogSearch', { post, page, params: { temp: 1, ...route.params}, totalCount: true }) : []*/
            ]);
         }

         return {
            pending: false
         }
      },

      methods: {
         ...mapActions(['getCatalogSearch']),

         async searchCatalog(page = 1, scroll = true) {
            page = this.$route.query.page || 1;
            let post = JSON.parse(this.$route.query.filter || '{}');

            let showDefaultItems = false; /* !Object.keys(post).length && !this.$route.params.brand; */
            this.pending = true;
            await this.getCatalogSearch({
               params: showDefaultItems ? {...this.$route.params} : {temp: 1, ...this.$route.params},
               post,
               page
            });
            this.pending = false;
            if (scroll) this.scrollTo('.cap', [-80, -200]);
         }
      },

      mounted() {
         this.$store.commit('mutate', {
            property: 'announcement',
            value: {}
         });
      },

      computed: {
         ...mapGetters(['catalogItems', 'catalogTotal', 'firstGeneration', 'modelDescription', 'brands', 'models']),

         catalogTitle() {
            if (!this.$route.params.model)
               return this.$t('select_model');
            else if (!this.$route.params.generation)
               return this.$t('select_generation');
            else if (!this.$route.params.body)
               return this.$t('select_carcase');
            return '';
         },

         crumbs() {
            let params = Object.keys(this.$route.params).map(key => this.$route.params[key]);
            return [
               {name: this.$t('autocatalog'), route: params.length ? '/catalog' : ''}
            ].concat(
               ['Brand', 'Model', 'Generation', 'Body']
                  .filter(part => this[`selected${part}Text`])
                  .map((part, i) => ({
                     name: this[`selected${part}Text`],
                     route: (i === params.length - 1 || part === 'Body') ? '' : `/catalog/${params.slice(0, i + 1).join('/')}`
                  }))
            );
         },

         selectedBrand() {
            let brand = this.brands.find(brand => brand.slug === this.$route.params.brand);
            return brand;
         },

         selectedBrandText() {
            if (!this.$route.params.brand) return false;
            return this.selectedBrand?.name;
         },

         selectedModel() {
            let model = this.models.find(model => model.slug === this.$route.params.model);
            return {...model, description: this.modelDescription};
         },

         selectedModelText() {
            if (!this.$route.params.model) return false;
            return this.$translateHard(this.selectedModel?.name);
         },

         selectedGenerationType() {
            if (!this.$route.params.generation) return false;
            let generation = this.firstGeneration?.generation;
            return generation?.car_type_generation?.find(g => g.car_type_id == this.firstGeneration?.car_type_id);
         },

         selectedGenerationText() {
            if (!this.$route.params.generation) return false;
            let generation = this.firstGeneration?.generation;
            return this.$translateHard(generation?.short_name) + ' ' + generation?.start_year + ' – ' + (generation?.end_year || this.currentYear);
         },

         selectedBodyText() {
            if (!this.$route.params.body) return false;
            let name = this.firstGeneration?.car_type?.name?.[this.locale];
            if (!name) return false;
            if (this.selectedModificationText) name += ` (${this.selectedModificationText})`;
            return name;
         },

         selectedModificationText() {
            if (!this.$route.params.body) return false;
            let complectation = this.firstGeneration?.complect_type;
            let modification = this.firstGeneration?.main[' ']['obem'] + ' ' + this.$t(this.$t('box_mode_values')[this.firstGeneration?.main[' ']['box']]);
            return (complectation && complectation !== '–') ? (complectation + ' ' + modification) : (modification);
         },
      },

      beforeRouteLeave(to, from, next) {
         this.$nuxt.$emit('prevent-popstate');
         next();
      }
   }
</script>

<style lang="scss">
   .pages-catalog {
      padding-top: 24px;
      padding-bottom: 120px;

      .cap {
         margin: 24px 0;

         span {
            //color: #4B5565;
         }
      }

      .catalog-search-form {
         //.btnWrapper {
         //   .btn {
         //      width: 80px;
         //   }
         //}

         .btn {
            height: 52px;
            border-radius: 8px;
         }

         .clearSearch, .moreSearch {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 52px;
            border-radius: 12px;

            span {
               font-weight: 500;
               font-size: 15px;
               line-height: 18px;
               margin-right: 12px;
            }
         }

         .clearSearch {
            background-color: #FEF3F2;
            border: 1px solid #FDA29B;

            span {
               color: #F04438;
            }

            svg {
               path {
                  stroke: #F04438;
               }
            }
         }

         .moreSearch {
            background-color: #EFF4FF;
            border: 1px solid #528BFF;

            span {
               color: #1B2434;
            }
         }
      }
   }

   .dark-mode {
      .pages-catalog {
         .catalog-search-form {
            .btn {
               &:not(.active) {
                  color: #EEF2F6;
                  border-color: transparent;
                  background-color: transparent;
                  &:hover {
                     background-color: #155EEF;
                  }
               }
            }

            .clearSearch {
               border-color: #f97066;
               background-color: transparent;

               span {
                  color: #FFFFFF;
               }

               svg {
                  path {
                     stroke: #FFFFFF;
                  }
               }
            }

            .moreSearch {
               border-color: #2970ff;
               background-color: transparent;

               span {
                  color: #FFFFFF;
               }

               svg {
                  path {
                     stroke: #FFFFFF;
                  }

                  line {
                     stroke: #FFFFFF;
                  }
               }
            }
         }
      }
   }

   @media (min-width: 992px) {
      .pages-catalog {
         .catalog-search-form {
            .clearSearch {
               justify-content: flex-end;
               background-color: unset;
               border: unset;
               cursor: pointer;

               &:hover {
                  span {
                     border-color: #F04438;
                  }
               }

               span {
                  border-bottom: 1px solid transparent;
               }
            }
         }
      }

      .dark-mode {
         .pages-catalog {
            .catalog-search-form {
               .clearSearch {
                  border-color: #FDA29B;
                  background-color: transparent;

                  span {
                     color: #F04438;
                  }

                  svg {
                     path {
                        stroke: #F04438;
                     }
                  }
               }
            }
         }
      }
   }

   @media (max-width: 600px) {
      .pages-catalog {
         .catalog-search-form {
            .card {
               border-radius: 0;
            }
         }
      }
   }
</style>
