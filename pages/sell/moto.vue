<template>
   <div class="pages-sell">
      <div class="container">
         <breadcrumbs :crumbs="crumbs"/>
         <sell-progress :form="form"/>
         <div class="sell_cards-row row">
            <div class="col-auto">
               <div :class="{'card': !isMobileBreakpoint}">
                  <sell-selected-model v-if="showModelOptions"
                                       :allow-clear="showModelOptions"
                                       :brand="brand"
                                       :model="model"
                                       :year="form.selectedYear"
                                       @back="goBack"
                                       @clean="cleanForm"
                  />
                  <vehicle-options v-else-if="!isMobileBreakpoint" :options="searchMenus[1].children"
                                   :value="form.category"
                                   icons-only
                                   @change="handleCategory($event.key)"
                  />
                  <sell-last-step v-if="showLastStep" :key="lastStepKey"
                                  :initial-form="form"
                                  :title="`${brand.name} ${model.name}, ${form.selectedYear}`"
                                  type="moto"
                                  @clean="cleanForm"
                                  @close="showLastStep = false, lastStepKey++, form.selectedYear = ''"
                  />
                  <year-options v-else-if="showYearOptions"
                                :title="$t('prod_year')"
                                :value="form.selectedYear"
                                :years="{ min: 1962, max: currentYear }"
                                @clean="cleanForm"
                                @close="handleYear()"
                                @input="handleYear"
                  />
                  <model-options v-else-if="showModelOptions" key="model"
                                 :input-title="$t('model_name')"
                                 :options="options.models"
                                 :sort-alphabetically="false"
                                 :status-title="$t('select_model')"
                                 :title="$t('model')"
                                 :value="form.selectedModel"
                                 @clean="cleanForm"
                                 @close="handleModel()"
                                 @input="handleModel($event.id)"
                  />
                  <model-options v-else-if="showBrandOptions" key="brand"
                                 :img-key="'transformed_media'"
                                 :img-placeholder="`/logos/moto-${colorMode}.svg`"
                                 :input-title="$t('brand_name')"
                                 :options="options.brands.filter(b => b.models_count)"
                                 :status-title="$t('select_brand')"
                                 :title="$t('mark')"
                                 :value="form.selectedBrand"
                                 disable-clean
                                 @close="$router.push($localePath('/sell'))"
                                 @input="handleBrand($event.id)"
                  />
               </div>
            </div>
            <div v-if="!isMobileBreakpoint && showLastStep" class="col-auto">
               <div class="card">
                  <sell-preview :brand="brand" :form="form" :model="model"/>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

import {MenusDataMixin} from '~/mixins/menus-data';

import VehicleOptions from '~/components/options/VehicleOptions';
import ModelOptions from '~/components/options/ModelOptions';
import YearOptions from '~/components/options/YearOptions';
import SellLastStep from '~/components/sell/SellLastStep';
import SellSelectedModel from '~/components/sell/SellSelectedModel';
import SellPreview from '~/components/sell/SellPreview';
import SellProgress from '~/components/sell/SellProgress';

export default {
   name: 'pages-sell-moto',
   middleware: 'sell_tokens',
   mixins: [MenusDataMixin],
   components: {
      VehicleOptions,
      ModelOptions,
      YearOptions,
      SellLastStep,
      SellSelectedModel,
      SellPreview,
      SellProgress
   },
   nuxtI18n: {
      paths: {
         az: '/satmaq/moto'
      }
   },
   head() {
      return this.$headMeta({
         title: this.$t('meta-title_moto-sell'),
         description: this.$t('meta-descr_moto-sell')
      });
   },
   async asyncData({route, store, app}) {
      let category = parseInt(['1', '2', '3'].includes(route.query.category) ? route.query.category : '1');

      store.dispatch('setSellPreviewData', {value: {}});
      await Promise.all([
         store.dispatch('getMotoOptions'),
         store.dispatch('getOptions'),
         store.dispatch('getColors'),
      ]);

      return {
         showBrandOptions: true,
         showModelOptions: false,
         showYearOptions: false,
         showLastStep: false,
         lastStepKey: 0,
         form: {
            end_date: '',
            auction: 1,
            country_id: null,
            category,
            selectedBrand: '',
            selectedModel: '',
            selectedYear: '',
            selectedColor: '',
            youtube: {
               id: '',
               thumb: ''
            },
            mileage: '',
            mileage_measure: 1,
            region_id: 1,
            address: '',
            lat: 0,
            lng: 0,
            vin: '',
            price: '',
            owner_type: 0,
            currency: 1,
            car_number: '',
            show_car_number: 0,
            show_vin: 0,
            all_options: {},
            comment: '',
            is_new: false,
            beaten: false,
            customs_clearance: false,
            tradeable: false,
            credit: false,
            guaranty: false,
            saved_images: [],
            btl_cookie: app.$cookies.get('btl') || '',
            is_rent: false,
         }
      }
   },
   methods: {
      ...mapActions(['getMotoModels']),
      goBack() {

         if (this.form.selectedYear) {
            this.form.selectedYear = '';
            this.showLastStep = false;
         } else if (this.form.selectedModel) {
            this.showYearOptions = false;
            this.form.selectedModel = '';
         } else if (this.form.selectedBrand) {
            this.showModelOptions = false;
            this.form.selectedBrand = '';
         }

      },
      getFormValues(...keys) {
         let form = {};
         keys.map(key => {
            form[key] = this.form[key]
         });
         return form;
      },
      handleCategory(category) {
         this.form.category = category;
         this.$pushQueryParam({key: 'category', value: category});
      },
      async handleBrand(id = '') {
         this.form.selectedBrand = id;
         if (id) {
            await this.getMotoModels({category: `${this.form.category}`, id});
            this.showModelOptions = true;
         }
         this.scrollReset();
      },
      async handleModel(id = '') {
         this.form.selectedModel = id;
         if (id) {
            this.showYearOptions = true;
         } else {
            this.form.selectedBrand = '';
            this.showModelOptions = false;
         }
         this.scrollReset();
      },
      async handleYear(year = '') {
         this.form.selectedYear = year;

         if (year) {
            this.showLastStep = true;
         } else {
            this.form.selectedModel = '';
            this.showYearOptions = false;
         }
      },
      cleanForm() {
         this.showLastStep = false;
         this.handleYear();
         this.handleModel();
      }
   },
   computed: {
      ...mapGetters(['motoOptions', 'motorcycleModels', 'scooterModels', 'atvModels']),

      options() {
         switch (this.form.category) {
            case 1:
               return {brands: this.motoOptions.brands, models: this.motorcycleModels[0]}
            case 2:
               return {brands: this.motoOptions.scooter_brands, models: this.scooterModels[0]}
            case 3:
               return {brands: this.motoOptions.atv_brands, models: this.atvModels[0]}
         }
         return {brands: [], models: []}
      },
      brand() {
         return this.options?.brands?.find(brand => brand.id === this.form.selectedBrand);
      },
      model() {
         return this.options?.models?.find(model => model.id === this.form.selectedModel);
      },

      crumbs() {
         return [
            {name: this.$t('place_an_ad'), route: '/sell'},
            {name: this.$t('moto')}
         ]
      }
   }
}
</script>
