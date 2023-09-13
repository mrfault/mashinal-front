<template>
   <div class="filtersMobile">
      <div class="filtersMobile__list">
         <div v-if="type === 2" class="filtersMobile__list-item mark_item">
            <form-select
               :label="$t('type_of_motos')"
               :options="motoTypes"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               :input-placeholder="$t('type_of_motos')"
               v-model="motoType"
               @change="setCategory($event)"
            />
            <inline-svg class="motorbike_svg" src="/img/motorbike2.svg"/>
         </div>
         <div class="filtersMobile__list-item mark_item" v-if="type === 1 || (type ===2 && motoType)">
            <form-select
               :label="$t('mark')"
               :options="type === 2 ? motoBrands :existsBrands"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               :input-placeholder="$t('mark_search')"
               v-model="brand"
               @change="changeBrand"
               has-search
            />
            <inline-svg v-if="type === 1" class="car_svg" src="/icons/car-3.svg"/>
         </div>
         <div class="filtersMobile__list-item" v-if="(brand && carModels) || (type === 2 && brand)">
            <form-select
               :label="$t('model')"
               :options="type === 2 ? models(form.additional_brands[0]['category'])[0] : carModels[0]"
               :clear-placeholder="true"
               :clear-option="false"
               :new-label="false"
               :input-placeholder="$t('model_search')"
               v-model="model"
               @change="changeModel"
               has-search
            />
         </div>
         <div class="filtersMobile__list-item" v-if="brand && model && carGenerations && type === 1">
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
         default: () => {
            return {0: {}}
         }
      },
      formMotoType: {},
      type: {
         default: 1,
      },
      meta: {
         type: Object
         // default: {
         //    type: '',
         //    path: '',
         //    param: '',
         // }
      }
   },
   mixins: [SearchMixin],
   async mounted() {
      this.brand = this.additionalBrands[0].brand || null;
      this.model = this.additionalBrands[0].model || null;
      this.generation = this.additionalBrands[0].generation || null;
      this.motoType = this.additionalBrands[0].category || null;
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
         'getModelGenerationsArray',
         'getMotoBrandsV2',
         'getMotoModels'
      ]),

      async setCategory(type) {
         this.form.moto_type = this.motoTypeIds[type];
         this.form.additional_brands[0] = {};
         this.brand = null;
         this.model = null;


         this.form.additional_brands[0]['category'] = type
         this.$set(this, 'motoType', type);


         this.submit();
      },
      async changeBrand(id) {

         this.form.additional_brands[0].brand = id;
         this.form.additional_brands[0].model = null;
         this.model = null;
         let brand = this.existsBrands.find((option) => option.id === id)
         let slug = brand?.slug || ''
         this.form.additional_brands[0].brand_slug = slug;
         console.log('get models')

         if (!id) {
            this.submit()
            return;
         }
         try {
            if (this.type === 2) {
               await this.getMotoModels({
                  category: this.form.additional_brands[0]['category'],
                  id,
                  index: 0
               })
            } else {
               await this.getModelsArray({value: slug, index: 0});
            }

         } catch (e) {
            console.log(e)
         }

         this.submit()


      },

      models(category) {
         return {
            1: this.motorcycleModels,
            2: this.scooterModels,
            3: this.atvModels
         }[parseInt(category) || 1];
      },
      async changeModel(id) {
         this.form.additional_brands[0].model = id;
         let model = this.carModels[0].find((option) => option.id === id)
         let slug = model?.slug || ''
         let brand_slug = this.form.additional_brands[0].brand_slug
         this.generation = null

         try {
            if (this.type === 1) {
               await this.getModelGenerationsArray({value: slug, brand_slug, index: 0})
            }
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
         motoType: null,
         form: {
            additional_brands: {
               0: {
                  brand: null,
                  model: null,
                  generation: null,
               }, 1: {}, 2: {}, 3: {}, 4: {}
            },
         },
      }
   },
   computed: {
      motoTypes() {
         return [
            {key: 1, name: this.$t('motorcycles')},
            {key: 2, name: this.$t('scooters')},
            {key: 3, name: this.$t('atvs')}
         ]
      },
      motoTypeIds() {
         return {
            1: 'motorcycle',
            2: 'scooter',
            3: 'moto_atv',
         }
      },

      motoBrands() {
         return {
            1: this.motoOptions.brands,
            2: this.motoOptions.scooter_brands,
            3: this.motoOptions.atv_brands
         }[parseInt(this.motoType) || 1];
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
         motoOptions: 'motoOptions',
         existsBrands: 'existsBrands',
         carModels: 'carModels',
         carGenerations: 'carGenerations',
         motorcycleModels: 'motorcycleModels',
         scooterModels: 'scooterModels',
         atvModels: 'atvModels',
      })
   },
   watch: {
      additionalBrands: {
         deep: true,
         handler() {
            this.brand = this.additionalBrands[0].brand || null;
            this.model = this.additionalBrands[0].model || null;
            this.generation = this.additionalBrands[0].generation || null;
            this.motoType = this.additionalBrands[0].category || null;
         }
      }
   }
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

         &.mark_item {
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

            .text-truncate {
               order: 2;
               width: 100%;

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
