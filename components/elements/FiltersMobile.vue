<template>
   <div class="filtersMobile">
      <div class="filtersMobile__list">
         <div class="filtersMobile__list-item mark_item">
            <form-select
               :label="$t('mark')"
               :options="existsBrands"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               :input-placeholder="$t('mark_search')"
               v-model="brand"
               @change="changeBrand"
               has-search
            />
            <inline-svg class="car_svg" src="/icons/car-3.svg"/>
         </div>
         <div class="filtersMobile__list-item" v-if="form.additional_brands[0].brand && carModels">
            <form-select
               :label="$t('model')"
               :options="carModels[0]"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               :input-placeholder="$t('model_search')"
               v-model="model"
               @change="changeModel"
               has-search
            />
         </div>
         <div class="filtersMobile__list-item" v-if="form.additional_brands[0].brand && form.additional_brands[0].model && carGenerations">
            <form-select
               :label="$t('generation')"
               :options="carGenerations[0]"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               :input-placeholder="$t('generation_search')"
               v-model="generation"
               @change="changeGeneration"
               has-search
            />
         </div>
         <!--               @change="changeModel"-->
         <div class="filtersMobile__list-item" @click="$emit('openMore')">
            <div class="info">
               <span>{{ $t('advanced_search') }}</span>
            </div>
            <inline-svg src="/icons/filter.svg"/>
         </div>
         <!--         <div-->
         <!--            class="filtersMobile__list-item"-->
         <!--            v-for="item in listData"-->
         <!--            :key="item.id"-->
         <!--            @click="$emit('onClick', item.id)"-->
         <!--            v-if="item.show"-->
         <!--         >-->
         <!--            <div class="info">-->
         <!--               <div v-if="item.hasDelete" class="close_svg">-->
         <!--                  <inline-svg src="icons/close.svg"/>-->
         <!--               </div>-->
         <!--               <span>{{ item.name }}</span>-->
         <!--            </div>-->
         <!--            <inline-svg v-if="item.icon" :src="item.icon"/>-->
         <!--         </div>-->
      </div>
   </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {SearchMixin} from "~/mixins/search";

export default {
   props: {
      additionalBrands: {
         default: () => { return {0 :{ } } }
      }
   },
   mixins: [SearchMixin],
   mounted() {
      this.brand = this.form.additional_brands[0].brand || this.additionalBrands[0].brand || null;
      this.model = this.form.additional_brands[0].model || this.additionalBrands[0].model || null;
      this.generation = this.form.additional_brands[0].generation || this.additionalBrands[0].generation || null;
   },
   methods: {
      submit() {
         let searchQuery = `${this.meta?.param}=${encodeURI(JSON.stringify(this.getFormData()))}`;
         let searchUrl = `${this.$localePath(this.meta?.path)}?${searchQuery}`;
         let searchSame = decodeURIComponent(searchUrl) === decodeURIComponent(this.$route.fullPath);
         this.$emit('pending');
         if (!searchSame) {
            this.$router.push(searchUrl, () => {
               this.$emit('submit');
               console.log('bu ola biler 3')

               // if (this.loggedIn && this.meta?.type === 'cars') {
               //    this.fetchSavedSearch({search_url: `${this.meta.path}?${searchQuery}`});
               // }
            });
         }
      },
      ...mapActions([
         'getModelsArray',
         'getModelGenerationsArray'
      ]),
      async changeBrand(id) {
         this.form.additional_brands[0].brand = id;

         let brand = this.existsBrands.find((option) => option.id === id)
         let slug = brand?.slug || ''
         this.form.additional_brands[0].brand_slug = slug;

         try {
            await this.getModelsArray({value: slug, index: 0});
         } catch (e) {
            console.log(e)
         }


         this.submit()
      },
      async changeModel(id) {
         this.form.additional_brands[0].model = id;
         let model = this.carModels[0].find((option) => option.id === id)
         let slug = model?.slug || ''
         let brand_slug = this.form.additional_brands[0].brand_slug

         try {
            await this.getModelGenerationsArray({value: slug, brand_slug, index: 0})
         } catch (e) {
            console.log(e)
         }
         this.submit()
      },
      changeGeneration(id) {
         this.form.additional_brands[0].generation = id;
         this.submit()
      }
   },
   data() {
      return {
         brand: null,
         model: null,
         generation: null,
         form: {
            additional_brands: {0: {
                  brand: null,
                  model: null,
                  generation: null,
               }, 1: {}, 2: {}, 3: {}, 4: {}},
         },
      }
   },
   computed: {
      meta() {
         return {
            type: 'cars',
            path: '/cars',
            param: 'car_filter',
         }
      },
      // ...mapGetters([
      //    'brands',
      //    'existsBrands',
      //    'carModels',
      //    'carModelsExclude',
      //    'carGenerations',
      //    'carGenerationsExclude',
      //    'bodyOptions',
      //    'sellOptions',
      //    'allSellOptions2',
      //    'singleSavedSearch',
      //    'colors',
      //    'popularOptions'
      // ]),
      ...mapGetters({
         brands: 'brands',
         existsBrands: 'existsBrands',
         carModels: 'carModels',
         carGenerations: 'carGenerations',
      })
   },
}
</script>

<style lang="scss">
.filtersMobile {
   border-radius: 12px;
   background-color: #FFFFFF;

   &__list {
      &-item {
         display: flex;
         align-items: center;
         justify-content: space-between;

         &.mark_item{
            position: relative;

            .car_svg {
               position: absolute;
               top: 50%;
               right: 0;
               transform: translateY(-50%);
               pointer-events: none !important;
            }
         }


         .select-menu_label {
            border: none;
            padding: 0;
            height: 20px;

            .text-truncate.full-width {
               order: 2;

               .text {
                  font-weight: 500;
                  color: #364152;
               }
            }


            .icon-chevron-down {
               display: none;
            }

            .icon-cross {
               padding: 4px;
               background-color: gray;
               color: white;
               border-radius: 50%;
               margin-right: 8px;
            }
         }

         .info {
            display: flex;
            align-items: center;
            gap: 16px;

            .close_svg {
               min-width: 24px;
               min-height: 24px;
               display: flex;
               align-items: center;
               justify-content: center;
               background-color: gray;
               border-radius: 50%;
               padding: 2px;
            }

            span {
               color: #364152;
               font-size: 16px;
               font-weight: 500;
               line-height: 20px;
            }

         }

         &:not(:first-child) {
            margin-top: 18px;
            padding-top: 18px;
            border-top: 1px solid #E3E8EF;
         }
      }
   }
}

.dark-mode {
   .filtersMobile {
      background-color: #1B2434;

      &__list {
         &-item {

            .select-menu_label {
               background-color: transparent !important;

               .text {
                  color: #9AA4B2 !important;
               }
            }
            span {
               color: #9AA4B2;
            }

            svg {
               path {
                  fill: #9AA4B2;
               }

               line {
                  stroke: #9AA4B2;
               }

               circle {
                  fill: #9AA4B2;
                  stroke: #1B2434;
               }
            }

            &:not(:first-child) {
               border-color: #364152;
            }
         }
      }
   }
}
</style>
