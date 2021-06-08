<template>
  <div class="pages-sell">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="row">
        <div class="col-auto">
          <div :class="{'card': !isMobileBreakpoint}">
            <sell-selected-model v-if="showModelOptions" 
              :brand="brand"
              :model="model"
              :year="form.selectedYear"
              :allow-clear="!showLastStep"
              @clean="cleanForm"
            />
            <vehicle-options v-else-if="!isMobileBreakpoint" icons-only select-by-key
              :options="searchMenus[2].children" 
              :value="form.category" 
              @input="handleCategory($event.key)" 
            />
            <sell-last-step v-if="showLastStep" 
              :key="lastStepKey"
              :initial-form="form"
              :title="`${brand.name} ${model.name}, ${form.selectedYear}`"
              @close="showLastStep = false, lastStepKey++"
            />
            <year-options v-else-if="showYearOptions"
              :years="{ min: 1972, max: currentYear }" 
              :title="$t('prod_year')"
              :value="form.selectedYear"
              @input="handleYear"
              @close="handleYear()"
            />
            <model-options key="model" v-else-if="showModelOptions"
              :options="commercialModels[0]" 
              :title="$t('model')"
              :status-title="$t('select_model')"
              :input-title="$t('model_name')"
              :value="form.selectedModel"
              @input="handleModel($event.id)"
              @close="handleModel()"
            />
            <model-options key="brand" v-else-if="showBrandOptions"
              :options="commercialBrands" 
              :title="$t('mark')"
              :status-title="$t('select_brand')"
              :input-title="$t('brand_name')"
              :value="form.selectedBrand"
              @input="handleBrand($event.id)"
              @close="$router.push($localePath('/sell'))"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { MenusDataMixin } from '~/mixins/menus-data';

import VehicleOptions from '~/components/options/VehicleOptions';
import ModelOptions from '~/components/options/ModelOptions';
import YearOptions from '~/components/options/YearOptions';
import SellLastStep from '~/components/sell/SellLastStep';
import SellSelectedModel from '~/components/sell/SellSelectedModel';

export default {
  name: 'pages-sell-commercial',
  middleware: 'sellTokens',
  mixins: [MenusDataMixin],
  components: {
    VehicleOptions,
    ModelOptions,
    YearOptions,
    SellLastStep,
    SellSelectedModel
  },
  nuxtI18n: {
    paths: {
      az: '/satmaq/ticari-avtomobiller'
    }
  },
  async asyncData({ route, store }) {
    let category = ['1','2','3','4','5','6','7','8','9','10','11','13'].includes(route.query.category) 
      ? route.query.category : '1';
    
    await Promise.all([
      store.dispatch('getCommercialBrands', category),
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
        region_id: '',
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
        badges: [],
        new_badges: [],
        comment: '',
        is_new: false, 
        beaten: false, 
        customs_clearance: false, 
        tradeable: false, 
        credit: false,
        guaranty: false, 
        saved_images: []
      }
    }
  },
  methods: {
    ...mapActions(['getCommercialBrands', 'getCommercialModels']),

    getFormKeys(...keys) {
      let form = {};
      keys.map(key => {form[key] = this.form[key]});
      return form;
    },
    async handleCategory(key) {
      await this.getCommercialBrands(key);
      this.form.category = key;
      this.$pushQueryParam({ key: 'category', value: key });
    },
    async handleBrand(id = '') {
      this.form.selectedBrand = id;
      if (id) {
        await this.getCommercialModels({ category: this.form.category, id });
        this.showModelOptions = true;
      }
      window.scrollTo(0, 0);
    },
    async handleModel(id = '') {
      this.form.selectedModel = id;
      if (id) {
        this.showYearOptions = true;
      } else {
        this.showModelOptions = false;
      }
      window.scrollTo(0, 0);
    },
    async handleYear(year = '') {
      this.form.selectedYear = year;
      if (year) {
        this.showLastStep = true;
      } else {
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
    ...mapGetters(['commercialBrands', 'commercialModels']),

    brand() {
      return this.commercialBrands?.find(brand => brand.id === this.form.selectedBrand);
    },
    model() {
      return this.commercialModels?.[0]?.find(model => model.id === this.form.selectedModel);
    },

    crumbs() {
      return [
        { name: this.$t('place_an_ad'), route: '/sell' },
        { name: this.$t('commercial') }
      ]
    }
  }
}
</script>