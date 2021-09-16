<template>
  <div class="pages-sell">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <sell-progress :form="form" />
      <div class="sell_cards-row row">
        <div class="col-auto">
          <div :class="{'card': !isMobileBreakpoint}">
            <sell-selected-model v-if="showModelOptions" 
              :brand="brand"
              :model="model"
              :year="form.year"
              :allow-clear="showModelOptions"
              @clean="cleanForm"
            />
            <sell-last-step type="cars" v-if="showLastStep" 
              :key="lastStepKey"
              :initial-form="form"
              :title="`${brand.name} ${model.name}, ${form.year}`"
              @close="showLastStep = false, lastStepKey++, form.year = ''"
              @clean="cleanForm"
            />
            <year-options v-else-if="showYearOptions"
              :years="sellYears" 
              :title="$t('prod_year')"
              :value="form.year"
              @input="handleYear"
              @close="handleYear()"
              @clean="cleanForm"
            />
            <model-options key="model" v-else-if="showModelOptions"
              :options="models" 
              :title="$t('model')"
              :status-title="$t('select_model')"
              :input-title="$t('model_name')"
              :value="form.model"
              :sort-alphabetically="false"
              @input="handleModel($parseSlug($event.slug))"
              @close="handleModel()"
              @clean="cleanForm"
            />
            <model-options key="brand" v-else-if="showBrandOptions"
              :options="brands" 
              :popular-options="[129,483,8,1,767,117]"
              :title="$t('mark')"
              :status-title="$t('select_brand')"
              :input-title="$t('brand_name')"
              :value="form.brand"
              :img-key="'transformed_media'"
              @input="handleBrand($parseSlug($event.slug))"
              @close="$router.push($localePath('/sell'))"
              disable-clean
            />
          </div>
        </div>
        <div class="col-auto" v-if="!isMobileBreakpoint && showLastStep">
          <div class="card">
            <sell-preview :brand="brand" :model="model" :form="form" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import ModelOptions from '~/components/options/ModelOptions';
import YearOptions from '~/components/options/YearOptions';
import SellLastStep from '~/components/sell/SellLastStep';
import SellSelectedModel from '~/components/sell/SellSelectedModel';
import SellPreview from '~/components/sell/SellPreview';
import SellProgress from '~/components/sell/SellProgress';

export default {
  name: 'pages-sell-cars',
  middleware: 'sellTokens',
  components: {
    ModelOptions,
    YearOptions,
    SellLastStep,
    SellSelectedModel,
    SellPreview,
    SellProgress
  },
  nuxtI18n: {
    paths: {
      az: '/satmaq/masinlar'
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('meta-title_sell'),
      description: this.$t('meta-descr_sell')
    });
  },
  async asyncData({ store, app }) {
    await Promise.all([
      store.dispatch('getBrands'),
      store.dispatch('getOptions'),
      store.dispatch('getColors'),
      store.dispatch('getAllOtherOptions'),
      store.dispatch('getPopularOptions')
    ]);

    return {
      showBrandOptions: true,
      showModelOptions: false,
      showYearOptions: false,
      showLastStep: false,
      lastStepKey: 0,
      form: {
        car_catalog_id: '',
        brand: '',
        model: '',
        generation_id: '',
        car_body_type: '',
        gearing: '', // engines
        modification: '', // transmissions/box
        transmission: '', // gearing
        capacity: '',
        power: '',          
        year: '',
        youtube: {
          id: '',
          thumb: ''
        },
        selectedColor: [],
        is_matte: false,
        mileage: '',
        mileage_measure: 1,
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
        part: {},
        all_options: {},
        comment: '',
        autogas: false,
        is_new: false, 
        beaten: false, 
        customs_clearance: false, 
        tradeable: false, 
        credit: false,
        guaranty: false, 
        saved_images: [],
        btl_cookie: app.$cookies.get('btl') || ''
      }
    }
  },
  methods: {
    ...mapActions(['getModels', 'getSellYears']),

    getFormValues(...keys) {
      let form = {};
      keys.map(key => {form[key] = this.form[key]});
      return form;
    },
    async handleBrand(slug = '') {
      this.form.brand = slug;
      if (slug) {
        await this.getModels(this.form.brand);
        this.showModelOptions = true;
      }
      this.scrollReset();
    },
    async handleModel(slug = '') {
      this.form.model = slug;
      if (slug) {
        await this.getSellYears(this.getFormValues('brand','model'));
        this.showYearOptions = true;
      } else {
        this.form.brand = '';
        this.showModelOptions = false;
      }
      this.scrollReset();
    },
    async handleYear(year = '') {
      this.form.year = year;
      if (year) {
        this.showLastStep = true;
      } else {
        this.form.model = '';
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
    ...mapGetters(['brands', 'models', 'sellYears']),

    brand() {
      return this.brands?.find(brand => this.$parseSlug(brand.slug) === this.form.brand);
    },
    model() {
      return this.models?.find(model => this.$parseSlug(model.slug) === this.form.model);
    },

    crumbs() {
      return [
        { name: this.$t('place_an_ad'), route: '/sell' },
        { name: this.$t('cars') }
      ]
    }
  }
}
</script>